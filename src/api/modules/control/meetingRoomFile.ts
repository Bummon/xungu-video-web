// import { sysJob } from "@/api/interface/system/sysJob";
import { ResPage } from "@/api/interface";
import http from "@/api";
import { MEETROOMFILE } from "@/api/config/servicePort";
/**
 * @name 会议室模块
 */
export namespace sysApp {
  export interface ReqApp {
    pageNum: number;
    pageSize: number;
  }
  export interface meeting {
    areaId: number;
    capacity: number;
    createTime: string;
    createUserId: number;
    createUserName: string;
    deletedFlag: number;
    imageUrl: string;
    location: string;
    modifyTime: string;
    modifyUserId: number;
    modifyUserName: string;
    roomId: number;
    roomName: string;
    roomStatus: number;
    roomType: string;
    runningStatus: number;
  }
}
export const getListByPage = (params: sysApp.ReqApp) => {
  return http.post<ResPage<sysApp.meeting>>(MEETROOMFILE + "getListByPage", params);
};
export const getList = () => {
  return http.post<ResPage<sysApp.meeting>>(MEETROOMFILE + "getList");
};

export const addRow = (params: sysApp.meeting) => {
  return http.post(MEETROOMFILE + "addRow", params);
};

export const updateRow = (params: sysApp.meeting) => {
  return http.post(MEETROOMFILE + "updateRow", params);
};

export const deleteRows = (id: string) => {
  return http.post(MEETROOMFILE + "deleteRows", id);
};
