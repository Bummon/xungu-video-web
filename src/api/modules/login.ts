import { Login } from "@/api/interface/index";
import { LOGIN } from "@/api/config/servicePort"; // 路径前缀分项
import http from "@/api";

export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(LOGIN + "/login", params, { noLoading: true });
};
// 获取菜单列表
export const getAuthMenuListApi = () => {
  return http.post(LOGIN + "/menuListByToken", {}, { noLoading: true });
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  return http.post<Login.ResAuthButtons>(LOGIN + "/permissionListByToken", {}, { noLoading: true });
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtonList.json 数据
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(LOGIN + "/logout");
};
