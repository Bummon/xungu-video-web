<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

let authStore = useAuthStore();
const router = useRouter();

function backControl() {
  if (authStore.meetControlAuth) {
    // 有远程控制的权限
    router.push("/remoteControl");
  } else {
    router.push("/home");
  }
}
</script>

<template>
  <div class="bs-header">
    <div class="bs-left bs-header-between">
      <div class="bs-logo">
        <span></span>
        <!-- <p class="computer-name">中音讯谷</p> -->
      </div>
      <div class="bs-logo-triangle"></div>
    </div>
    <div class="bs-center bs-header-center">
      <p class="dataScreen-title">会议室数据治理大屏</p>
      <div class="bs-header-center-left-triangle"><span></span></div>
      <div class="bs-header-center-main">
        <!-- <span class="line-0"></span> -->
        <!-- <span class="line-1"></span> -->
        <!-- <span class="line-2"></span> -->
        <!-- <span class="line-3"></span> -->
      </div>
      <div class="bs-header-center-right-triangle"><span></span></div>
    </div>
    <div class="bs-right bs-header-between">
      <div class="bs-header-right-triangle"></div>
      <div class="bs-logo">
        <!-- <span></span> -->
        <p class="backPage" @click="backControl">前往后台</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../index.scss";
.bs-header {
  display: flex;
  width: 100%;
  height: 8vh;
  margin-bottom: 4vh;

  // backdrop-filter: blur(10px);
  background: url("../assets//images/slice.png") no-repeat;
  background-size: 100% 8vh;
  .bs-header-between {
    position: relative;
    display: flex;
    width: 30vw;
    .bs-logo {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20vw;
      height: 8vh;

      // background-color: rgb(255 255 255 / 9%);
      // backdrop-filter: $bs-card-bgc-blur;
      p {
        height: 8vh;
        font-family: "仿宋";
        font-size: 1vw;
        font-weight: bolder;
        line-height: 8vh;
        color: #47f1fc;
        text-align: center;
        letter-spacing: 2px;

        // background-image: url("../assets/png/seal.png");
        // background-repeat: no-repeat;
        // background-position: center;
        // background-size: 80% 60%;
      }
      .computer-name {
        width: 15vw;
      }
      .backPage {
        width: 8vw;
        cursor: pointer;
        background: url("../assets/images/header.png") no-repeat 100%;
        background-position: center;

        // &:hover {
        //   filter: brightness(130%);
        //   scale: 0.9;
        // }
      }
      span {
        position: absolute;
        bottom: 5%;
        left: 0;
        width: 100%;
        height: 5%;

        // border-top: 1px solid $border-line;
        // border-bottom: 1px solid $main-color-gray;
      }
    }
    .bs-logo-triangle {
      position: relative;
      width: 10vw;
      height: 8vh;

      // border-top: 4vh solid transparent;
      // border-right: 5vw solid transparent;
      // border-bottom: 4vh solid rgb(255 255 255 / 15%);
      // border-left: 5vw solid rgb(255 255 255 / 35%);
    }
    .bs-header-right-triangle {
      position: relative;
      width: 10vw;
      height: 8vh;

      // border-top: 4vh solid transparent;
      // border-right: 5vw solid rgb(255 255 255 / 35%);
      // border-bottom: 4vh solid rgb(255 255 255 / 15%);
      // border-left: 5vw solid transparent;
    }
  }
  .bs-header-center {
    position: relative;
    display: flex;

    // 全局标题
    .dataScreen-title {
      position: absolute;
      inset: 0;
      z-index: 999;
      margin: 0 auto;

      // font-family: $special-font-family;
      font-size: 1.8vw;
      font-weight: 600;
      line-height: 8vh;
      color: #56b8ff;
      text-align: center;

      // text-shadow: 5px 5px 2px #000000, -1px -1px 1px #024a4a;
      letter-spacing: 10px;
    }
    .bs-header-center-right-triangle {
      width: 10vw;
      height: 10vh;

      // border-top: 5vh solid rgb(255 255 255 / 15%);
      // border-right: 5vw solid transparent;
      // border-bottom: 5vh solid transparent;
      // border-left: 5vw solid $sky-bgc;
    }
    .bs-header-center-left-triangle {
      width: 10vw;
      height: 10vh;

      // border-top: 5vh solid rgb(255 255 255 / 15%);
      // border-right: 5vw solid $sky-bgc;
      // border-bottom: 5vh solid transparent;
      // border-left: 5vw solid transparent;
    }
    .bs-header-center-main {
      position: relative;
      width: 20vw;
      height: 10vh;
      margin: 0 auto;

      // backdrop-filter: $bs-card-bgc-blur;
      // background-color: $sky-bgc;
      .line-0 {
        position: absolute;
        bottom: -3px;
        z-index: 999;
        width: 20vw;
        height: 2px;
        background-color: #000000;
        border-radius: 2px;
      }
      .line-1 {
        position: absolute;
        bottom: 0;
        z-index: 999;
        width: 20.2vw;
        height: 2px;
        margin-left: -0.1vw;
        background-color: #000000;
        border-radius: 2px;
      }
      .line-2 {
        position: absolute;
        bottom: 3px;
        left: -0.2vw;
        z-index: 999;
        width: 20.4vw;
        height: 3px;
        background-color: $main-color-gray;
        border-radius: 3px;
      }
      .line-3 {
        position: absolute;
        bottom: 6px;
        left: -3.5vw;
        z-index: 999;
        display: none;
        width: 21vw;
        height: 2px;
        margin-left: 3vw;
        border-radius: 3px;
      }
    }
  }
}
</style>
