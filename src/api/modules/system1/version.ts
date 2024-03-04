import http from "@/api";
import { ResPage } from "@/api/interface";
import { VERSION } from "@/api/config/servicePort";
import { sysAppVersion } from "@/api/interface/system1/sysAppVersion";

export const getListByPage = (params: sysAppVersion.appVersion) => {
  return http.post<ResPage<sysAppVersion.appVersion>>(VERSION + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: sysAppVersion.appVersion) => {
  return http.post(VERSION + "addRow", params);
};

export const updateRow = (params: sysAppVersion.appVersion) => {
  return http.post(VERSION + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(VERSION + "deleteRows", params);
};

export const changeStatusById = (params: sysAppVersion.changeStatusById) => {
  return http.post(VERSION + "changeStatusById", params);
};
export const getDetailById = (params: sysAppVersion.changeStatusById) => {
  return http.post(VERSION + "getDetailById", params);
};
