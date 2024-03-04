<script setup lang="ts">
import { ref } from "vue";
import { EquipmentControlHttp } from "@/api/modules/equipmentControl";

const title = "时序电源";
const props = defineProps({
  data: Array,
  ip: String
});
const checked = ref(false);
const commandVos = ref({
  open: {
    commandCode: 523,
    commandContext: "AAA BBB CCC DDD EEE FFF ",
    commandDescr: null,
    commandFormat: "十六进制",
    commandId: 6266426527301,
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
  close: {}
});

/**
 * 发送命令
 */
function sendCommand(command) {
  let params = command;
  params.ip = props.ip;
  EquipmentControlHttp.sendCommand(params)
    .then(res => {
      console.log(res);
      checked.value = true;
    })
    .catch(e => {
      console.log(e);
      checked.value = false;
    });
}

/**
 * 顺序开启
 */
function sequenceOpen() {
  let command = {
    commandCode: commandVos.value.open.commandCode, // 	命令编号
    commandContext: commandVos.value.open.commandContext, // 	协议内容
    commandFormat: commandVos.value.open.commandFormat, // 	协议格式
    commandId: commandVos.value.open.commandId, // 	命令id
    commandName: commandVos.value.open.commandName, // 命令名称
    equipmentCode: commandVos.value.open.equipmentCode // 命令名称
  };
  sendCommand(command);
}

function sequenceClose() {
  let command = {
    commandCode: commandVos.value.close.commandCode, // 	命令编号
    commandContext: commandVos.value.close.commandContext, // 	协议内容
    commandFormat: commandVos.value.close.commandFormat, // 	协议格式
    commandId: commandVos.value.close.commandId, // 	命令id
    commandName: commandVos.value.close.commandName, // 命令名称
    equipmentCode: commandVos.value.close.equipmentCode // 命令名称
  };
  sendCommand(command);
}

let runningStatus = ref("1");

async function init() {
  if (props.data.length > 0) {
    console.log("时序电源携带的命令集", props.data[0].commandVos);
    let list = props.data[0].commandVos;
    runningStatus.value = props.data[0].runningStatus;
    commandVos.value.open = list.filter(item => item.commandName === "顺序开启")[0];
    commandVos.value.close = list.filter(item => item.commandName === "顺序关闭")[0];
    console.log("电源顺序开命令", commandVos.value.open);
    console.log("电源顺序关命令", commandVos.value.close);
  }
}

init();
</script>

<template>
  <div class="component_container" id="power">
    <div class="component_title">
      <p>
        {{ title }}
        <span v-if="runningStatus === 0" class="breakdown"> （故障）</span>
        <span v-if="runningStatus === 1" class="online"> （在线）</span>
        <span v-if="runningStatus === 2" class="offline"> （离线）</span>
      </p>
    </div>
    <div class="component_main power_main" v-if="runningStatus !== 0">
      <div class="power_box">
        <div class="main_shadow"></div>
        <div class="holes_left">
          <div class="hole"></div>
          <div class="hole"></div>
        </div>
        <div class="holes_right">
          <div class="hole"></div>
          <div class="hole"></div>
        </div>
        <div class="power_left_button" v-if="commandVos.open?.commandId">
          <label class="switch">
            <input type="checkbox" @click="sequenceOpen" />
            <div class="button">
              <div class="light"></div>
              <div class="dots"></div>
              <div class="characters"></div>
              <div class="shine"></div>
              <div class="shadow"></div>
            </div>
          </label>
          <p class="left-button-text">顺序开启</p>
        </div>
        <div class="power_center">
          <div class="cor"></div>
          <div class="cor"></div>
          <div class="cor"></div>
          <div class="cor"></div>
          <div class="cor"></div>
          <div class="cor"></div>
          <div class="cor"></div>
          <div class="cor"></div>
          <div class="cor"></div>
        </div>
        <div class="power_left_button" v-if="commandVos.close?.commandId">
          <label class="switch">
            <input type="checkbox" @click="sequenceClose" />
            <div class="button">
              <div class="light"></div>
              <!--               网纹-->
              <div class="dots"></div>
              <!--              |  和  o  标志-->
              <div class="characters"></div>
              <div class="shine"></div>
              <div class="shadow"></div>
            </div>
          </label>
          <p class="left-button-text">顺序关闭</p>
        </div>
      </div>
      <div class="seat"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../index.scss";
@import "./components.scss";
#power {
  .power_main {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
    background-color: rgb(56 55 55 / 54%);
  }
}
.power_box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95%;
  height: 18vh;
  padding: 0 5vw;
  background-color: #2d2c2c;
  background-image: linear-gradient(-45deg, #0e0c0c, #0f0f0f);
  .main_shadow {
    position: absolute;
    top: -139px;
    width: 80%;
    border-top: 70px solid transparent;
    border-right: 200px solid transparent;
    border-bottom: 70px solid #000000;
    border-left: 200px solid transparent;
  }
  .holes_right,
  .holes_left {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 15vh;
    .hole {
      width: 1.54vh;
      height: 4vh;
      background-color: rgb(216 214 214 / 70%);
      border: 1px solid rgb(118 118 118 / 50%);
      border-radius: 1vh;
      box-shadow: -1px -1px 0 0 #010101 inset;
    }
  }
  .holes_left {
    left: 1vw;
  }
  .holes_right {
    right: 1vw;
  }
  .power_left,
  .power_right {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 4vw;
    height: 10vh;
    background-color: #91061f;
    border-radius: 1vh;
    span {
      width: 0.5vw;
      height: 3vh;
      margin-top: 1vh;
      background-color: #ffffff;
      border-radius: 1vw;
    }
    p {
      position: absolute;
      bottom: -1vw;
      width: 4vw;
      text-align: center;
    }
  }
  .power_center {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-around;
    .cor {
      width: 1vw;
      height: 1vw;
      background: linear-gradient(45deg, #8a0303, #df0c0c, #8a0303);
      border: 3px solid #918f8f;
      border-radius: 50%;
      box-shadow: 0 0 1px 1px #9b0c0c;
    }
  }
  .main_button {
    width: 8vw;
    height: 5vw;
    background-color: #ffffff;
  }
}
.power_left_button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  .left-button-text {
    position: absolute;
    bottom: -3vh;
    left: calc(50% - 1.6vw);
    width: 5vw;
    font-size: 0.8vw;
    font-weight: bold;
    letter-spacing: 2px;
  }
}
.switch {
  width: 100px;
  height: 100px;
  padding: 20px;
  background-color: black;
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgb(0 0 0 / 20%), 0 0 1px 2px black, inset 0 2px 2px -2px white, inset 0 0 2px 15px #47434c,
    inset 0 0 2px 18px black;
  perspective: 700px;
}
.switch input {
  display: none;
}

