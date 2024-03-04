<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <AssemblySize id="assemblySize" />
      <Language id="language" />
      <SearchMenu id="searchMenu" />
      <ThemeSetting id="themeSetting" />
      <Message id="message" v-model:notice-list="noticeList" :label="label" :len="len" :update="init" />
      <Fullscreen id="fullscreen" />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
import AssemblySize from "./components/AssemblySize.vue";
import Language from "./components/Language.vue";
import SearchMenu from "./components/SearchMenu.vue";
import ThemeSetting from "./components/ThemeSetting.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";
import Message from "@/layouts/components/Header/components/Message.vue";
import { WorkOrder } from "@/api/interface/work";
import { OrderHandle } from "@/views/work/order/index";
import { useAppStore } from "@/stores/modules/appStore";

const appStore = useAppStore();
const userStore = useUserStore();
const username = computed(() => userStore.userInfo.name);
const noticeList = ref<WorkOrder.notice>([]);
let label = "通知";
let len = 0;

async function init() {
  noticeList.value = await OrderHandle.getOrderNotice();
  let list = noticeList.value.filter(n => {
    return n.noticeStatus === 0;
  });
  if (list.length != 0) {
    label += "(" + list.length + ")";
  }
  len = list.length;
}

if (appStore.appKey === "admin") {
  init();
}
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>
