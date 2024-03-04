<script setup lang="ts">
import { ref, defineProps } from "vue";
import { ElNotification } from "element-plus";
import { MeetSourceType } from "@/api/interface/source";
import { EquipmentControlHttp } from "@/api/modules/equipmentControl";
import { VideoCameraHandle } from "@/views/meetingController/components/VideoCameraHandle";
import { MeetingControllerHandle } from "@/views/meetingController/index";

const props = defineProps({
  data: Array,
  tabEquipment: Function,
  ip: String
});

/**
 * 切换相机
 * @param item
 */
function tabCamera(item) {
  // 清洗出预置位
  presettingBit.value = VideoCameraHandle.getPresetBit(item.commandVos);
  setPresetList.value = VideoCameraHandle.getSetPresetBit(item.commandVos);
  console.log("预置位列表", presettingBit.value);
  operations.value = VideoCameraHandle.getOperation(item.commandVos);
  console.log(operations.value);
}

const activeCamera = ref<MeetSourceType.terminal>({
  terminalId: 0,
  terminalName: "01号机位"
});
const dialogVisible = ref<boolean>(false);

// 切换相机
function tabVideo(item) {
  activeCamera.value = item;
  tabCamera(item);
  props.tabEquipment(item);
}

// 开关状态
const terminalState = ref(3); // 电源开关机状态
const presettingBit = ref([]); // 预置位列表
const setPresetList = ref([]);
const operations = ref([]); // 操作按键列表
/**
 * 发送命令
 */
async function sendCommand(command) {
  console.log(command);
  await EquipmentControlHttp.sendCommand({
    commandCode: command.commandCode, // 	命令编号
    commandContext: command.commandContext, // 	协议内容
    commandFormat: command.commandFormat, // 	协议格式
    commandId: command.commandId, // 	命令id
    commandName: command.commandName, // 命令名称
    equipmentCode: command.equipmentCode, // 命令名称
    ip: props.ip // ip;
  });
}

// 点了开关按钮
async function tabSwitch(status: 2 | 1) {
  // 方法内 第一次调用修改  第二次调用查询
  terminalState.value = await MeetingControllerHandle.updateSwitchState(activeCamera.value.terminalId, props.ip, status);
  console.log("切换后的开关机状态", terminalState.value);
}

/**
 * 初始化函数
 */
async function init() {
  activeCamera.value = props.data[0] || [];
  tabCamera(activeCamera.value);
  // 获取开关状态
  terminalState.value = await MeetingControllerHandle.getTerminalStatus(activeCamera.value.terminalId, props.ip);
}

function stop() {
  console.log("鼠标抬起");
  if (operations.value.ok.constructor === Array && operations.value.ok.length > 0) {
    let command = {
      commandCode: operations.value.ok[0].commandCode, // 	命令编号
      commandContext: operations.value.ok[0].commandContext, // 	协议内容
      commandFormat: operations.value.ok[0].commandFormat, // 	协议格式
      commandId: operations.value.ok[0].commandId, // 	命令id
      commandName: operations.value.ok[0].commandName, // 命令名称
      equipmentCode: operations.value.ok[0].equipmentCode // 命令名称
    };
    sendCommand(command);
  }
}

function turnLeft() {
  if (operations.value.left.constructor === Array && operations.value.left.length > 0) {
    let command = {
      commandCode: operations.value.left[0].commandCode, // 	命令编号
      commandContext: operations.value.left[0].commandContext, // 	协议内容
      commandFormat: operations.value.left[0].commandFormat, // 	协议格式
      commandId: operations.value.left[0].commandId, // 	命令id
      commandName: operations.value.left[0].commandName, // 命令名称
      equipmentCode: operations.value.left[0].equipmentCode // 命令名称
    };
    sendCommand(command);
  } else {
    console.log("此设备未配置该功能");
  }
}

