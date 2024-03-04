import { ResultData } from "@/api/interface";
import { BaseSite } from "@/api/interface/player/baseSite";
import http from "@/api";
import { SITE } from "@/api/config/servicePort";
export const getList = () => {
  return http.post<ResultData<BaseSite.Site>>(SITE + "getList", { noLoading: true });
};

export const getListByPage = (params: BaseSite.Site) => {
  return http.post<ResultData<BaseSite.Site>>(SITE + "getListByPage", params, { noLoading: true });
};

export const status = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
];

export const addRow = (params: BaseSite.Site) => {
  return http.post(SITE + "/addRow", params);
};

export const updateRow = (params: BaseSite.Site) => {
  return http.post(SITE + "/updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(SITE + "/deleteRows", params);
};

export const changeStatusById = (params: BaseSite.changeStatusById) => {
  return http.post(SITE + "changeStatusById", params);
};
