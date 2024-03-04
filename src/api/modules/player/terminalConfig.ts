import http from "@/api";
import { ResultData } from "@/api/interface";
import { TERMINALCONFIG } from "@/api/config/servicePort";
import { BaseTerminalConfig } from "@/api/interface/player/baseTerminalConfig";

export const getListByPage = (params: BaseTerminalConfig.Config) => {
  return http.post<ResultData<BaseTerminalConfig.Config>>(TERMINALCONFIG + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: BaseTerminalConfig.Config) => {
  return http.post(TERMINALCONFIG + "addRow", params);
};

export const updateRow = (params: BaseTerminalConfig.Config) => {
  return http.post(TERMINALCONFIG + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(TERMINALCONFIG + "deleteRows", params);
};

export const status = [
  { label: "禁用", value: 0 },
  { label: "启用", value: 1 }
];
