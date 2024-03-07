<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" :src="logo" alt="" />
          <div class="welcome-text">
            <p class="logo-title">{{ title }}</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import LoginForm from "./components/LoginForm.vue";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/modules/appStore";
import { useLogoStore } from "@/stores/modules/logo";
import { storeToRefs } from "pinia";

const logoStore = useLogoStore();
const appStore = useAppStore();
const drawerVisible = ref(false);

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
