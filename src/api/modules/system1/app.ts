import http from "@/api";
import { ResPage, ResultData } from "@/api/interface";
import { APP } from "@/api/config/servicePort";
import { sysApp } from "@/api/interface/system1/sysApp";

export class sysAppHttp {
  static getAppList() {
    return http.post<ResultData<sysApp.app>>(APP + "getList", { noLoading: true });
  }
}

export class sysMobileAppHttp {
  static getAppList() {
    return http.post<sysApp.app[]>("/player/mobile/getList", { noLoading: true });
  }
}

export const getListByPage = (params: sysApp.app) => {
  return http.post<ResPage<sysApp.app>>(APP + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: sysApp.app) => {
  return http.post(APP + "addRow", params);
};

export const updateRow = (params: sysApp.app) => {
  return http.post(APP + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(APP + "deleteRows", params);
};

export const changeStatusById = (params: sysApp.changeStatusById) => {
  return http.post(APP + "changeStatusById", params);
};

export const getList = () => {
  return http.post<ResultData<sysApp.app>>(APP + "getList", { noLoading: true });
};
