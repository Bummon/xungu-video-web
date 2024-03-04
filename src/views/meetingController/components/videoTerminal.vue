<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { VideoTerminalHandle } from "@/views/meetingController/components/VideoTerminalHandle";
import { ElMessage, ElNotification } from "element-plus";

let timer;
const props = defineProps({
  data: Array,
  ip: String
});
const selectData = ref({});
const callingStatus = ref(false);
const callList = ref([]);
const callingId = ref("");
const callIp = ref(""); // 从主机那查询到的ip
let callIpInputVal = ref(); //输入框输入需要拨打的电话
let handle;
// 地址薄
const addressBook = ref([
  // {
  //   name: "18号机",
  //   uri: "192.168.1.236"
  // }
]);
// 输入音量
const audioIn = ref();
const audioOut = ref();
/**
 * 输入 输出音量 静音
 */
const isOutputMuted = ref(0);
const isInputMuted = ref(false);

/**
 * 布局
 */
const layout = ref("");
import fullFarImage from "../images/videoTerminal/远端全屏.png";
import fullNearImage from "../images/videoTerminal/本端全屏.png";
import largeFarSmallNear from "../images/videoTerminal/远大近小.png";
import largeNearSmallFar from "../images/videoTerminal/远小近大.png";
import farAndNearEqual from "../images/videoTerminal/远近等大.png";
import { backgroundImageSize } from "@/settings/designSetting";
import { MeetingControllerHandle } from "@/views/meetingController/index";

const layoutOptions = [
  {
    id: 0,
    v: "full-far",
    tag: "远端全屏",
    image: fullFarImage
  },
  {
    id: 1,
    v: "full-near",
    tag: "本地全屏",
    image: fullNearImage
  },
  {
    id: 2,
    v: "large-far-small-near",
    tag: "远大近小",
    image: largeFarSmallNear
  },
  {
    id: 3,
    v: "large-near-small-far",
    tag: "近大远小",
    image: largeNearSmallFar
  },
  {
    id: 4,
    v: "far-and-near-equal",
    tag: "远近等大",
    image: farAndNearEqual
  }
];

async function setLayout(item) {
  try {
    let res = await handle?.setLayout(item.v);
    if (res.data && res.data.code === 0) {
      layout.value = await handle?.getLayout();
    }
  } catch (e) {
    ElNotification.error({ message: "设备未连接，无法设置", title: "提示" });
  }
}

/**
 * 修改状态
 */
async function changeCallingStatus() {
  // 挂断
  if (callList.value.constructor === Array && callList.value.length > 0) {
    // 点击了挂断
    callingStatus.value = await handle?.hangup(callList.value[0].id);
  } else {
    // 点击了拨打
    if (callIpInputVal.value) {
      callingStatus.value = await handle?.startCall("auto:" + callIpInputVal.value);
    } else {
      ElMessage.error({ message: `请输入呼叫地址 ` });
    }
  }
}

async function call(uri) {
  callingStatus.value = await handle?.startCall(uri);
}

/**
 * 拖拉音量条之后 触发
 */
async function audioInChange(val) {
  audioIn.value = await handle?.setAudioIn(val);
}

async function audioOutChange(val) {
  console.log(val);
  audioOut.value = await handle?.setAudioOut(val);
}

async function changeAudioInMute(val) {
  console.log("改变输入静音状态为", val);
  isInputMuted.value = await handle?.setAudioInMute(val);
}

async function changeAudioOutMute(val) {
  console.log("修改输出静音状态为", val);
  isInputMuted.value = await handle?.setAudioOutMute(val);
}

/**
 * 处理 是否在通信的数据
 */
async function handleGetCallingList() {
  //   获取呼叫中的名单
  callList.value = await handle.getCallList();
  // 如果有列表 说明在通话  拿取通话ID
  if (callList.value.constructor === Array && callList.value.length > 0) {
    callingStatus.value = true;
    callingId.value = callList.value[0].id;
    callIp.value = callList.value[0].uri.split(":")[1];
  } else {
    callingStatus.value = false;
    callingId.value = null;
    callIp.value = "";
  }
}

// 开关状态
const terminalState = ref();

// 点了开关按钮
async function tabSwitch(status: 2 | 1) {
  // 方法内 第一次调用修改  第二次调用查询
  terminalState.value = await MeetingControllerHandle.updateSwitchState(selectData.value.terminalId, props.ip, status);
  console.log("切换后的开关机状态", terminalState.value);
}

