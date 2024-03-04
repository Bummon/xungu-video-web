<script setup lang="ts">
import MatrixDrawer from "@/views/meetingController/components/drawer/matrixDrawer.vue";
import { defineProps, ref } from "vue";
import { ElNotification } from "element-plus";
import { EquipmentControlHttp } from "@/api/modules/equipmentControl";
import { MeetingControllerHandle } from "@/views/meetingController/index";

const props = defineProps({
  data: Array,
  ip: String
});
const matrixDrawerRef = ref();
const activeMatrix = ref(); // 默认是第一个矩阵  不让它装多矩阵
const inputNum = ref(0); // 选中的输入通道号
const outputNumList = ref([]); // 对应的输出通道列表
const outputList = ref([]); //  输出通道列表
const inputList = ref([]); // 输入通道列表
const terminalState = ref();
const oneToOneData = ref(null); // 一对一的命令组
const dialogVisible = ref<boolean>(false); // 一对多选择框

// 点了开关按钮
async function tabSwitch(status: 2 | 1) {
  // 方法内 第一次调用修改  第二次调用查询
  terminalState.value = await MeetingControllerHandle.updateSwitchState(activeMatrix.value.terminalId, props.ip, status);
  console.log("切换后的开关机状态", terminalState.value);
}

function openDrawer() {
  matrixDrawerRef.value.open(inputList.value, outputList.value, "视频矩阵");
}

/**
 * 查询输出通道的状态
 * @param number  输入通道id
 */
function getMatrixStatus(number) {
  EquipmentControlHttp.getMatrixStatus({
    ip: props.ip,
    modelId: activeMatrix.value.modelId,
    number: number
  }).then(res => {
    if (res.data.constructor === Array) {
      outputNumList.value = res.data;
    } else {
      outputNumList.value = [];
    }
    console.log("输出通道数", outputNumList.value);
  });
}

/**
 * 选取 输入通道
 * @param item
 */
function selectInputItem(item) {
  inputNum.value = item.number;
  getMatrixStatus(item.number);
}

/**
 * 选择了输出
 * @param item
 */
function changeOutputItem(item) {
  // 锁定不可取消通道
  if (outputNumList.value.includes(item.number)) return;
  // 如果是未锁定的通道 新增进里面
  let list = outputNumList.value;
  if (list.includes(item.number)) {
    list.splice(list.indexOf(item.number), 1);
  } else {
    list.push(item.number);
  }
  EquipmentControlHttp.updateMatrix({
    enterNumber: inputNum.value, // 输入通道
    goOutNumbers: outputNumList.value, // 输出通道
    ip: props.ip,
    modelId: activeMatrix.value.modelId
  }).then(res => {
    if (res.data?.code === 200) {
      outputNumList.value = list;
    }
  });
}

async function selectEquipmentData(equipment) {
  inputList.value = (
    await EquipmentControlHttp.getMatrixInputChannel({
      terminalId: equipment.terminalId,
      type: 1
    })
  ).data;
  outputList.value = (
    await EquipmentControlHttp.getMatrixInputChannel({
      terminalId: equipment.terminalId,
      type: 2
    })
  ).data;
  console.log("输入通道", inputList.value);
  console.log("输出通道", outputList.value);
  if (inputNum.value.constructor === Array && inputNum.value.length > 0) {
    selectInputItem(inputList.value[0]); // 默认选中第一项
  }
  if (activeMatrix.value?.commandVos?.length > 0) {
    console.log("检查是否存在一对一命令组");
    // let list = activeMatrix.value.commandVos.map(item => {
    //   if (item.commandName.includes("一对一")) return item;
    // });
    let list = activeMatrix.value.commandVos.filter(item => item.commandName.includes("一对一"));

    if (list.constructor === Array && list.length > 0) {
      oneToOneData.value = list[0];
    } else {
      oneToOneData.value = null;
    }
    console.log("1对1命令组", oneToOneData.value);
  }
  // 获取开关状态
  MeetingControllerHandle.getTerminalStatus(equipment.terminalId, props.ip).then(res => {
    terminalState.value = res;
    console.log("获取到矩阵的开关状态", terminalState.value);
  });
}

async function init() {
  if (props.data.constructor === Array && props.data.length > 0) {
    activeMatrix.value = props.data[0];
    console.log("矩阵数据", activeMatrix.value);
    selectEquipmentData(activeMatrix.value);
  }
}

init();

function handleOneToMany() {
  console.log("打开一对多");
  dialogVisible.value = true;
}

function selectOneToMany(item) {
  let list = outputList.value.map(i => i.number);
  console.log("一对多", outputList.value, list);
  EquipmentControlHttp.updateMatrix({
    enterNumber: item.number, // 输入通道
    goOutNumbers: list, // 输出通道
    ip: props.ip,
    modelId: activeMatrix.value.modelId
  })
    .then(res => {
      if (res.data?.code === 200) {
        outputNumList.value = list;
        inputNum.value = item.number;
      }
    })
    .finally(() => {
      dialogVisible.value = false;
    });
}

async function handleOneToOne() {
  console.log("执行一对一");
  if (oneToOneData.value) {
    let res = await MeetingControllerHandle.sendCommand(props.ip, oneToOneData.value);
    console.log(res);
  } else {
    ElNotification.error("该设备未绑定一对一命令");
  }
}

