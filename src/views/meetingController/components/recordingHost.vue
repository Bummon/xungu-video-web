<script setup lang="ts">
import { ref, defineProps } from "vue";
import rtspPlayer from "@/components/rtspPlayer/index.vue";
import axios from "axios";
import { ElMessage, ElNotification } from "element-plus";
import { EquipmentControlHttp } from "@/api/modules/equipmentControl";
import { MeetingControllerHandle } from "@/views/meetingController/index";
import { nodeBaseURLHttp } from "@/api/nodeServer";

const props = defineProps({
  data: Array,
  ip: String
});
const flag = ref(false); // 是否要加载视频  假如没有ip 直接全部不加载
const rtspList = ref<string[]>([
  "rtsp://admin:888888@192.168.1.89:8554",
  "rtsp://admin:888888@192.168.1.89:8556",
  "rtsp://admin:888888@192.168.1.89:8558",
  "rtsp://admin:888888@192.168.1.89:8560",
  "rtsp://admin:888888@192.168.1.89:8562",
  "rtsp://admin:888888@192.168.1.89:8564"
]);
const baseURL = nodeBaseURLHttp;

const playerIndex = ref(0); // 选择哪一路
const fileList = ref([]);
const children = ref([]);
const drawerVisible = ref(false);
const playerVisible = ref(false);
const playerUrl = ref(""); // 播放mp4的地址
const activeEquipment = ref(); // 选取的设备
const commandVos = ref({
  start: {
    commandCode: 523,
    commandContext: "AAA BBB CCC DDD EEE FFF ",
    commandDescr: null,
    commandFormat: "十六进制",
    commandName: "摄像机左转",
    createTime: "2023-07-21 15:00:57",
    createUserId: 5570288556997,
    createUserName: "Admin",
    deletedFlag: 0,
    equipmentCode: null,
    modifyTime: "2023-08-09 11:50:57",
    modifyUserId: 5570288556997,
    modifyUserName: "Admin"
  },
  stop: {}
});
const switchStream = index => {
  playerIndex.value = index;
};
const openFileBag = item => {
  children.value = item.children;
  drawerVisible.value = true;
};
// 播放
const playVideo = item => {
  playerUrl.value = item.replace("http://", `http://admin:888888@`);
  playerVisible.value = true;
};
const download = (filename, url) => {
  let a = document.createElement("a");
  a.style = "display: none"; // 创建一个隐藏的a标签
  a.download = filename;
  a.href = url.replace("http://", `http://admin:888888@`);
  document.body.appendChild(a);
  a.click(); // 触发a标签的click事件
  document.body.removeChild(a);
};

// 切换设备
async function tabEquipment(item, index) {
  console.log(item, index);
  activeEquipment.value = item;
  await selectEquipmentData(item);
}

const terminalState = ref();

// 点了开关按钮
async function ch(status: 2 | 1) {
  // 方法内 第一次调用修改  第二次调用查询
  terminalState.value = await MeetingControllerHandle.updateSwitchState(activeEquipment.value.terminalId, props.ip, status);
  console.log("切换后的开关机状态", terminalState.value);
}

// 初始化
async function init() {
  if (props.data.constructor === Array && props.data.length > 0) {
    activeEquipment.value = props.data[0];
    await selectEquipmentData(props.data[0]);
  }
}

async function selectEquipmentData(equipment) {
  console.log(`会议录播系统设备详情/n`, equipment);
  await getData(equipment);
  // 获取开关状态
  terminalState.value = await MeetingControllerHandle.getTerminalStatus(equipment.terminalId, props.ip);
}

// 获取设备信息
async function getData(equipmentData) {
  if (equipmentData.ip) {
    await axios
      .get(baseURL + `/api/fileList?url=${equipmentData.ip}`)
      .then(res => {
        console.log("查询文件列表返回的res", res);
        if (res?.data?.code === 200) {
          console.log("只有请求成功了 才能证明流也可以通");
          fileList.value = res.data?.data;
          if (equipmentData.rtsp) {
            rtspList.value = JSON.parse(equipmentData.rtsp);
            console.log("rtsp列表", rtspList.value);
            flag.value = true;
          } else {
            ElMessage.error("推流地址未设置！");
            flag.value = false;
          }
        } else {
          fileList.value = [];
        }
      })
      .catch(e => {
        fileList.value = [];
      });
  } else {
    ElNotification({
      title: "操作失败",
      message: "录播主机未配置IP！请先配置IP地址！",
      type: "error",
      duration: 3000
    });
  }
  let list = equipmentData.commandVos;
  commandVos.value.start = list.filter(item => item.commandName === "录制开始")[0];
  commandVos.value.stop = list.filter(item => item.commandName === "录制停止")[0];
}

