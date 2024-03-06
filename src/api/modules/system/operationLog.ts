import { sysOperationLog } from "@/api/interface/system/sysOperationLog";
import http from "@/api";
import { OPERATION_LOG } from "@/api/config/servicePort";
import { ResPage } from "@/api/interface";

export const getOperationLogList = (params: sysOperationLog.OperationLog) => {
  return http.post<sysOperationLog.OperationLog[]>(OPERATION_LOG + `/list`, params);
};

export const getOperationLogPage = (params: sysOperationLog.OperationLog) => {
  return http.post<ResPage<sysOperationLog.OperationLog[]>>(OPERATION_LOG + `/page`, params);
};

export const getOperationLogInfo = (operId: number | bigint) => {
  return http.post<sysOperationLog.OperationLog>(OPERATION_LOG + `/info`, { id: operId });
};

export const deleteOperationLog = (operIds: number[] | bigint[]) => {
  return http.post(OPERATION_LOG + `/remove`, { ids: operIds });
};
