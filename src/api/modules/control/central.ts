// import { sysJob } from "@/api/interface/system/sysJob";
import { ReqPage, ReqPagePlus, ResPage } from "@/api/interface";
import http from "@/api";
import { CENTRAL } from "@/api/config/servicePort";
import { BaseRoom } from "@/api/interface/player/baseRoom";
import { CentralType } from "@/api/interface/control/central";
/**
 * @name 会议室模块
 */
export namespace sysApp {
  export interface ReqApp {
    pageNum: number;
    pageSize: number;
  }
}
export const getListByPage = (params: ReqPagePlus) => {
  return http.post<ResPage<CentralType.central[]>>(CENTRAL + "getListByPage", params);
};
/**
 * 获取中控列表 不分页
 */
export const getCentralList = (params: Partial<CentralType.central> = {}) => {
  return http.post<CentralType.central>(CENTRAL + "getList", params);
};

export const addRow = (params: Partial<CentralType.central>) => {
  return http.post(CENTRAL + "addRow", params);
};

export const updateRow = (params: Partial<CentralType.central>) => {
  return http.post(CENTRAL + "updateRow", params);
};

export const deleteRows = (id: string) => {
  return http.post(CENTRAL + "deleteRows", id);
};