function turnRight() {
  if (operations.value.right.constructor === Array && operations.value.right.length > 0) {
    let command = {
      commandCode: operations.value.right[0].commandCode, // 	命令编号
      commandContext: operations.value.right[0].commandContext, // 	协议内容
      commandFormat: operations.value.right[0].commandFormat, // 	协议格式
      commandId: operations.value.right[0].commandId, // 	命令id
      commandName: operations.value.right[0].commandName, // 命令名称
      equipmentCode: operations.value.right[0].equipmentCode // 命令名称
    };
    sendCommand(command);
  } else {
    console.log("此设备未配置该功能");
  }
}

function turnUp() {
  if (operations.value.up.constructor === Array && operations.value.up.length > 0) {
    let command = {
      commandCode: operations.value.up[0].commandCode, // 	命令编号
      commandContext: operations.value.up[0].commandContext, // 	协议内容
      commandFormat: operations.value.up[0].commandFormat, // 	协议格式
      commandId: operations.value.up[0].commandId, // 	命令id
      commandName: operations.value.up[0].commandName, // 命令名称
      equipmentCode: operations.value.up[0].equipmentCode // 命令名称
    };
    sendCommand(command);
  } else {
    console.log("此设备未配置该功能");
  }
}

function turnDown() {
  if (operations.value.down.constructor === Array && operations.value.down.length > 0) {
    let command = {
      commandCode: operations.value.down[0].commandCode, // 	命令编号
      commandContext: operations.value.down[0].commandContext, // 	协议内容
      commandFormat: operations.value.down[0].commandFormat, // 	协议格式
      commandId: operations.value.down[0].commandId, // 	命令id
      commandName: operations.value.down[0].commandName, // 命令名称
      equipmentCode: operations.value.down[0].equipmentCode // 命令名称
    };
    sendCommand(command);
  } else {
    console.log("此设备未配置该功能");
  }
}

function turnZoomIn() {
  console.log("调用拉近");
  if (operations.value.zoomIn.constructor === Array && operations.value.zoomIn.length > 0) {
    let command = {
      commandCode: operations.value.zoomIn[0].commandCode, // 	命令编号
      commandContext: operations.value.zoomIn[0].commandContext, // 	协议内容
      commandFormat: operations.value.zoomIn[0].commandFormat, // 	协议格式
      commandId: operations.value.zoomIn[0].commandId, // 	命令id
      commandName: operations.value.zoomIn[0].commandName, // 命令名称
      equipmentCode: operations.value.zoomIn[0].equipmentCode // 命令名称
    };
    sendCommand(command);
  } else {
    console.log("此设备未配置该功能");
  }
}

function turnZoomOut() {
  console.log("调用拉远");
  if (operations.value.zoomOut.constructor === Array && operations.value.zoomOut.length > 0) {
    let command = {
      commandCode: operations.value.zoomOut[0].commandCode, // 	命令编号
      commandContext: operations.value.zoomOut[0].commandContext, // 	协议内容
      commandFormat: operations.value.zoomOut[0].commandFormat, // 	协议格式
      commandId: operations.value.zoomOut[0].commandId, // 	命令id
      commandName: operations.value.zoomOut[0].commandName, // 命令名称
      equipmentCode: operations.value.zoomOut[0].equipmentCode // 命令名称
    };
    sendCommand(command);
  } else {
    console.log("此设备未配置该功能");
  }
}

// 焦距停
function stopZoom() {
  if (operations.value.stopZoom.constructor === Array && operations.value.stopZoom.length > 0) {
    let command = {
      commandCode: operations.value.stopZoom[0].commandCode, // 	命令编号
      commandContext: operations.value.stopZoom[0].commandContext, // 	协议内容
      commandFormat: operations.value.stopZoom[0].commandFormat, // 	协议格式
      commandId: operations.value.stopZoom[0].commandId, // 	命令id
      commandName: operations.value.stopZoom[0].commandName, // 命令名称
      equipmentCode: operations.value.stopZoom[0].equipmentCode // 命令名称
    };
    sendCommand(command);
  } else {
    console.log("此设备未配置该功能");
  }
}

