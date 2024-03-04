import { defineStore } from "pinia";
import piniaPersistConfig from "@/config/piniaPersist";
// 全局仓库
export const useAppStore = defineStore({
  id: "XunGu-app",

  state: () => ({
    appKey: "",
    // 页脚
    appName: "",
    appId: 0
  }),
  getters: {},
  actions: {
    setAppState(appKey: string, appName: string, appId: number) {
      this.appKey = appKey;
      this.appName = appName;
      this.appId = appId;
    },
    getAppNameState() {
      return this.appName;
    }
  },
  persist: piniaPersistConfig("xungu-app-store")
});
