import http from "@/api";
import { ResPage } from "@/api/interface";
import { COMPONENT } from "@/api/config/servicePort";
import { BaseComponent } from "@/api/interface/player/baseComponent";

export const getListByPage = (params: BaseComponent.Component) => {
  return http.post<ResPage<BaseComponent.Component>>(COMPONENT + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: BaseComponent.Component) => {
  return http.post(COMPONENT + "addRow", params);
};

export const updateRow = (params: BaseComponent.Component) => {
  return http.post(COMPONENT + "updateRow", params);
};

export const deleteRows = (params: { id: string[] }) => {
  return http.post(COMPONENT + "deleteRows", params);
};

export const changeStatusById = (params: BaseComponent.changeStatusById) => {
  return http.post(COMPONENT + "changeStatusById", params);
};
