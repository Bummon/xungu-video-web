import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/modules/login";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";

export const useAuthStore = defineStore({
  id: "admin",
  state: (): AuthState => ({
    // 按钮权限列表
    authButtonList: {},
    // 菜单权限列表
    authMenuList: [] as Menu.MenuOptions[],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: "",
    meetControlAuth: false // 有没有会议控制的权限
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: state => state.authButtonList,
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: state => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList)
  },
  actions: {
    // Get AuthButtonList
    async getAuthButtonList() {
      const { data } = await getAuthButtonListApi();
      this.authButtonList = data;
    },
    // 获取有展示权限的菜单
    // async getAuthMenuList() {
    //   // @ts-expect-error
    //   this.authMenuList = await getAuthMenuListApi();
    //   console.log("获取可用菜单列表authMenuList", this.authMenuList);
    // },
    async getAuthMenuList() {
      const { data } = await getAuthMenuListApi();
      console.log("getAuthMenuListApi接口返回的拿到的", data);

      this.authMenuList = data;
      if (data.constructor === Array) {
        // 判定他有没有远程控制的权限
        this.meetControlAuth = data.find(item => item.path === "/remoteControl");
      }
    },
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    }
  }
});
