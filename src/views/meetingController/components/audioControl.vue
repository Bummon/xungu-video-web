<script setup lang="ts">
import { ref, onMounted } from "vue";
import { EquipmentControlHttp, reqAudioControl } from "@/api/modules/equipmentControl";
import { ElNotification } from "element-plus";
import MatrixDrawer from "@/views/meetingController/components/drawer/matrixDrawer.vue";
import { MeetingControllerHandle } from "@/views/meetingController/index";

const matrixDrawerRef = ref();

function openDrawer() {
  console.log("打开窗口");
  matrixDrawerRef.value.open(inputList.value, outputList.value, "音频处理器");
}

const selectOption = ref({
  mode: ""
});
const props = defineProps({
  data: Array,
  ip: String
});
const activeAudio = ref();
const inputList = ref([]);
const outputList = ref([]);

function tabAudio(item, index) {
  activeAudio.value = item;
  init(item);
}

const terminalState = ref();

// 点了开关按钮
async function tabSwitch(status: 2 | 1) {
  // 方法内 第一次调用修改  第二次调用查询
  terminalState.value = await MeetingControllerHandle.updateSwitchState(activeAudio.value.terminalId, props.ip, status);
  console.log("切换后的开关机状态", terminalState.value);
}

/**
 * 查询输出通道的状态
 * @param data 父组件传递过来设备详情
 */
async function getAudioInputChannel(terminal) {
  // 获取初始值
  EquipmentControlHttp.getMatrixInputChannel({ terminalId: terminal.terminalId, type: 1 })
    .then(res => {
      console.log(res.data);
      inputList.value = res.data;
      return res.data;
    })
    .then(data => {
      getAudioVolume(data, 1);
    });
  console.log("清新输出结束", inputList.value);
}

/**
 * 查询输出通道的状态
 * @param number  输入通道id
 */
async function getAudioOutputChannel(terminal) {
  // 获取初始值
  EquipmentControlHttp.getMatrixInputChannel({ terminalId: terminal.terminalId, type: 2 })
    .then(res => {
      outputList.value = res.data;
      return res.data;
    })
    .then(data => {
      getAudioVolume(data, 2);
    });
  console.log("清新输出结束", outputList.value);
}

// 获取值
async function getAudioVolume(list, type) {
  // 定义查询的参数
  let reqOutput = [];
  list.forEach(item => {
    reqOutput.push({
      commandType: 3, // 命令类型 3静音状态读取 4输入输出音量增益读取
      number: item.number,
      type: type // 出入口 1入口 2出口
    });
    reqOutput.push({
      commandType: 4, // 命令类型 3静音状态读取 4输入输出音量增益读取
      number: item.number,
      type: type // 出入口 1入口 2出口
    });
  });

  let params: reqAudioControl = {
    ip: props.ip,
    modelId: activeAudio.value.modelId,
    volumeList: reqOutput
  };
  // 查询值
  let { data } = await EquipmentControlHttp.getAudioVolume(params);
  // 添加值
  if (type === 2) {
    for (let output of outputList.value) {
      data.forEach(item => {
        if (output.number.toString() === item.number) {
          // 静音
          if (item.commandType === "3") {
            output.muteStatus = item.value === "01" ? 1 : 0;
          }
          // 音量
          if (item.commandType === "4") {
            output.vol = Math.floor(item.value);
          }
        }
      });
    }
  } else if (type === 1) {
    // 添加值
    for (let input of inputList.value) {
      data.forEach(item => {
        if (input.number.toString() === item.number) {
          // 静音
          if (item.commandType === "3") {
            input.muteStatus = item.value === "01" ? 1 : 0;
          }
          // 音量
          if (item.commandType === "4") {
            input.vol = Math.floor(item.value);
          }
        }
      });
    }
  }
}

/**
 * 全部静音 或全部解除接应
 * @param {1|2} type        出入口类型 1入口 2出口
 * @param {0|1} upOrDown   静音控制：0表示取消静音，1表示静音。
 */
