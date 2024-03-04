import { ResultData } from "@/api/interface";
import { BaseSite } from "@/api/interface/player/baseSite";
import axiosInstance from "@/api/axios";
import { JOBINFO } from "@/api/config/servicePort";

export const getList = () => {
  return axiosInstance.post<ResultData<BaseSite.Site>>(JOBINFO + "getList", { noLoading: true });
};

export const getListByPage = (params: BaseSite.Site) => {
  return axiosInstance.post<ResultData<BaseSite.Site>>(JOBINFO + "pageList", params);
};

export const addRow = (params: BaseSite.Site) => {
  return axiosInstance.post(JOBINFO + "add", params);
};

export const updateRow = (params: BaseSite.Site) => {
  return axiosInstance.post(JOBINFO + "update", params);
};

export const deleteRows = (params: { id: string }) => {
  return axiosInstance.post(JOBINFO + "remove", params);
};
export const startRows = (params: { id: string }) => {
  return axiosInstance.post(JOBINFO + "start", params);
};
export const stopRows = (params: { id: string }) => {
  return axiosInstance.post(JOBINFO + "stop", params);
};

export const nextTriggerTime = (params: { id: string }) => {
  return axiosInstance.post(JOBINFO + "nextTriggerTime", params);
};
export const trigger = (params: { id: string }) => {
  return axiosInstance.post(JOBINFO + "trigger", params);
};
