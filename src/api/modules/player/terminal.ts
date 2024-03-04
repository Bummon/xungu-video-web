import { BaseTerminal } from "@/api/interface/player/baseTerminal";
import http from "@/api";
import { ResultData } from "@/api/interface";
import { TERMINAL } from "@/api/config/servicePort";

export const status = [
  { label: "离线", value: 0, tagType: "info" },
  { label: "在线", value: 1, tagType: "success" }
];

export const getListByPage = (params: BaseTerminal.Terminal) => {
  return http.post<ResultData<BaseTerminal.Terminal>>(TERMINAL + "getListByPage", params);
};

export const addRow = (params: BaseTerminal.Terminal) => {
  return http.post<ResultData<BaseTerminal.Terminal>>(TERMINAL + "addRow", params);
};

export const updateRow = (params: BaseTerminal.Terminal) => {
  return http.post<ResultData<BaseTerminal.Terminal>>(TERMINAL + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(TERMINAL + "deleteRows", params);
};

export const getList = (params: BaseTerminal.Terminal) => {
  return http.post<ResultData<BaseTerminal.Terminal>>(TERMINAL + "getList", params);
};