// 鼠标按下时的 阴影状态
.switch input:active + .button {
  box-shadow: 0 0 10px 20px #9c0808;

  // transform: translateZ(20px) rotateX(25deg);
}
.switch input:hover + .button .light {
  animation: flicker 0.2s infinite 0.3s;
}
.switch input:active + .button .shine {
  opacity: 1;
}
.switch input:hover + .button .shadow {
  opacity: 0;
}
.switch .button {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: linear-gradient(#980000 0%, #6f0000 30%, #6f0000 70%, #980000 100%);
  background-color: #9b0621;
  background-repeat: no-repeat;
  border-radius: 50%;

  // transition: all 0.3s cubic-bezier(1, 0, 1, 1);
  // transform: translateZ(20px) rotateX(-25deg);
  // transform-origin: center center -20px;
  // transform-style: preserve-3d;
}

// .switch .button::before {
//   position: absolute;
//   top: 0;
//   width: 45px;
//   height: 45px;
//   border-radius: 50%;
//   content: "";
//   background: linear-gradient(rgb(255 255 255 / 80%) 10%, rgb(255 255 255 / 30%) 30%, #650000 75%, #320000) 50% 50% / 97% 97%,
//    #b10000;
//   background-repeat: no-repeat;
//   transform: rotateX(-90deg);
//   transform-origin: top;
// }

// .switch .button::after {
// position: absolute;
// bottom: 0;
// width: 50px;
// height: 50px;
// border-radius: 50%;
// content: "";
// background-image: linear-gradient(#650000, #320000);
// box-shadow: 0 45px 8px 0 black, 0 60px 20px 0 rgb(0 0 0 / 50%);
// transform: translateY(45px) rotateX(-92deg);
// transform-origin: top;
// }
.switch .light {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#ffc97e, #ff1818 40%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  animation: light-off 1s;
}
.switch .dots {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(transparent 30%, rgb(101 0 0 / 70%) 70%);
  background-size: 10px 10px;
  border-radius: 50%;
}

//  IO标志
.switch .characters {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(white, white) 50% 20% / 5% 20%,
    radial-gradient(circle, transparent 50%, white 52%, white 70%, transparent 72%) 50% 80% / 33% 25%;
  background-repeat: no-repeat;
}

// 边缘光
.switch .shine {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(white, transparent 3%) 50% 50% / 97% 97%,
    linear-gradient(rgb(255 255 255 / 50%), transparent 50%, transparent 80%, rgb(255 255 255 / 50%)) 50% 50% / 97% 97%;
  background-repeat: no-repeat;
  border-radius: 50%;
  opacity: 0.5;
  transition: all 0.2s cubic-bezier(0, 0, 1, 1);
}
.switch .shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent 70%, rgb(0 0 0 / 80%));
  background-repeat: no-repeat;
  border-radius: 50%;
  opacity: 1;
  transition: all 0.3s cubic-bezier(1, 0, 1, 1);
}

@keyframes flicker {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

@keyframes light-off {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 0;
  }
}
</style>
