import http from "@/api";
import { ResultData } from "@/api/interface";
import { BaseTerminalGroup } from "@/api/interface/player/baseTerminalGroup";
import { BIZPLATLIST } from "@/api/config/servicePort";

export const getListByPage = (params: BaseTerminalGroup.Group) => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(BIZPLATLIST + "getListByPage", params);
};

export const addRow = (params: BaseTerminalGroup.Group) => {
  return http.post(BIZPLATLIST + "addRow", params);
};

export const updateRow = (params: BaseTerminalGroup.Group) => {
  return http.post(BIZPLATLIST + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(BIZPLATLIST + "deleteRows", params);
};

export const getAllLists = (params: BaseTerminalGroup.Group) => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(BIZPLATLIST + "getList", params);
};