// 设置预置位
async function setPreset(item) {
  console.log("设置预置位", item.commandName);
  let command = {
    commandCode: item.commandCode, // 	命令编号
    commandContext: item.commandContext, // 	协议内容
    commandFormat: item.commandFormat, // 	协议格式
    commandId: item.commandId, // 	命令id
    commandName: item.commandName, // 命令名称
    equipmentCode: item.equipmentCode // 命令名称
  };
  await sendCommand(command);
  // ElNotification.success("调整成功");
}

// 更新预置位
function updatePreset(item) {
  console.log("更新预置位");
  let command = {
    commandCode: item.commandCode, // 	命令编号
    commandContext: item.commandContext, // 	协议内容
    commandFormat: item.commandFormat, // 	协议格式
    commandId: item.commandId, // 	命令id
    commandName: item.commandName, // 命令名称
    equipmentCode: item.equipmentCode // 命令名称
  };
  sendCommand(command);
  ElNotification.success("更新预置位成功");
}

function openUpdatePreset() {
  dialogVisible.value = true;
}

init();
</script>
<template>
  <div class="component_container" id="camera">
    <div class="camera_list">
      <p
        v-for="item in props.data"
        :key="item.terminalId"
        :class="activeCamera.terminalId === item.terminalId ? 'isCameraActive' : ''"
        @click="tabVideo(item)"
      >
        {{ item.terminalName }}
      </p>
    </div>
    <div class="component_title camera_title">
      <img src="../images/camera_center.png" class="component_logo" alt="" />
      <p>
        {{ activeCamera.terminalName }}
        <span v-if="activeCamera.runningStatus === 0" class="breakdown"> （故障）</span>
        <span v-if="activeCamera.runningStatus === 1" class="online"> （在线）</span>
        <span v-if="activeCamera.runningStatus === 2" class="offline"> （离线）</span>
        <span>{{ terminalState === "1" ? "已开机" : terminalState === "0" ? "已关机" : "" }} </span>
      </p>
      <div class="button_box">
        <button v-if="terminalState === '0'" @click="tabSwitch(1)">开机</button>
        <button v-if="terminalState === '1'" @click="tabSwitch(2)">关机</button>
      </div>
    </div>
    <div class="component_main camera_main" v-if="activeCamera.runningStatus !== 0">
      <div class="camera_main_left">
        <p style="font-size: 1vw; text-align: center">调用预置位</p>
        <div class="position_box">
          <div class="position_item" v-for="item in presettingBit" :key="item.commandCode" @click="setPreset(item)">
            {{ item.commandName }}
          </div>
        </div>
      </div>
      <div class="camera_main_right">
        <div class="camera_controller_box">
          <div class="line">
            <!--            抬头-->
            <img class="handle-btn" src="../images/camera_up.png" alt="" @mousedown="turnUp" @mouseup="stop" />
          </div>
          <div class="line">
            <!--            向左-->
            <img class="handle-btn" src="../images/camera_left.png" alt="" @mousedown="turnLeft" @mouseup="stop" />
            <img src="../images/stop.png" alt="" />
            <img class="handle-btn" src="../images/camera_right.png" alt="" @mousedown="turnRight" @mouseup="stop" />
          </div>
          <div class="line">
            <img class="handle-btn" src="../images/camera_down.png" alt="" @mousedown="turnDown" @mouseup="stop" />
          </div>
        </div>
        <div class="camera_controller_buttons">
          <div class="camera_controller_button" @mousedown="turnZoomIn" @mouseup="stopZoom">拉近</div>
          <div class="camera_controller_button" @mousedown="turnZoomOut" @mouseup="stopZoom">拉远</div>
        </div>
        <div class="camera_controller_buttons">
          <div class="camera_controller_button" style="width: 40%" @click="openUpdatePreset">设置为预置位</div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="设定为预置位" width="30vw" top="20vh">
      <div class="set-preset">
        <div class="set-preset-item" v-for="item in setPresetList" :key="item.commandName" @click="updatePreset(item)">
          <p>{{ item.commandName }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@import "../index.scss";
@import "./components.scss";

// Id选择器 加强权重
#camera {
  :deep(.el-dialog) {
    overflow: hidden;
    background-color: transparent;
    border: 4px solid #5c5c5c;
    border-radius: 1vh;
    .el-dialog__header {
      background-color: transparent;
      border-bottom: none;
      backdrop-filter: blur(15px);
      .el-dialog__title {
        color: #ffcd05;
      }
    }
    .el-dialog__body {
      background-color: transparent;
      backdrop-filter: blur(15px);
      .set-preset {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
        text-align: center;
        .set-preset-item {
          flex: 18%;
          max-width: 20%;
          height: 4vh;
          margin: 2vh 0.5vw;
          line-height: 4vh;
          color: rgb(255 255 255 / 86%);
          cursor: pointer;
          border: 2px solid #077538;
          border-radius: 4vh;
          &:hover {
            color: #ffcd05;
            border: 2px solid #18eb76;
          }
        }
      }
    }
  }
  .camera_main {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 74vh;
  }
  .camera_list {
    display: flex;
    width: 100%;
    height: 6vh;
    overflow-x: scroll;
    p {
      height: 5vh;
      padding: 0 0.5vw;
      margin: 0 2px;
      line-height: 5vh;
      cursor: pointer;
      background-color: $--meetControl-card-gray-bgc;
      border: 2px solid $--meetControl-card-gray-border;
    }
    .isCameraActive {
      background-color: $main-color-primary-transparent;
      border: 2px solid $main-color-primary;
    }
  }
  .camera_title {
    border-radius: 0;
  }
  .camera_main_right {
    width: 25vw;
    height: 70vh;
    padding: 5vh 0;
    background-color: rgb(102 100 100 / 24%);
    border-radius: 5vh;
    .camera_controller_box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 18vw;
      height: 18vw;
      padding: 1vw;
      margin: 2vh auto;
      background: linear-gradient(45deg, rgb(20 52 21 / 13%), rgb(124 122 66 / 15%));
      border: 2px double rgb(92 91 91 / 34%);
      border-radius: 50%;
      box-shadow: 2px 2px $main-color-primary inset, -2px -2px $main-color-gold inset, 2px 0 #cead1d inset, 0 2px #0d9047 inset,
        0 -2px $main-color-gold inset, -2px 0 $main-color-primary inset;
      .line {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16vw;
        height: 5vw;
        img {
          width: 4.5vw;
          height: 4.5vw;
          margin: 0 5px;
          cursor: pointer;
        }
        .handle-btn {
          width: 5vw;
          height: 5vw;
          border-radius: 50%;
          &:hover {
            filter: brightness(120%);
            transform: scale(1.05);
          }
        }
      }
    }
    .camera_controller_buttons {
      display: flex;
      justify-content: space-around;
      margin-top: 5vh;
      .camera_controller_button {
        width: 10vh;
        height: 5vh;
        font-size: 2vh;
        line-height: 5vh;
        text-align: center;
        cursor: pointer;
        background: linear-gradient(45deg, rgb(74 74 62 / 43%), rgb(105 109 106 / 40%));
        border-radius: 3vh;
        box-shadow: 2px 2px $main-color-primary inset, -2px -2px $main-color-gold inset, 2px 0 #cead1d inset, 0 2px #0d9047 inset,
          0 -2px $main-color-gold inset, -2px 0 $main-color-primary inset;
        &:hover {
          filter: brightness(120%);
          transform: scale(1.05);
        }
      }
    }
  }
  .camera_main_left {
    width: 25vw;
    height: 70vh;
    background-color: rgb(102 100 100 / 24%);
    .position_box {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      width: 25vw;
      padding: 2vh 0;
      margin: 0 auto;
      overflow: scroll;
      .position_item {
        width: 11vw;
        height: 5vh;
        padding: 0 1vw;
        margin: 2vh 0.5vw;
        font-size: 1.8vh;
        line-height: 5vh;
        text-align: center;
        cursor: pointer;
        background-color: $--meetControl-card-gray-bgc;
        border: 2px double $--meetControl-card-gray-border;
        border-radius: 0.2vw;
        &:hover {
          color: $font-color-gold;
          background-color: $main-color-primary-transparent;
        }
      }
    }
  }
}
</style>
