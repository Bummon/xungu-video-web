<script setup lang="ts">
import { onMounted, ref } from "vue";
import ColumnChart from "./components/column/index.vue";
import EquipmentTotal from "@/views/dataScreen/components/equipmentTotal/equipmentTotal.vue";
import BsHeader from "@/views/dataScreen/module/bs-header.vue";
import ServerEquipment from "@/views/dataScreen/components/serverEquipment/index.vue";
import WorkList from "@/views/dataScreen/components/workList/workList.vue";
import MeetRoomInfo from "@/views/dataScreen/components/meetRoomInfo/index.vue";
import VipRoom from "@/views/dataScreen/components/vipRoom/index.vue";
import BsMainCenter from "@/views/dataScreen/module/bs-main-center/index.vue";
import { UserHttp } from "@/api/modules/system1/user";
import { useUserStore } from "@/stores/modules/user";
import { SysUser } from "@/api/interface/system1/sysUser";

const tabVip = ref(0);
const userStore = useUserStore();
const vipList = ref();
onMounted(async () => {
  await getVip();
});

async function getVip() {
  // 后端接口不规范  只能直接取用 没有code和msg
  let userInfo: SysUser.User = await UserHttp.getDetailById(userStore.userInfo.userId);

  if (userInfo?.meetingRooms?.constructor === Array && userInfo?.meetingRooms.length > 0) {
    vipList.value = userInfo?.meetingRooms;
    console.log("vipList.value", vipList.value);
  }
}

function handleTabVip(room) {
  tabVip.value = room.roomId;
}
</script>

<template>
  <div class="BS-container" id="data-screen">
    <Bs-header></Bs-header>
    <div class="bs-main">
      <div class="bs-main-left">
        <div class="bs-left-center">
          <div class="card-title">
            <!-- <div class="title-icon">
              <span class="color-span1"></span>
              <span class="color-span2"></span>
              <span class="color-span3"></span>
            </div> -->
            <p>告警统计</p>
          </div>

          <ColumnChart></ColumnChart>
        </div>
      </div>
      <div class="bs-main-center">
        <BsMainCenter></BsMainCenter>
      </div>
      <div class="bs-main-right">
        <div class="bs-main-right-data">
          <div class="card-title">
            <!-- <div class="title-icon">
              <span class="color-span1"></span>
              <span class="color-span2"></span>
              <span class="color-span3"></span>
            </div> -->
            <p>工单统计</p>
          </div>
          <WorkList></WorkList>
        </div>
      </div>
    </div>
    <div class="bs-footer">
      <div class="bs-left bs-footer-left">
        <div class="bs-left-footer-data">
          <div class="card-title">
            <!-- <div class="title-icon">
              <span class="color-span1"></span>
              <span class="color-span2"></span>
              <span class="color-span3"></span>
            </div> -->
            <p>服务器概况</p>
          </div>
          <ServerEquipment></ServerEquipment>
        </div>
      </div>
      <div class="bs-footer-center">
        <div class="bs-center-footer-data">
          <div class="card-titles">
            <!-- <div class="title-icon">
              <span class="color-span1"></span>
              <span class="color-span2"></span>
              <span class="color-span3"></span>
            </div> -->
            <p @click="tabVip = 0">会议室总览</p>
            <div class="tab-vip">
              <span class="vip-title">VIP会议室：</span>
              <span
                @click="handleTabVip(room)"
                :class="tabVip === room.roomId ? 'selectVip' : ''"
                v-for="room in vipList"
                :key="room.roomId"
                >{{ room.roomName || "已删除" }}</span
              >
            </div>
          </div>
          <MeetRoomInfo v-if="tabVip === 0"></MeetRoomInfo>
          <div class="" v-else>
            <div v-for="room in vipList" :key="room.roomId">
              <VipRoom :id="room.roomId" v-if="tabVip === room.roomId"></VipRoom>
            </div>
          </div>
        </div>
      </div>
      <div class="bs-right bs-footer-right">
        <div class="bs-right-footer-data">
          <div class="card-title">
            <!-- <div class="title-icon">
              <span class="color-span1"></span>
              <span class="color-span2"></span>
              <span class="color-span3"></span>
            </div> -->
            <p>设备统计</p>
          </div>
          <EquipmentTotal></EquipmentTotal>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./index.scss";

