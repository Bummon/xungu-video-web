// ? 全局默认配置项

// 首页地址（默认）

export const HOME_URL = () => {
  let app = localStorage.getItem("xungu-app");
  if (app === "control") {
    return "/dataScreen";
  }
  return "admin";
};
// 登录页地址（默认）
export const LOGIN_URL: string = "/login";

// 数据大屏页面
export const DataScreen_URL: string = "/dataScreen";
// 默认主题颜色
export const DEFAULT_PRIMARY: string = "#04b2a2";

// 路由白名单地址（必须是本地存在的路由 staticRouter.ts 中）
export const ROUTER_WHITE_LIST: string[] = ["/500"];

// 高德地图 key
export const AMAP_MAP_KEY: string = "";

// 百度地图 key
export const BAIDU_MAP_KEY: string = "";

export const ALLOW_PRESET: boolean = true; // 是否允许修改内置属性 协议 命令 型号
