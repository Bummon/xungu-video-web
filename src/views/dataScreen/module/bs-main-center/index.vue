<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { AreaType } from "@/api/interface/control/area";
import { AreaHttp } from "@/api/modules/control/area";
import { RoomType } from "@/api/interface/control/MeetRoom";
import { RoomHttp } from "@/api/modules/control/meetRoom";
import { DataScreenHttp } from "@/api/modules/dataScreen";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

let authStore = useAuthStore();
const router = useRouter();
const tabButton = ref();
const firstFlag = ref(false);
let timer = null;

function mouseEnterTab() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  firstFlag.value = true;
}

function mouseLeaveTab() {
  timer = setTimeout(() => {
    firstFlag.value = false;
  }, 500);
}

let firstAreaList = ref<AreaType.area[]>([]);
let secondAreaList = ref<AreaType.area[]>([]);
let roomList = ref<RoomType.Room[]>([]);
let selectFirstAreaData = ref<AreaType.area>();
let selectSecondAreaData = ref<AreaType.area>();
let roomNum = ref({
  faultTotal: 0,
  offTotal: 0,
  onlineTotal: 0,
  total: 0
});

async function selectFirstArea(item: AreaType.area) {
  selectFirstAreaData.value = item;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  firstFlag.value = false;
  secondAreaList.value = (await AreaHttp.getAreaList({ parentId: item.areaId })).data;
  if (secondAreaList.value.constructor === Array && secondAreaList.value.length > 0) {
    selectSecondAreaData.value = secondAreaList.value[0];
    roomList.value = (await RoomHttp.getList({ areaId: secondAreaList.value[0].areaId })).data;
  }
}

async function selectSecondArea(item) {
  selectSecondAreaData.value = item;
  roomList.value = (await RoomHttp.getList({ areaId: item.areaId })).data;
}

async function init() {
  firstAreaList.value = (await AreaHttp.getAreaList({ parentId: 0 })).data;

  // 获取第一项
  if (firstAreaList.value.constructor === Array && firstAreaList.value.length > 0 && firstAreaList.value[0].areaId) {
    selectFirstAreaData.value = firstAreaList.value[0];
    secondAreaList.value = (await AreaHttp.getAreaList({ parentId: firstAreaList.value[0].areaId })).data;
    if (secondAreaList.value.constructor === Array && secondAreaList.value.length > 0) {
      selectSecondAreaData.value = secondAreaList.value[0];
      roomList.value = (await RoomHttp.getList({ areaId: secondAreaList.value[0].areaId })).data;
    }
  }
  roomNum.value = (await DataScreenHttp.getMeetingRoomCountList()).data;

  console.log("会议室数量", roomNum.value);
  console.log("一级区域列表", firstAreaList.value);
}

function handleEnterController(item) {
  console.log("跳转到控制台");
  if (authStore.meetControlAuth && item.runningStatus !== 2) {
    // 有远程控制的权限
    router.push({ path: "/meetingController", query: { id: item.roomId } });
  }
}

onMounted(() => {
  init();
});
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
});
</script>

