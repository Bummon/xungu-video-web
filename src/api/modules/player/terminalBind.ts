import { BaseTerminalBind } from "@/api/interface/player/baseTerminalBind";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { TERMINALBIND } from "@/api/config/servicePort";

export const getListByPage = (params: BaseTerminalBind.TerminalBind) => {
  return http.post<ResPage<BaseTerminalBind.TerminalBind>>(TERMINALBIND + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: BaseTerminalBind.TerminalBind) => {
  return http.post(TERMINALBIND + "addRow", params);
};

export const updateRow = (params: BaseTerminalBind.TerminalBind) => {
  return http.post(TERMINALBIND + "updateRow", params);
};

export const deleteRows = (params: { id: string[] }) => {
  return http.post(TERMINALBIND + "deleteRows", params);
};

export const clear = (params: { id: string[] }) => {
  return http.post(TERMINALBIND + "clear", params);
};

export const changeStatusById = (params: BaseTerminalBind.changeStatusById) => {
  return http.post(TERMINALBIND + "changeStatusById", params);
};
