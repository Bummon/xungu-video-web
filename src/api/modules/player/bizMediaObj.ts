import http from "@/api";
import { ResultData } from "@/api/interface";
import { BaseTerminalGroup } from "@/api/interface/player/baseTerminalGroup";
import { MEDIAOBJ } from "@/api/config/servicePort";

export const getListByPage = (params: BaseTerminalGroup.Group) => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(MEDIAOBJ + "getListByPage", params);
};

export const addRow = (params: BaseTerminalGroup.Group) => {
  return http.post(MEDIAOBJ + "addRow", params);
};

export const updateRow = (params: BaseTerminalGroup.Group) => {
  return http.post(MEDIAOBJ + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(MEDIAOBJ + "deleteRows", params);
};

export const getAllLists = (params: BaseTerminalGroup.Group) => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(MEDIAOBJ + "getList", params);
};
