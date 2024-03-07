<!-- 纵向布局 -->
<template>
  <el-container class="layout">
    <el-aside>
      <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
        <div class="logo flx-center">
          <img class="logo-img" :src="logo" alt="logo" />
          <span class="logo-text" v-show="!isCollapse">{{ title }}</span>
        </div>
        <el-scrollbar>
          <el-menu
            :default-active="activeMenu"
            :collapse="isCollapse"
            :router="false"
            :unique-opened="true"
            :collapse-transition="false"
          >
            <SubMenu :menuList="menuList" />
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <Main />
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="layoutVertical">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
import { useGlobalStore } from "@/stores/modules/global";
import Main from "@/layouts/components/Main/index.vue";
import ToolBarLeft from "@/layouts/components/Header/ToolBarLeft.vue";
import ToolBarRight from "@/layouts/components/Header/ToolBarRight.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";
import { useAppStore } from "@/stores/modules/appStore";
import { useLogoStore } from "@/stores/modules/logo";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const logoStore = useLogoStore();

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const isCollapse = computed(() => globalStore.isCollapse);
const menuList = computed(() => authStore.showMenuListGet);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);

const title = ref("视频会议");
const logo = ref("src/assets/icons/xungu-logo.svg");

const initLogo = async () => {
  await logoStore.getLogoConfig();
  const { systemName, systemLogo } = storeToRefs(logoStore);
  title!.value = systemName.value ? systemName.value : "视频会议";
  logo!.value = systemLogo.value ? systemLogo.value : "src/assets/icons/xungu-logo.svg";
};

onMounted(async () => {
  await initLogo();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
