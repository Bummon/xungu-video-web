import http from "@/api";
import { ReqPage, ResPage } from "@/api/interface";
import { APPPARAM } from "@/api/config/servicePort";
import { sysAppParam } from "@/api/interface/system1/sysAppParam";

export interface reqAppParams extends ReqPage {
  appId: number;
  i?: number;
}

export const getListByPage = (params: reqAppParams) => {
  return http.post<ResPage<sysAppParam.appParam>>(APPPARAM + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: sysAppParam.appParam) => {
  return http.post(APPPARAM + "addRow", params);
};

export const updateRow = (params: sysAppParam.appParam) => {
  return http.post(APPPARAM + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(APPPARAM + "deleteRows", params);
};

export const changeStatusById = (params: sysAppParam.changeStatusById) => {
  return http.post(APPPARAM + "changeStatusById", params);
};
