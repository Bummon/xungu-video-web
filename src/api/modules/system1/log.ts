import { sysLog } from "@/api/interface/system1/sysLog";
import { ResPage } from "@/api/interface";
import http from "@/api";
import { LOG } from "@/api/config/servicePort";

export const getListByPage = (params: sysLog.log) => {
  return http.post<ResPage<sysLog.log>>(LOG + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: sysLog.log) => {
  return http.post(LOG + "addRow", params);
};

export const updateRow = (params: sysLog.log) => {
  return http.post(LOG + "updateRow", params);
};

export const deleteRows = (id: string) => {
  return http.post(LOG + "deleteRows", id);
};