async function setMute(type, upOrDown) {
  try {
    let res = await EquipmentControlHttp.setAllMute({
      ip: props.ip,
      modelId: activeAudio.value.modelId,
      type: type,
      upOrDown: upOrDown
    });
    if (res.data === "00") {
      ElNotification.success("操作成功！");
    }
    if (type === 1) {
      await getAudioInputChannel(activeAudio.value);
    }
    if (type === 2) {
      await getAudioOutputChannel(activeAudio.value);
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * 单独设置某个通道静音
 */
async function volumeQuiet(item) {
  console.log("切换静音状态", item.muteStatus); // 0是取消静音  1是静音
  try {
    let res = await EquipmentControlHttp.volumeQuiet({
      ip: props.ip,
      modelId: activeAudio.value.modelId,
      type: item.type, // 出入口类型 1入口 2出口
      number: item.number,
      upOrDown: item.muteStatus // 静音控制：0表示取消静音，1表示静音。
    });
    if (res.data !== "00") {
      item.muteStatus = item.muteStatus == 0 ? 1 : 0;
    }
  } catch (e) {
    item.muteStatus = item.muteStatus == 0 ? 1 : 0;
  }
}

/**
 * 单独修改音量
 * @param item
 */
async function changeVolume(item, type) {
  if (type === "input") {
    console.log("单独修改输入音量", item);
  } else if (type === "output") {
    console.log("单独修改输出音量", item);
  } else {
    console.log("不知道是输入还是输出");
  }
  let res = await EquipmentControlHttp.updateVolume({
    ip: props.ip,
    modelId: activeAudio.value.modelId,
    type: item.type, // 出入口类型 1入口 2出口
    volumeValue: item.vol, // 修改音量
    number: item.number // 静音控制：0表示取消静音，1表示静音。
  });
  console.log(res);
  if (res.code === 200) {
    ElNotification.success("音量修改成功！");
  }
}

async function init(item = null) {
  try {
    if (!item) {
      activeAudio.value = props.data[0];
    } else {
      activeAudio.value = item;
    }
    await getAudioInputChannel(activeAudio.value);
    await getAudioOutputChannel(activeAudio.value);
    selectOption.value.mode = "input";
  } catch (e) {
    console.log(e);
  }
  try {
    // 获取开关状态
    terminalState.value = await MeetingControllerHandle.getTerminalStatus(props.data[0].terminalId, props.ip);
  } catch (e) {
    terminalState.value = 0;
  }
}

init(props.data[0]);
</script>

<template>
  <div class="component_container" id="audio">
    <div class="audio_list">
      <p
        v-for="(item, index) in props.data"
        :key="item.terminalId"
        @click="tabAudio(item, index)"
        :class="activeAudio.terminalId === item.terminalId ? 'isAudioActive' : ''"
      >
        {{ item.terminalName }}
      </p>
    </div>
    <!--    :class="activeCamera.terminalId === item.terminalId ? 'isCameraActive' : ''"-->
    <div class="component_title">
      <p>
        {{ activeAudio.terminalName }}
        <span v-if="activeAudio.runningStatus === 0" class="breakdown"> （故障）</span>
        <span v-if="activeAudio.runningStatus === 1" class="online"> （在线）</span>
        <span v-if="activeAudio.runningStatus === 2" class="offline"> （离线）</span>
        <span>{{ terminalState === "1" ? "已开机" : terminalState === "0" ? "已关机" : "" }} </span>
      </p>
      <div class="button_box">
        <button v-show="terminalState === '0'" @click="tabSwitch(1)">开机</button>
        <button v-show="terminalState === '1'" @click="tabSwitch(2)">关机</button>
      </div>
    </div>
    <div class="component_main" v-if="activeAudio.runningStatus !== 0">
      <div class="tab_button_box">
        <div class="tab_button" :class="selectOption.mode === 'input' ? 'isActiveMode' : ''" @click="selectOption.mode = 'input'">
          <p>输入</p>
        </div>
        <div
          class="tab_button"
          :class="selectOption.mode === 'output' ? 'isActiveMode' : ''"
          @click="selectOption.mode = 'output'"
        >
          <p>输出</p>
        </div>
      </div>
      <div class="audio_main_controller_box" v-if="selectOption.mode === 'output'">
        <p @click="openDrawer">通道名称管理</p>
        <p @click="setMute(2, 0)">解除静音</p>
        <p @click="setMute(2, 1)">静音</p>
        <!--        出入口类型 1入口 2出口-->
        <!--        0表示取消静音，1表示静音。-->
      </div>
      <div class="audio_main_items" v-if="selectOption.mode === 'output'">
        <div class="audio_main_item" v-for="item in outputList" :key="item.id">
          <p class="audio_main_item_title">
            {{ item.name }}
            <span class="switch_class">
              <el-switch
                v-model.lazy="item.muteStatus"
                :active-value="1"
                :inactive-value="0"
                active-text="静音"
                inactive-text="正常"
                class=""
                inline-prompt
                @click="volumeQuiet(item)"
              >
              </el-switch>
            </span>
          </p>
          <p class="audio_main_item_button">
            <span>音量</span>
            <el-slider v-model="item.vol" style="flex: 1" @change="changeVolume(item, 'output')" :min="-60" :max="15" />
            <!--            <span>{{ item.vol }}</span>-->
          </p>
        </div>
      </div>
      <div class="audio_main_controller_box" v-if="selectOption.mode === 'input'">
        <p @click="openDrawer">通道名称管理</p>
        <p @click="setMute(1, 0)">解除静音</p>
        <p @click="setMute(1, 1)">静音</p>
        <!--        出入口类型 1入口 2出口-->
        <!--        0表示取消静音，1表示静音。-->
      </div>
      <div class="audio_main_items" v-if="selectOption.mode === 'input'">
        <div class="audio_main_item" v-for="item in inputList" :key="item.id">
          <p class="audio_main_item_title">
            {{ item.name }}
            <span class="switch_class">
              <el-switch
                v-model="item.muteStatus"
                :active-value="1"
                :inactive-value="0"
                active-text="静音"
                inactive-text="正常"
                class=""
                inline-prompt
                @click="volumeQuiet(item)"
              >
              </el-switch>
            </span>
          </p>
          <p class="audio_main_item_button">
            <span>音量</span>
            <el-slider v-model="item.vol" style="flex: 1" @change="changeVolume(item, 'input')" :min="-60" :max="15" />
            <!--            <span>{{ item.vol }}</span>-->
          </p>
        </div>
      </div>
    </div>
    <MatrixDrawer ref="matrixDrawerRef"></MatrixDrawer>
  </div>
</template>

<style scoped lang="scss">
@import "../index.scss";
@import "./components.scss";
#audio {
  .audio_list {
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
    .isAudioActive {
      background-color: $main-color-primary-transparent;
      border: 2px solid $border-primary;
    }
  }

  // 主框体
  .component_main {
    width: 100%;
    height: 74vh;
    background-color: $--meetControl-model-bgc;

    // 全选控制盒子
    .audio_main_controller_box {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 6vh;
      p {
        padding: 6px 20px;
        margin: 0 1vw;
        color: $font-color-gray;
        cursor: pointer;
        background-color: $--meetControl-card-gray-bgc;
        border: 2px solid #696868;
        border-radius: 4px;
        &:hover {
          filter: brightness(120%);
        }
      }
    }
    .audio_main_items {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;
      height: 64vh;
      overflow-y: scroll;
      .audio_main_item {
        width: 23%;
        height: 10vh;
        padding: 1vh 1vw;
        margin: 0 0.5vw;
        background-color: $--meetControl-card-gray-bgc;
        border: 1px solid $--meetControl-card-gray-border;
        border-radius: 10px;
        .audio_main_item_title {
          height: 4vh;
          font-size: 16px;
          line-height: 4vh;
          color: $main-color-primary;
          text-align: left;
        }
        .audio_main_item_button {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          span {
            padding: 0 1vw 0 0;
            color: $font-color-gray;
          }
          :deep(.el-slider) {
            margin-right: 1vw;
            .el-slider__button {
              background-color: $main-color-primary-transparent;
              border-color: $main-color-primary-light;
            }
            .el-slider__runway {
              background-color: #6d6c6c;
            }
          }
        }
      }
    }
  }

  // 输入输出切换框
  .tab_button_box {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    .tab_button {
      width: 50%;
      height: 4vh;
      line-height: 4vh;
      color: rgb(242 242 242 / 45%);
      cursor: pointer;
      background-color: rgb(255 255 255 / 10%);
      p {
        font-size: 1.5vh;
        text-align: center;
      }
    }
    .isActiveMode {
      color: $font-color-primary;
      background-color: $--meetControl-model-bgc;
      filter: brightness(120%);
      border-bottom: none;
    }
  }

  // 切换
  .switch_class {
    display: flex;
    justify-content: center;
    float: right;
    .el-switch {
      float: right;

      --el-switch-off-color: rgb(255 255 255 / 10%);
    }
  }
}
</style>
