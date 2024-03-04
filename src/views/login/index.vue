<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/icons/xungu-logo.svg" alt="" />
          <div class="welcome-text">
            <p class="logo-title">视频会议</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import LoginForm from "./components/LoginForm.vue";
import { ref } from "vue";
import { useAppStore } from "@/stores/modules/appStore";

const appStore = useAppStore();
const drawerVisible = ref(false);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