function tabEquipment(item) {
  activeMatrix.value = item;
  selectEquipmentData(item);
}
</script>

<template>
  <div class="component_container" id="matrix">
    <div class="equipment_list">
      <p
        v-for="item in props.data"
        :key="item.terminalId"
        :class="activeMatrix.terminalId === item.terminalId ? 'isActive' : ''"
        @click="tabEquipment(item)"
      >
        {{ item.terminalName }}
      </p>
    </div>
    <div class="component_title">
      <p>
        {{ activeMatrix.terminalName }}
        <span v-if="activeMatrix.runningStatus === 0" class="breakdown"> （故障）</span>
        <span v-if="activeMatrix.runningStatus === 1" class="online"> （在线）</span>
        <span v-if="activeMatrix.runningStatus === 2" class="offline"> （离线）</span>
        <span>{{ terminalState === "1" ? "已开机" : terminalState === "0" ? "已关机" : "" }} </span>
      </p>
      <div class="button_box">
        <button v-show="terminalState === '0'" @click="tabSwitch(1)">开机</button>
        <button v-show="terminalState === '1'" @click="tabSwitch(2)">关机</button>
      </div>
    </div>
    <div class="component_main matrix_main" v-if="activeMatrix.runningStatus !== 0">
      <div class="matrix_main_header">
        <button class="title_button" @click="handleOneToOne">全部一对一</button>
        <button class="title_button" @click="handleOneToMany">一对多</button>
        <button class="title_button" @click="openDrawer">通道名称管理</button>
      </div>
      <div class="matrix_main_body">
        <div class="matrix_body_left">
          <div class="matrix_body_input">
            <p>输入通道</p>
            <div class="item_box">
              <div
                class="matrix_channel_input_item channel-item"
                v-for="item in inputList"
                :key="item.number"
                :class="inputNum === item.number ? 'inputActive' : ''"
                @click="selectInputItem(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="matrix_body_output">
            <p>输出通道</p>
            <div class="item_box">
              <div
                class="matrix_channel_output_item channel-item"
                v-for="item in outputList"
                :key="item.number"
                :class="outputNumList.includes(item.number) ? 'outputActive' : ''"
                @click="changeOutputItem(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <!--        <div class="matrix_body_handle">-->
        <!--          <p>保存当前配置</p>-->
        <!--        </div>-->
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="选择一对多输入通道" width="30vw" top="20vh">
      <div class="set-preset">
        <div class="set-preset-item" v-for="item in inputList" :key="item.number" @click="selectOneToMany(item)">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
  <MatrixDrawer ref="matrixDrawerRef"></MatrixDrawer>
</template>

<style scoped lang="scss">
@import "../index.scss";
@import "./components.scss";
#matrix {
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
  .matrix_main_header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 8vh;
  }
  .matrix_main {
    height: 74vh;
    background-color: rgb(0 0 0 / 10%);
  }
  .matrix_main_body {
    width: 100%;
    height: 75vh;
    .matrix_body_handle {
      width: 100%;
      height: 5vh;
      p {
        width: 15vw;
        height: 4vh;
        margin: 0 auto;
        font-size: 0.9vw;
        line-height: 4vh;
        text-align: center;
        cursor: pointer;
        background-color: rgb(255 255 255 / 19%);
        box-shadow: 1px 1px 1px 1px #000000;
        &:hover {
          background-color: rgb(255 255 255 / 29%);
        }
      }
    }
  }
  .matrix_body_left {
    display: flex;
    justify-content: space-around;
    width: 65vw;
    height: 65vh;
    overflow: hidden;
    .matrix_body_input,
    .matrix_body_output {
      flex: 1;
      height: 65vh;
      p {
        height: 3vh;
        margin: 1vh 0;
        font-size: 2vh;
        line-height: 3vh;
        color: $font-color-primary;
        text-align: center;
      }
    }
    .item_box {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;
      width: 30vw;
      height: 60vh;
      text-align: center;
      .matrix_channel_input_item {
        position: relative;
        flex: 20%;
        width: 5vw;
        max-width: 6vw;
        margin: 1px 0.5vw;
        color: $font-color-gray;
      }
      .matrix_channel_output_item {
        position: relative;
        flex: 20%;
        width: 5vw;
        max-width: 6vw;
        margin: 1px 0.5vw;
        color: $font-color-gray;
      }

      // 选中的input框
      .inputActive {
        font-weight: bold;
        color: $font-color-primary;
        background-color: transparent;
        border: 2px solid $border-primary;
      }
      .outputActive {
        font-weight: bold;
        color: $font-color-primary;
        background-color: $main-color-primary-transparent;
        border: 2px solid $border-primary;
      }
    }
  }

  // 通道列表的统一样式
  .channel-item {
    padding: 1.5vh 0;
    margin: 1vh auto;
    font-size: 1.8vh;
    letter-spacing: 1px;
    cursor: pointer;
    background-color: $--meetControl-card-gray-bgc;
    border: 2px solid $--meetControl-card-gray-border;
    box-shadow: 1px 1px 1px rgb(0 0 0 / 93%);
    &:hover {
      background-color: #7b7777;
    }
  }
}
</style>
