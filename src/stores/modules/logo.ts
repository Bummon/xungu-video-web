import { defineStore } from "pinia";
import { LogoState } from "@/stores/interface";
import { getConfigInfo } from "@/api/modules/system/sysConfig";

export const useLogoStore = defineStore({
  id: "logo",
  state: (): LogoState => ({
    systemName: "",
    systemLogo: ""
  }),
  getters: {
    systemNameGet: state => state.systemName,
    systemLogoGet: state => state.systemLogo
  },
  actions: {
    async getLogoConfig() {
      const { data } = await getConfigInfo();
      this.systemName = data.systemName;
      this.systemLogo = data.systemLogo;
    }
  }
});
