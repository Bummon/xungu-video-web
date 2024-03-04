import http from "@/api";
import { ResultData } from "@/api/interface";
import { BaseTerminalGroup } from "@/api/interface/player/baseTerminalGroup";
import { GROUP } from "@/api/config/servicePort";

export const status = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
];

export const getListByPage = (params: BaseTerminalGroup.Group) => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(GROUP + "getListByPage", params);
};

export const addRow = (params: BaseTerminalGroup.Group) => {
  return http.post(GROUP + "addRow", params);
};

export const updateRow = (params: BaseTerminalGroup.Group) => {
  return http.post(GROUP + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(GROUP + "deleteRows", params);
};

export const getGroupList = () => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(GROUP + "getList");
};

export const changeStatusById = (params: BaseTerminalGroup.changeStatusById) => {
  return http.post(GROUP + "changeStatusById", params);
};
