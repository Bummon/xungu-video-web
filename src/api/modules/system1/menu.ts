import { SysMenu } from "@/api/interface/system1/sysMenu";
import { MENU } from "@/api/config/servicePort";
import http from "@/api";

export const getTreeMenuList = (params = {}) => {
  return http.post<SysMenu.TreeMenu[]>(MENU + `/getTreeList`, params, { noLoading: true });
};

// 新增菜单
export const addRow = (params: { id: string }) => {
  return http.post(MENU + `/addRow`, params);
};

// 编辑菜单
export const updateRow = (params: SysMenu.Menu) => {
  return http.post(MENU + `/updateRow`, params);
};

// 删除菜单
export const deleteRows = (params: { ids: string[] }) => {
  return http.post(MENU + `/deleteRows`, params);
};

export const changeStatusById = (params: SysMenu.Menu) => {
  return http.post(MENU + "/changeStatusById", params);
};
