import { ResultData } from "@/api/interface";
import { BaseSite } from "@/api/interface/player/baseSite";
import axiosInstance from "@/api/axios";
import { JOBLOG } from "@/api/config/servicePort";

export const getListByPage = (params: BaseSite.Site) => {
  return axiosInstance.post<ResultData<BaseSite.Site>>(JOBLOG + "pageList", params, { noLoading: true });
};
export const getJobsByGroup = (params: BaseSite.Site) => {
  return axiosInstance.post<ResultData<BaseSite.Site>>(JOBLOG + "getJobsByGroup", params, { noLoading: true });
};
