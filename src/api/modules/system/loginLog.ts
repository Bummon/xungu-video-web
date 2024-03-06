import { sysLoginLog } from "@/api/interface/system/sysLoginLog";
import http from "@/api";
import { LOGIN_LOG } from "@/api/config/servicePort";
import { ResPage } from "@/api/interface";

export const getLoginLogList = (params: sysLoginLog.LoginLogQueryBo) => {
  return http.post<sysLoginLog.LoginLog[]>(LOGIN_LOG + `/list`, params);
};

export const getLoginLogPage = (params: sysLoginLog.LoginLogQueryBo) => {
  return http.post<ResPage<sysLoginLog.LoginLog[]>>(LOGIN_LOG + `/page`, params);
};

export const getLoginLogInfo = (logId: number | bigint) => {
  return http.post<sysLoginLog.LoginLog>(LOGIN_LOG + `/info`, { id: logId });
};

export const deleteLoginLog = (logIds: number[] | bigint[]) => {
  return http.post(LOGIN_LOG + `/remove`, { ids: logIds });
};
