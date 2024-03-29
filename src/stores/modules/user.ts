import { defineStore } from "pinia";
import { UserInfo, UserState } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({
    token: "",
    userInfo: { name: "TestMan", userId: 0, avatar: "" }
  }),
  getters: {},
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("xungu-user")
});