init();

/**
 * 发送命令
 */
function sendCommand(command) {
  let params = command;
  params.ip = props.ip;
  EquipmentControlHttp.sendCommand(params)
    .then(res => {
      console.log(res);
      ElMessage.success("操作成功！");
    })
    .catch(e => {
      console.log(e);
      ElMessage.success("操作失败，请稍后再试。");
    });
}

/**
 * 顺序开启
 */
function startRecord() {
  let command = {
    commandCode: commandVos.value.start.commandCode, // 	命令编号
    commandContext: commandVos.value.start.commandContext, // 	协议内容
    commandFormat: commandVos.value.start.commandFormat, // 	协议格式
    commandId: commandVos.value.start.commandId, // 	命令id
    commandName: commandVos.value.start.commandName, // 命令名称
    equipmentCode: commandVos.value.start.equipmentCode // 命令名称
  };
  sendCommand(command);
}

function stopRecord() {
  let command = {
    commandCode: commandVos.value.stop.commandCode, // 	命令编号
    commandContext: commandVos.value.stop.commandContext, // 	协议内容
    commandFormat: commandVos.value.stop.commandFormat, // 	协议格式
    commandId: commandVos.value.stop.commandId, // 	命令id
    commandName: commandVos.value.stop.commandName, // 命令名称
    equipmentCode: commandVos.value.stop.equipmentCode // 命令名称
  };
  sendCommand(command);
}

async function tabSwitch(status: 2 | 1) {
  // 方法内 第一次调用修改  第二次调用查询
  terminalState.value = await MeetingControllerHandle.updateSwitchState(activeEquipment.value.terminalId, props.ip, status);
  console.log("切换后的开关机状态", terminalState.value);
}
</script>

<template>
  <div class="component_container" id="recording-host">
    <div class="equipment_list">
      <p
        v-for="(item, index) in props.data"
        :key="item.terminalId"
        :class="activeEquipment.terminalId === item.terminalId ? 'isActive' : ''"
        @click="tabEquipment(item, index)"
      >
        {{ item.terminalName }}
      </p>
    </div>
    <div class="component_title">
      <p>
        {{ activeEquipment.terminalName }}
        <span v-if="activeEquipment.runningStatus === 0" class="breakdown"> （故障）</span>
        <span v-if="activeEquipment.runningStatus === 1" class="online"> （在线）</span>
        <span v-if="activeEquipment.runningStatus === 2" class="offline"> （离线）</span>
        <span>{{ terminalState === "1" ? "已开机" : terminalState === "0" ? "已关机" : "" }} </span>
      </p>
      <div class="button_box">
        <button v-show="terminalState === '0'" @click="tabSwitch(1)">开机</button>
        <button v-show="terminalState === '1'" @click="tabSwitch(2)">关机</button>
      </div>
    </div>
    <div class="component_main record_main" v-if="activeEquipment.runningStatus !== 0">
      <div class="record_main_left">
        <div class="record_main_left_top">
          <div class="record_main_left_title">直播画面</div>
          <div class="record_main_left_video">
            <rtspPlayer
              :width="500"
              :url="rtspList[0]"
              v-if="flag && playerIndex === 0 && rtspList[0].includes('rtsp')"
            ></rtspPlayer>
            <rtspPlayer
              :width="500"
              :url="rtspList[1]"
              v-if="flag && playerIndex === 1 && rtspList[1].includes('rtsp')"
            ></rtspPlayer>
            <rtspPlayer
              :width="500"
              :url="rtspList[2]"
              v-if="flag && playerIndex === 2 && rtspList[2].includes('rtsp')"
            ></rtspPlayer>
            <rtspPlayer
              :width="500"
              :url="rtspList[3]"
              v-if="flag && playerIndex === 3 && rtspList[3].includes('rtsp')"
            ></rtspPlayer>
            <rtspPlayer
              :width="500"
              :url="rtspList[4]"
              v-if="flag && playerIndex === 4 && rtspList[4].includes('rtsp')"
            ></rtspPlayer>
            <rtspPlayer
              :width="500"
              :url="rtspList[5]"
              v-if="flag && playerIndex === 5 && rtspList[5].includes('rtsp')"
            ></rtspPlayer>
            <!--            <div class="noSign" v-else>-->
            <!--&lt;!&ndash;              <p>未配置IP地址或推流地址无效</p>&ndash;&gt;-->
            <!--            </div>-->
          </div>
        </div>
        <div class="record_main_left_bottom">
          <div class="record_main_left_title">直播流切换</div>
          <div class="record_main_switchChannel">
            <button
              class="btn-6"
              v-for="(item, index) in rtspList"
              :key="item"
              @click="switchStream(index)"
              :class="playerIndex === index ? 'btn_active' : ''"
            >
              <span></span><span></span><span></span>{{ index === 5 ? "导播" : `频道${index + 1}` }}
            </button>
          </div>
        </div>
      </div>
      <div class="record_main_right">
        <div class="record_main_right_top">
          <p class="record_main_right_title" style="font-size: 1.5vw">录制</p>
          <div class="record_top_button">
            <p @click="startRecord" v-if="commandVos.start?.commandId">开始</p>
            <p @click="stopRecord" v-if="commandVos.stop?.commandId">停止</p>
          </div>
        </div>
        <div class="record_main_right_mid"></div>
        <div class="record_main_right_bottom">
          <p class="record_main_right_bottom_title">录制文件列表</p>
          <div class="record_main_right_bottom_fileList">
            <p class="record_main_right_bottom_fileList_firstSpan_header">文件夹名</p>
            <p class="record_main_right_bottom_fileList_secondSpan_header">操作</p>
          </div>
          <div class="record_main_right_bottom_fileList" v-for="item in fileList" :key="item.filesName">
            <p class="record_main_right_bottom_fileList_firstSpan">{{ item.filesName }}</p>
            <p class="record_main_right_bottom_fileList_secondSpan" @click="openFileBag(item)">
              <button>打开文件夹</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="drawerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :show-close="true"
      title="录播文件列表"
      width="40%"
      draggable
    >
      <el-row style="margin: 0 auto 1vh; font-weight: bold; text-align: center" class="row-dia">
        <el-col :span="16" class="col-dia">
          <span>视频文件</span>
        </el-col>
        <el-col :span="4" class="col-dia">
          <span>下载</span>
        </el-col>
        <el-col :span="4" class="col-dia">
          <span>播放</span>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in children" :key="item" style="margin: 1vh auto" class="row-dia">
        <el-col :span="16" class="col-dia">
          <span>{{ item }}</span>
        </el-col>
        <el-col :span="4" class="col-dia">
          <el-button type="primary" size="small" @click="download(`视频${index}`, item)">下载</el-button>
        </el-col>
        <el-col :span="4" class="col-dia">
          <el-button type="primary" size="small" @click="playVideo(item)">播放</el-button>
        </el-col>
      </el-row>
      <el-dialog
        v-model="playerVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :show-close="true"
        title="点播"
        draggable
        width="30%"
      >
        <div class="" style="display: flex; align-items: center; justify-content: center">
          <video :src="playerUrl" controls style="width: 500px" autoplay></video>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@import "../index.scss";