.bs-main {
  display: flex;
  width: 100%;
  height: 48vh;

  .bs-main-left {
    box-sizing: border-box;
    width: 28vw;
    height: 48vh;
    padding: 1vh 0;
    margin: 0 1vw;
    background: url("./assets/images/Group1.png") no-repeat;
    background-size: 100% 100%;

    .bs-left-center {
      box-sizing: border-box;
      width: 27vw;
      height: 45vh;
      padding: 1vh;
      margin: 0 auto;

      // background-color: $bs-card-bgc;
      // backdrop-filter: $bs-card-bgc-blur;
      // box-shadow: 1px 1px 1px 1px rgb(4 0 0 / 63%);
    }
  }

  .bs-main-center {
    position: relative;
    width: 40vw;
    height: 48vh;
  }

  .bs-main-right {
    box-sizing: border-box;
    width: 28vw;
    height: 48vh;
    padding: 1vh 0;
    margin: 0 1vw;
    background: url("./assets/images/Group1.png") no-repeat;
    background-size: 100% 100%;

    .bs-main-right-data {
      box-sizing: border-box;
      width: 27vw;
      height: 46vh;
      padding: 1vh;
      margin: 0 auto;

      // background-color: $bs-card-bgc;
      // backdrop-filter: $bs-card-bgc-blur;
      // box-shadow: $bs-card-shadow;
    }
  }
}

.bs-footer {
  display: flex;
  width: 100%;
  height: 40vh;

  .bs-footer-left {
    position: relative;
    box-sizing: border-box;
    width: 28vw;
    height: 37vh;
    padding: 1vh 0;
    margin: 1vh 1vw;
    background: url("./assets/images/Group17.png") no-repeat;
    background-size: 100% 100%;

    // backdrop-filter: $bs-card-bgc-blur;
    .bs-left-footer-data {
      box-sizing: border-box;
      width: 27vw;
      height: 38vh;
      padding: 0 1vw;
      margin: 0 auto;

      // background-color: $bs-card-bgc;
      // box-shadow: 1px 1px 1px 1px rgb(4 0 0 / 63%);
    }
  }

  .bs-footer-center {
    box-sizing: border-box;
    width: 40vw;
    height: 38vh;
    padding: 1vh 1vw;
    margin: 1vh 0;
    background: url("./assets/images/center.png") no-repeat;
    background-size: 100% 100%;

    // background-color: $bs-card-bgc;
    // backdrop-filter: $bs-card-bgc-blur;
    .bs-center-footer-data {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 40vw;
      height: 38vh;
      margin: 0 auto;

      // box-shadow: 1px 1px 1px 1px rgb(4 0 0 / 63%);
    }

    .tab-vip {
      position: absolute;
      right: 10vw;
      bottom: 1vh;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 3vh;

      span {
        display: block;
        height: 3vh;
        padding: 0 0.5vw;
        margin: 0 1px;
        font-size: 0.8vw;
        font-weight: bold;
        line-height: 3vh;
        cursor: pointer;
        border-top-left-radius: 1vh;
        border-top-right-radius: 1vh;
      }

      .vip-title {
        padding: 0;
        color: #ffffff;
        background-color: transparent;
      }
    }
  }

  .bs-footer-right {
    position: relative;
    box-sizing: border-box;
    width: 28vw;
    height: 38vh;
    padding: 1vh 0;
    margin: 1vh 1vw;
    background: url("./assets/images/Group1.png") no-repeat;
    background-size: 100% 100%;

    .bs-right-footer-data {
      box-sizing: border-box;
      width: 28vw;
      height: 36vh;
      padding: 0 1vw;

      // backdrop-filter: $bs-card-bgc-blur;
      // background-color: $bs-card-bgc;
      // box-shadow: 2px 2px 1px 1px rgb(0 0 0 / 93%);
    }
  }
}

.bs-card-map {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5vh 1vw;
  margin: 0 auto;

  .o_o {
    width: 10px;
    height: 10px;
    background-color: $border-line;
    border-radius: 50%;
  }

  .line {
    width: 80%;
    height: 2px;
    background-color: $border-line;
  }
}

.card-titles {
  position: relative;
  width: 77%;
  height: 5vh;
  margin-right: 7vw;
  background: url("./assets//images/Subheadings.png") no-repeat;
  background-size: 100% 100%;

  p {
    height: 5vh;
    padding-left: 1vw;
    font-size: 1vw;
    line-height: 5vh;
    color: #fffb67;
    cursor: pointer;
  }
}

.card-title {
  position: relative;
  width: 100%;
  height: 5vh;

  // border-bottom: 2px solid rgb(255 255 255 / 30%);
  background: url("./assets//images/title.png") no-repeat;
  background-size: 100% 100%;

  // .title-icon {
  //   position: absolute;
  //   top: 0;
  //   left: 5%;
  //   display: flex;
  //   height: 5vh;
  //   span {
  //     width: 8px;
  //     height: 2.5vh;
  //     margin: 1vh 2px;
  //     border-radius: 4px;
  //     transform: rotate(45deg);
  //   }
  //   .color-span1 {
  //     background-color: $main-color-gray;
  //   }
  //   .color-span2 {
  //     background-color: $main-color-primary;
  //   }
  //   .color-span3 {
  //     background-color: #000000;
  //   }
  // }
  p {
    height: 5vh;
    padding-left: 1vw;
    font-size: 1vw;
    line-height: 5vh;
    color: #fffb67;

    // text-align: left;
    // text-shadow: 1px 1px 0 #0e0e0e;
    cursor: pointer;

    // border-bottom: 1px solid #9b9b9b;
  }
}
</style>
