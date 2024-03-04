import { SysMenu } from "@/api/interface/system1/sysMenu";
import { ResultData } from "@/api/interface";
import { LIB } from "@/api/config/servicePort";
import http from "@/api";

/**
 *  新增媒体库资源
 *@param {id:string}
 */
export const addRow = (params: { id: string }) => {
  return http.post(LIB + `/addRow`, params);
};
/**
 *  新增媒体库资源
 *@param {id:string}
 */
export const addRows = (params: { id: string }) => {
  return http.post(LIB + `/addRows`, params);
};

/**
 * 编辑媒体库资源
 * @param {SysMenu.Menu}
 */
export const updateRow = (params: SysMenu.Menu) => {
  return http.post(LIB + `/updateRow`, params);
};
/**
 *
 * 删除媒体库资源
 * @param params
 */
export const deleteRows = (params: { ids: string[] }) => {
  return http.post(LIB + `/deleteRows`, params);
};

export const getListByPage = (params: SysMenu.Menu) => {
  return http.post<ResultData<SysMenu.TreeMenu>>(LIB + `/getListByPage`, params);
};
export const getAllList = (params: SysMenu.Menu) => {
  return http.post<ResultData<SysMenu.TreeMenu>>(LIB + `/getAllList`, params, { noLoading: true });
};
