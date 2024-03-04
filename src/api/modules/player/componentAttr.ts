import http from "@/api";
import { ResPage } from "@/api/interface";
import { COMPONENTATTR } from "@/api/config/servicePort";
import { BaseComponentAttr } from "@/api/interface/player/baseComponentAttr";

export const getListByPage = (params: BaseComponentAttr.ComponentAttr) => {
  return http.post<ResPage<BaseComponentAttr.ComponentAttr>>(COMPONENTATTR + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: BaseComponentAttr.ComponentAttr) => {
  return http.post(COMPONENTATTR + "addRow", params);
};

export const updateRow = (params: BaseComponentAttr.ComponentAttr) => {
  return http.post(COMPONENTATTR + "updateRow", params);
};

export const deleteRows = (params: { id: string[] }) => {
  return http.post(COMPONENTATTR + "deleteRows", params);
};

export const changeStatusById = (params: BaseComponentAttr.changeStatusById) => {
  return http.post(COMPONENTATTR + "changeStatusById", params);
};
