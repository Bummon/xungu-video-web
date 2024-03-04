import { SysMenu } from "@/api/interface/system1/sysMenu";
import { ResultData } from "@/api/interface";
import { LIBRARY } from "@/api/config/servicePort";
import http from "@/api";

export const getTreeMenuList = (params: SysMenu.Menu) => {
  return http.post<ResultData<SysMenu.TreeMenu>>(LIBRARY + `/getTreeList`, params, { noLoading: true });
};

// 新增菜单
export const addRow = (params: { id: string }) => {
  return http.post(LIBRARY + `/addRow`, params);
};

// 编辑文件
export const updateRow = (params: SysMenu.Menu) => {
  return http.post(LIBRARY + `/updateRow`, params);
};

// 删除文件
export const deleteRows = (params: { ids: string[] }) => {
  return http.post(LIBRARY + `/deleteRows`, params);
};

export const getListByPage = (params: SysMenu.Menu) => {
  return http.post<ResultData<SysMenu.TreeMenu>>(LIBRARY + `/getListByPage`, params);
};