async function init() {
  selectData.value = props.data[0];
  await selectEquipmentData(props.data[0]);
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
  timer = null;
});
init();

async function tabEquipment(item) {
  selectData.value = item;
  await selectEquipmentData(item);
}

async function selectEquipmentData(item) {
  console.log("IP", item.ip);
  console.log("账号", item.account);
  console.log("密码", item.password);
  if (!item.ip) {
    ElNotification({
      title: "操作失败",
      message: "视频终端未配置IP，请先配置IP地址！",
      type: "error",
      duration: 3000
    });
    return;
  }
  handle = new VideoTerminalHandle(item.ip, item.account, item.password);
  addressBook.value = await handle.getAddressBook();
  audioIn.value = await handle.getAudioIn();
  audioOut.value = await handle.getAudioOut();
  console.log("输入音量", audioIn.value);
  console.log("输出音量", audioOut.value);
  isInputMuted.value = await handle.getAudioInMute();
  // 布局
  layout.value = await handle.getLayout();
  // 处理通信数据
  timer = setInterval(async () => {
    await handleGetCallingList();
  }, 3000);
  // 获取开关状态
  terminalState.value = await MeetingControllerHandle.getTerminalStatus(item.terminalId, props.ip);
}
</script>

<template>
  <div class="component_container" id="video-terminal">
    <div class="equipment_list">
      <p
        v-for="item in props.data"
        :key="item.terminalId"
        :class="selectData.terminalId === item.terminalId ? 'isActive' : ''"
        @click="tabEquipment(item)"
      >
        {{ item.terminalName }}
      </p>
    </div>
    <div class="component_title">
      <p>
        {{ selectData.terminalName }}
        <span v-if="selectData.runningStatus === 0" class="breakdown"> （故障）</span>
        <span v-if="selectData.runningStatus === 1" class="online"> （在线）</span>
        <span v-if="selectData.runningStatus === 2" class="offline"> （离线）</span>
        <span>{{ terminalState === "1" ? "已开机" : terminalState === "0" ? "已关机" : "" }} </span>
      </p>
      <div class="button_box">
        <button v-show="terminalState === '0'" @click="tabSwitch(1)">开机</button>
        <button v-show="terminalState === '1'" @click="tabSwitch(2)">关机</button>
      </div>
    </div>
    <div class="component_main videoTerminal_main" v-if="selectData.runningStatus !== 0">
      <div class="main_left">
        <div class="main_left_top">
          <p>呼叫</p>
          <el-input v-model.trim="callIpInputVal" :input-style="{ color: '#fff' }"></el-input>
          <div class="call">
            <p v-if="callingStatus" style="font-size: 16px">通信中：{{ callIp }}</p>
            <div class="call-sub" v-if="callingStatus === false">
              <img src="../images/call.png" @click="changeCallingStatus" />
            </div>
            <div class="call-sub" v-if="callingStatus === true">
              <img src="../images/cutdown.png" @click="changeCallingStatus" />
            </div>
          </div>
        </div>
        <div class="main_left_bottom">
          <div class="list-header">
            <p style="width: 3vw">序号</p>
            <p style="width: 5vw">名称</p>
            <p style="flex: 1">地址</p>
            <p style="width: 3vw">呼叫</p>
          </div>
          <div class="list-body">
            <div class="list-body-row" v-for="(item, index) in addressBook" :key="item.uri">
              <p style="width: 3vw">{{ index + 1 }}</p>
              <p style="width: 5vw">{{ item.name }}</p>
              <p style="flex: 1">{{ item.uri.split(":")[1] }}</p>
              <p style="width: 3vw">
                <button class="callButton" @click="call(item.uri)">呼叫</button>
              </p>
            </div>
          </div>
          <div class="list-footer">
            <div class="terminal-vol">
              <p>输入音量</p>
              <el-slider v-model="audioIn" style="flex: 1" :max="16" :min="0" @change="audioInChange" />
              <div class="switch-muted">
                静音：
                <el-switch
                  v-model="isInputMuted"
                  inline-prompt
                  :active-value="true"
                  :inactive-value="false"
                  class="ml-2 switch_class"
                  @change="changeAudioInMute"
                />
              </div>
            </div>
            <div class="terminal-vol">
              <p>输出音量</p>
              <el-slider v-model="audioOut" style="flex: 1" :max="16" :min="0" @change="audioOutChange" />
              <div class="switch-muted">
                静音：
                <el-switch
                  v-model="isOutputMuted"
                  class="ml-2 switch_class"
                  :active-value="true"
                  :inactive-value="false"
                  inline-prompt
                  @change="changeAudioOutMute"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main_right">
        <p class="main_right_title">布局</p>
        <div class="terminal_layouts">
          <div
            class="terminal_layout"
            v-for="item in layoutOptions"
            :key="item.id"
            @click="setLayout(item)"
            :class="layout === item.v ? 'activeLayout' : ''"
            :style="{ backgroundImage: `url(${item.image})` }"
          >
            <p>{{ item.tag }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../index.scss";
@import "./components.scss";
#video-terminal {
  .videoTerminal_main {
    display: flex;
    height: 74vh;
    .main_left {
      flex: 4;
      height: 100%;
      padding: 2vh 1vw;
      text-align: center;
      .main_left_top {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        height: 20vh;
        padding: 1vh 2vw;
        background-color: $--meetControl-card-gray-bgc;
        border: 1px solid $--meetControl-card-gray-border;
        border-radius: 5px;
        p {
          font-size: 3vh;
          font-weight: bold;
        }
        .call {
          margin: 0 auto;
          color: #ffffff;
          cursor: pointer;
          .call-sub {
            width: 3.5vw;
            height: 3.5vw;
            margin: 0 auto;
            overflow: hidden;
            img {
              display: block;
              width: 3.5vw;
            }
            &:hover {
              filter: brightness(200%);
            }
          }
        }
      }
      .main_left_bottom {
        display: flex;
        flex-direction: column;
        height: calc(100% - 22vh);
        margin: 2vh 0;
        background-color: $--meetControl-card-gray-bgc;
        border: 1px solid $--meetControl-card-gray-border;
        border-radius: 5px;
        .list-header,
        .list-body-row {
          display: flex;
        }
        .list-header {
          height: 5vh;
          padding-right: 10px;
          line-height: 5vh;
          background-color: rgb(255 255 255 / 20%);
        }
        .list-body {
          flex: 1;
          overflow-y: scroll;
          border-bottom: 2px solid rgb(162 161 161 / 15%);
          .list-body-row {
            height: 5vh;
            line-height: 5vh;
            &:hover {
              background-color: rgb(162 161 161 / 5%);
            }
            .callButton {
              width: 5vh;
              height: 3vh;
              font-weight: bold;
              color: var(--el-color-primary);
              cursor: pointer;
              background-color: rgb(255 255 255 / 20%);
              border: none;
              border-radius: 0.5vh;
              &:hover {
                color: var(--el-color-primary);
                background-color: transparent;
                border: 1px solid var(--el-color-primary);
              }
            }
          }
        }
        .list-footer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 14vh;
          .terminal-vol {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 5vh;
            font-size: 16px;
            p {
              width: 5vw;
              text-align: center;
            }
            .switch-muted {
              display: flex;
              align-items: center;
              width: 6vw;
              padding-left: 0.5vw;

              // justify-content: space-around;
            }
          }
        }
      }
    }
    .main_right {
      flex: 6;
      height: calc(100% - 4vh);
      margin: 2vh 1vw;
      background-color: $--meetControl-card-gray-bgc;
      .main_right_title {
        width: 100%;
        height: 4vh;
        line-height: 4vh;
        text-align: center;
        background-color: $--meetControl-card-gray-bgc;
      }
      .terminal_layouts {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        padding-top: 0;
        overflow-y: scroll;
        .terminal_layout {
          position: relative;
          width: 10vw;
          height: 10vw;
          margin: 2vh 0.7vw;
          cursor: pointer;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 80%;
          p {
            position: absolute;
            top: 0;
            height: 2vh;
            font-size: 16px;
            color: $main-color-primary-light;
            text-align: center;
            text-indent: 1em;
          }
        }
        .activeLayout {
          color: $--meetControl-gold-light;
          background-color: rgb(255 255 255 / 20%);
          backdrop-filter: blur(5px);
        }
      }
    }
  }
  .switch_class {
    --el-switch-on-color: #ff4949;
    --el-switch-off-color: #949393;
  }
}
</style>