@import "./components.scss";
#recording-host {
  .equipment_list {
    display: flex;
    width: 100%;
    height: 4vh;
    margin: 0.5vh auto;
    overflow-x: scroll;
    p {
      width: 5vw;
      height: 4vh;
      margin: 0 2px;
      line-height: 4vh;
      text-align: center;
      cursor: pointer;
      background-color: $--meetControl-card-gray-bgc;
      border: 2px solid $--meetControl-card-gray-border;
    }
    .isActive {
      background-color: $main-color-primary-transparent;
      border: 2px solid $main-color-primary;
    }
  }
}
.record_main {
  display: flex;
  align-items: center;
  justify-content: space-around;
  .record_main_left {
    width: 40vw;
    height: 75vh;
    margin: 0 0 0 1vw;
    background-color: rgb(242 241 237 / 10%);
    .record_main_left_title {
      width: 70%;
      padding: 0 1vw;
      font-size: 0.9vw;
      text-align: left;
      letter-spacing: 2px;
      background-color: $main-color-primary;
      border-bottom-right-radius: 8vh;
    }
    .record_main_left_top {
      .record_main_left_video {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 30vh;
        .noSign {
          width: 90%;
          height: 28vh;
          margin: 1vh auto;
          background-color: #080101;
          p {
            width: 100%;
            height: 28vh;
            font-size: 1vw;
            line-height: 25vh;
            color: #ffffff;
            text-align: center;
            letter-spacing: 2px;
          }
        }
      }
    }
    .record_main_left_bottom {
      height: calc(100% - 35vh);
      background-color: rgb(0 0 0 / 10%);
      .record_main_switchChannel {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-around;
        height: 34vh;
        padding: 2vh 0;

        /* Button 6 */
        .btn-6 {
          position: relative;
          flex: 0 0 26%;
          padding: 0.5vh 1vw;
          font-size: 22px;
          font-weight: 500;
          color: $font-color-primary;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          background: transparent;
          border: none;
          border-radius: 10px 100px / 120px;
          outline-color: transparent;
          transition: all 0.1s ease;
        }
        .btn-6 span:nth-child(1)::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: "";
          border: 2px solid $border-primary;
          border-radius: 10px 100px / 120px;
          opacity: 0.5;
        }
        .btn-6 span:nth-child(2)::before {
          position: absolute;
          top: -6px;
          left: -7px;
          width: 105%;
          height: 125%;
          content: "";
          border: 2px solid $border-primary;
          border-radius: 10px 100px / 120px;
          opacity: 0.5;
        }
        .btn-6 span:nth-child(3)::before {
          position: absolute;
          top: -13px;
          left: -14px;
          width: 110%;
          height: 150%;
          content: "";
          border: 2px solid $border-primary;
          border-radius: 10px 100px / 120px;
          opacity: 0.5;
        }
        .btn_active {
          color: #1b2124;
          background: $border-primary;
          box-shadow: 0 0 10px $border-primary;
          opacity: 1;
          span:nth-child(1)::before {
            box-shadow: 0 0 5px $border-primary, 0 0 5px $border-primary, inset 0 0 3px $border-primary;
            opacity: 1;
          }
          span:nth-child(2)::before {
            opacity: 1;
          }
          span:nth-child(3)::before {
            box-shadow: 0 0 5px $border-primary, 0 0 5px $border-primary, inset 0 0 5px $border-primary;
            opacity: 1;
          }
        }
        .btn-6:hover span:nth-child(2)::before,
        .btn-6:focus span:nth-child(2)::before {
          box-shadow: 0 0 5px $border-primary, 0 0 5px $border-primary, inset 0 0 3px $border-primary;
          opacity: 1;
        }
        .btn-6:hover span:nth-child(3)::before,
        .btn-6:focus span:nth-child(3)::before {
          box-shadow: 0 0 10px $border-primary, 0 0 10px $border-primary, inset 0 0 5px $border-primary;
          opacity: 1;
        }
        .btn-6:hover,
        .btn-6:focus {
          color: #1b2124;
          background: $border-primary;
          box-shadow: 0 0 10px $border-primary;
          opacity: 1;
        }
      }
    }
  }
  .record_main_right {
    width: 40vw;
    height: 75vh;
    margin: 0 1vw;
    .record_main_right_top {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      height: 25vh;
      background-color: $--meetControl-card-gray-bgc;
      .record_top_button {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 20vh;
        p {
          padding: 1vh 1.5vw;
          margin: 0 1vw;
          cursor: pointer;
          background-color: rgb(255 255 255 / 12%);
          border: 2px solid transparent;
          border-radius: 5px;
          &:hover {
            background-color: $main-color-primary-transparent;
            border: 2px solid $border-primary;
          }
        }
      }
    }
    .record_main_right_mid {
      height: 5vh;
      margin: 1vh 0;
      background-color: $--meetControl-card-gray-bgc;
    }
    .record_main_right_bottom {
      width: 100%;
      height: 43vh;
      background-color: $--meetControl-card-gray-bgc;
      .record_main_right_bottom_title {
        padding: 1vh 1vw;
        font-size: 1vw;
        text-align: center;
      }
      .record_main_right_bottom_fileList {
        display: flex;
        margin: 0.5vh 1vw;
        font-size: 0.8vw;
        text-align: center;
        .record_main_right_bottom_fileList_firstSpan_header,
        .record_main_right_bottom_fileList_secondSpan_header {
          font-weight: bold;
          color: $font-color-primary;
        }
        .record_main_right_bottom_fileList_firstSpan_header,
        .record_main_right_bottom_fileList_firstSpan {
          width: 60%;
          padding: 0.5vh 0;
          margin-right: 0.5vw;
          background-color: rgb(237 233 233 / 38%);
        }
        .record_main_right_bottom_fileList_secondSpan_header,
        .record_main_right_bottom_fileList_secondSpan {
          width: 40%;
          padding: 0.5vh 0;
          cursor: pointer;
          background-color: rgb(237 233 233 / 38%);
        }
      }
    }
  }
}
.record_main_right_title {
  font-size: 1.5vw;
  text-align: center;
}
:deep(.el-dialog) {
  overflow: hidden;
  background-color: rgb(6 1 1 / 63%);
  border-radius: 10px;
  .el-dialog__header {
    background-color: rgb(255 255 255 / 83%);
  }
  .el-dialog__body {
    background-color: rgb(125 125 125 / 75%);
    .row-dia {
      .col-dia {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px 2px;
        border-bottom: 1px solid #908b8b;
        span {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
