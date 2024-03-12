import http from "@/api";
import { EXCEPTION_LOG } from "@/api/config/servicePort";
import { ResPage } from "@/api/interface";
import { SysExceptionLog } from "@/api/interface/system/sysExceptionLog";

export const getExceptionLogList = (params: SysExceptionLog.ExceptionLog) => {
  return http.post<SysExceptionLog.ExceptionLog[]>(EXCEPTION_LOG + `/list`, params);
};

export const getExceptionLogPage = (params: SysExceptionLog.ExceptionLog) => {
  return http.post<ResPage<SysExceptionLog.ExceptionLog[]>>(EXCEPTION_LOG + `/page`, params);
};

export const deleteExceptionLog = (operIds: number[] | bigint[]) => {
  return http.post(EXCEPTION_LOG + `/remove`, { ids: operIds });
};