<template>
  <div class="bs-main-center-container">
    <div class="title">
      <!-- <span style="background-color: rgb(0 129 144 / 33%)"
        >在线：<span class="total-text">{{ roomNum.onlineTotal }}</span></span
      >

      <span style="background-color: rgb(251 212 34 / 34%)"
        >故障：<span class="total-text">{{ roomNum.faultTotal }}</span></span
      >
      <span style="background-color: rgb(140 140 140 / 33%)"
        >离线：<span class="total-text">{{ roomNum.offTotal }}</span></span
      >
      <span
        >故障率：<span class="total-text">{{ ((roomNum.faultTotal / roomNum.total) * 100).toFixed(1) }}%</span></span
      > -->
      <div>
        <span class="total-text">{{ roomNum.onlineTotal }}</span>
        <span>在线</span>
      </div>
      <div>
        <span class="total-text">{{ roomNum.faultTotal }}</span>
        <span>故障</span>
      </div>
      <div>
        <span class="total-text">{{ roomNum.offTotal }}</span>
        <span>离线</span>
      </div>
      <div>
        <span class="total-text">{{ ((roomNum.faultTotal / roomNum.total) * 100).toFixed(1) }}%</span>
        <span>故障率</span>
      </div>
    </div>
    <div class="bg-body">
      <div class="tabFirst">
        <div class="tabButton" ref="tabButton" @mouseenter="mouseEnterTab" @mouseleave="mouseLeaveTab">
          切换区域
          <div class="firstArea-data" v-show="firstFlag">
            <div
              class="firstArea"
              v-for="item in firstAreaList"
              :key="item.areaId"
              @click="selectFirstArea(item)"
              :class="item.areaId === selectFirstAreaData?.areaId ? 'activeFirst' : ''"
            >
              <p>{{ item.areaName }}</p>
            </div>
          </div>
        </div>
        <p class="firstArea-text four-corn-div">
          <span class="border1"></span><span class="border2"></span><span class="border3"></span><span class="border4"></span
          >{{ selectFirstAreaData?.areaName || "" }}
        </p>
      </div>
      <div class="mcd-body">
        <div class="mcd-left">
          <div class="area-list">
            <p
              class="four-corn-div"
              v-for="item in secondAreaList"
              :key="item.areaId"
              :class="item.areaId === selectSecondAreaData?.areaId ? 'activeSecond' : ''"
              @click="selectSecondArea(item)"
            >
              <span class="border1"></span>
              <span class="border2"></span>
              <span class="border3"></span>
              <span class="border4"></span>{{ item.areaName }}
            </p>
          </div>
        </div>
        <div class="mcd-right">
          <div class="mdc-room-item" v-for="item in roomList" :key="item.roomId" @click="handleEnterController(item)">
            <p>{{ item.roomName }}</p>
            <span
              :style="
                [
                  'background-color:rgba(185, 185, 71, 0.84)',
                  'background-color:var(--el-color-primary);',
                  'background-color:gray'
                ][item.runningStatus]
              "
              >{{ ["故障", "在线", "离线"][item.runningStatus] }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../index.scss";
.bs-main-center-container {
  width: 40vw;
  height: 46vh;

  // background-color: $bs-card-bgc;
  // backdrop-filter: blur(5px);
  // box-shadow: $bs-card-shadow;
  .title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 8vh;
    div {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      width: 15%;
      height: 100%;
      font-size: 0.8vw;
      color: #ffffff;
      text-align: center;
      background: url("../../assets/images/radius.png") no-repeat;
      background-size: 100% 100%;
      .total-text {
        font-size: 1vw;
        color: #fffb67;
      }
    }
  }
  .bg-body {
    box-sizing: border-box;
    height: 40vh;
    padding: 0.7vh 0 0 0.4vw;
    background: url("../../assets/images/center1.png") no-repeat;
    background-size: 100% 100%;
    .tabFirst {
      display: flex;
      justify-content: flex-start;
      width: 40vw;
      .tabButton {
        position: relative;
        box-sizing: border-box;
        width: 6vw;
        height: 4vh;
        font-size: 0.8vw;
        line-height: 4vh;
        color: #32a4f1;
        text-align: center;
        text-shadow: 0 1px 2px rgb(0 253 255 / 50%);
        cursor: pointer;
        background: url("../../assets/images/area.png") no-repeat;
        background-size: 100% 100%;

        // border: 2px solid rgb(120 119 119);
        &:hover {
          background-color: transparent;

          // border: 2px solid $main-color-primary;
        }
        .firstArea-data {
          position: absolute;
          top: 2px;
          left: calc(6vw - 1px);
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          width: 33vw;
          height: 38vh;
          padding: 0.5vh 0.5vw;
          font-weight: bold;
          color: #ffffff;
          background-color: #012958;

          // border: 2px solid #646664;
          .firstArea {
            display: flex;
            align-items: end;
            width: 6.4vw;
            height: 8vh;
            padding: 0 0.2vw;
            margin: 2px;
            background-image: url("../../assets/images/webp.png");
            background-repeat: no-repeat;

            // background-position: center;
            background-size: 100% 100%;

            // border: 2px solid transparent;
            // box-shadow: 0 1px 0 0 #525151;
            p {
              width: 6vw;
              font-size: 0.8vw;
              line-height: 2vh;

              // background-color: rgb(255 255 255 / 70%);
            }
            &:hover {
              font-weight: bold;
              border: 2px solid #47f1fc;
            }
          }
          .activeFirst {
            font-weight: bold;
            border: 2px solid #47f1fc;
          }
        }
      }
      .firstArea-text {
        position: relative;
        box-sizing: border-box;
        width: 34vw;
        height: calc(4vh - 2px);
        line-height: 4.5vh;
        color: #47f1fc;
        text-align: center;

        // background-color: #040339;
      }
    }
    .mcd-body {
      display: flex;
      width: 40vw;
      .mcd-left {
        width: 6vw;
        height: 40vh;
        text-align: center;
        .area-list {
          width: 6vw;
          height: 37vh;
          overflow: hidden;
          p {
            position: relative;
            width: 5.8vw;
            height: 3.2vh;
            padding: 0 5px;
            margin: 0.5vh auto;
            overflow: hidden;
            font-size: 1.5vh;
            line-height: 3.2vh;
            color: #ededed;
            text-overflow: ellipsis;
            white-space: nowrap;

            // background-color: rgb(120 119 119);
            background: url("../../assets/images/room.png") no-repeat;
            background-size: 100% 100%;
          }
          .activeSecond {
            color: #ffffff;
            background: url("../../assets/images/rooms.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .mcd-right {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        width: 33vw;
        height: 34vh;
        padding: 1vh 1vw;
        background: url("../../assets/images/border.png") no-repeat;
        background-size: 100% 100%;

        // border: 5px double rgb(164 164 162 / 50%);
        .mdc-room-item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 8vw;
          height: 10vh;
          margin: 5px 3px 5px 1px;
          background-image: url("../../assets/png/meetRoom.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% 100%;

          // box-shadow: 2px 2px 2px 2px #1c1c1c;
          p {
            width: 100%;
            padding: 5px;
            font-size: 0.8vw;
            font-weight: bold;
            color: #000000;
            text-align: center;
            background-color: rgb(255 255 255 / 70%);
          }
          span {
            position: absolute;
            top: 0;
            right: 0;
            padding: 0 0.5vw;
            font-size: 14px;
            color: #0f0f0f;
          }
        }
      }
    }
  }
}

// .four-corn-div {
//   .border1 {
//     position: absolute;
//     top: 0;
//     left: 0;
//     &::after {
//       position: absolute;
//       top: 0;
//       left: 0;
//       width: 2px;
//       height: 10px;
//       content: "";
//       background-color: $main-color-primary;
//     }
//     &::before {
//       position: absolute;
//       top: 0;
//       left: 0;
//       width: 10px;
//       height: 2px;
//       content: "";
//       background-color: $main-color-primary;
//     }
//   }
//   .border2 {
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     &::after {
//       position: absolute;
//       bottom: 0;
//       left: 0;
//       width: 2px;
//       height: 10px;
//       content: "";
//       background-color: $main-color-primary;
//     }
//     &::before {
//       position: absolute;
//       bottom: 0;
//       left: 0;
//       width: 10px;
//       height: 2px;
//       content: "";
//       background-color: $main-color-primary;
//     }
//   }
//   .border3 {
//     position: absolute;
//     top: 0;
//     right: 0;
//     &::after {
//       position: absolute;
//       top: 0;
//       right: 0;
//       width: 2px;
//       height: 10px;
//       content: "";
//       background-color: $main-color-primary;
//     }
//     &::before {
//       position: absolute;
//       top: 0;
//       right: 0;
//       width: 10px;
//       height: 2px;
//       content: "";
//       background-color: $main-color-primary;
//     }
//   }
//   .border4 {
//     position: absolute;
//     right: 0;
//     bottom: 0;
//     &::after {
//       position: absolute;
//       right: 0;
//       bottom: 0;
//       width: 2px;
//       height: 10px;
//       content: "";
//       background-color: $main-color-primary;
//     }
//     &::before {
//       position: absolute;
//       right: 0;
//       bottom: 0;
//       width: 10px;
//       height: 2px;
//       content: "";
//       background-color: $main-color-primary;
//     }
//   }
// }
</style>
