<script setup lang="ts">
import { ref, defineProps } from "vue";
import { ElNotification } from "element-plus";
import { MeetSourceType } from "@/api/interface/source";
import { EquipmentControlHttp } from "@/api/modules/equipmentControl";
import { VideoCameraHandle } from "@/views/meetingController/components/VideoCameraHandle";
import { MeetingControllerHandle } from "@/views/meetingController/index";

const props = defineProps({
  data: Array,
  ip: String
});

async function tabEquipment(item) {
  //  当前显示的设备
  activeEquipment.value = item;
  //  设备的命令项
  operations.value = item.commandVos || [];
}

const activeEquipment = ref<MeetSourceType.terminal>({
  terminalId: 0,
  terminalName: "01号机位"
});
const dialogVisible = ref<boolean>(false);

const operations = ref([]); // 操作按键列表

//
// // 开关状态
// const terminalState = ref();

async function init() {
  console.log("props.data[0]", props.data[0]);
  await tabEquipment(props.data[0] || []);
  // // 获取开关状态
  // terminalState.value = await MeetingControllerHandle.getTerminalStatus(activeCamera.value.terminalId, props.ip);
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

async function sendCommand(item) {
  console.log("设置预置位", item.commandName);
  let command = {
    commandCode: item.commandCode, // 	命令编号
    commandContext: item.commandContext, // 	协议内容
    commandFormat: item.commandFormat, // 	协议格式
    commandId: item.commandId, // 	命令id
    commandName: item.commandName, // 命令名称
    equipmentCode: item.equipmentCode // 命令名称
  };
  await EquipmentControlHttp.sendCommand({
    commandCode: command.commandCode, // 	命令编号
    commandContext: command.commandContext, // 	协议内容
    commandFormat: command.commandFormat, // 	协议格式
    commandId: command.commandId, // 	命令id
    commandName: command.commandName, // 命令名称
    equipmentCode: command.equipmentCode, // 命令名称
    ip: props.ip // ip;
  });
  ElNotification.success("发送成功");
}

init();
</script>
<template>
  <div class="component_container">
    <div class="equipment_list">
      <p
        v-for="item in props.data"
        :key="item.terminalId"
        @click="tabEquipment(item)"
        :class="activeEquipment.terminalId === item.terminalId ? 'isAudioActive' : ''"
      >
        {{ item.terminalName }}
      </p>
    </div>
    <div class="button-box" v-if="operations?.length > 0 && activeEquipment?.runningStatus !== 0">
      <div class="other-btn" v-for="item in operations" :key="item.commandId" @click="sendCommand(item)">
        {{ item.commandName }}
      </div>
    </div>
    <div class="button-box" v-else>
      <p>该型号的设备尚未配置控制命令</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../index.scss";
@import "./components.scss";
.equipment_list {
  display: flex;
  width: 100%;
  height: 6vh;
  overflow-x: scroll;
  p {
    height: 5vh;
    padding: 0 1vw;
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
.button-box {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  justify-content: flex-start;
  height: 80vh;
  padding: 2vh 2vw;
  margin: 0 auto;
  background-color: $--meetControl-model-bgc;
  .other-btn {
    padding: 2vh 2vw;
    margin: 2vh 1vw;
    font-size: 1vw;
    cursor: pointer;
    background-color: transparent;
    border: 2px solid var(--el-color-primary);
    border-radius: 5px;
    &:hover {
      background-color: var(--el-color-primary);
    }
  }
  p {
    width: 100%;
    padding: 2vh 0;
    font-size: 1vw;
    color: #969494;
    text-align: center;
  }
}
</style>
