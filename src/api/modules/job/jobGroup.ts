import { ResultData } from "@/api/interface";
import { BaseSite } from "@/api/interface/player/baseSite";
import axiosInstance from "@/api/axios";
import { JOBGROUP } from "@/api/config/servicePort";
export const getList = () => {
  return axiosInstance.post<ResultData<BaseSite.Site>>(JOBGROUP + "getList");
};
/**
 *
 * @param {pageNum: 1} params
 * @return {job[]} 返回任务调度的
 */
export interface job {
  addressList: any;
  addressType: number;
  appname: string;
  id: number;
  registryList: any;
  title: string;
  updateTime: string;
}
export const getListByGroup = (params: { pageNum: 1 }) => {
  return axiosInstance.post<ResultData<job[]>>(JOBGROUP + "pageList", params);
};

export const addRow = (params: BaseSite.Site) => {
  return axiosInstance.post(JOBGROUP + "save", params);
};

export const updateRow = (params: BaseSite.Site) => {
  return axiosInstance.post(JOBGROUP + "update", params);
};
/**
 * 删除工作组
 * @param params {id：string}
 */
export const deleteRows = (params: { id: string }) => {
  return axiosInstance.post(JOBGROUP + "remove", params);
};
export const loadById = (params: { id: string }) => {
  return axiosInstance.post(JOBGROUP + "loadById", params);
};
