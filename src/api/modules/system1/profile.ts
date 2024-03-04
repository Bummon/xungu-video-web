import http from "@/api";
import { ResultData } from "@/api/interface";
import { sysProfile } from "@/api/interface/system1/sysProfile";
import { PROFILE } from "@/api/config/servicePort";

export const getListByPage = (params: sysProfile.profile) => {
  return http.post<ResultData<sysProfile.profile>>(PROFILE + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: sysProfile.profile) => {
  return http.post(PROFILE + "addRow", params);
};

export const updateRow = (params: sysProfile.profile) => {
  return http.post(PROFILE + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(PROFILE + "deleteRows", params);
};

export const changeStatusById = (params: sysProfile.changeStatusById) => {
  return http.post(PROFILE + "changeStatusById", params);
};
