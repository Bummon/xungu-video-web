import { ResultData } from "@/api/interface";
import { BaseTerminalType } from "@/api/interface/player/baseTerminalType";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { TERMINALTYPE } from "@/api/config/servicePort";

export const getListByPage = (params: BaseTerminalType.Type) => {
  return http.post<ResPage<BaseTerminalType.Type>>(TERMINALTYPE + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: BaseTerminalType.Type) => {
  return http.post(TERMINALTYPE + "addRow", params);
};

export const updateRow = (params: BaseTerminalType.Type) => {
  return http.post(TERMINALTYPE + "updateRow", params);
};

export const deleteRows = (params: { id: string[] }) => {
  return http.post(TERMINALTYPE + "deleteRows", params);
};

export const changeStatusById = (params: BaseTerminalType.changeStatusById) => {
  return http.post(TERMINALTYPE + "changeStatusById", params);
};

export const getTypeList = () => {
  return http.post<ResultData<BaseTerminalType.Type>>(TERMINALTYPE + "getList");
};
