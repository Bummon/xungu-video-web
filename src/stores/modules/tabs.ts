import router from "@/routers";
import { defineStore } from "pinia";
import { TabsState, TabsMenuProps } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";

export const useTabsStore = defineStore({
  id: "xungu-tabs",
  state: (): TabsState => ({
    tabsMenuList: []
  }),
  actions: {
    // 添加
    async addTabs(tabItem: TabsMenuProps) {
      if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
        this.tabsMenuList.push(tabItem);
      }
    },
    // 移除
    async removeTabs(tabPath: string, isCurrent: boolean = true) {
      const tabsMenuList = this.tabsMenuList;
      if (isCurrent) {
        tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return;
          const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
          if (!nextTab) return;
          router.push(nextTab.path);
        });
      }
      this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath);
    },
    // 清空
    async closeMultipleTab(tabsMenuValue?: string) {
      this.tabsMenuList = this.tabsMenuList.filter(item => {
        return item.path === tabsMenuValue || !item.close;
      });
    },
    // Set Tabs
    async setTabs(tabsMenuList: TabsMenuProps[]) {
      this.tabsMenuList = tabsMenuList;
    },
    // Set Tabs Title
    async setTabsTitle(title: string) {
      const nowFullPath = location.hash.substring(1);
      this.tabsMenuList.forEach(item => {
        if (item.path == nowFullPath) item.title = title;
      });
    }
  },
  persist: piniaPersistConfig("xungu-tabs")
});
