import { sysJob } from "@/api/interface/system1/sysJob";
import { ResPage } from "@/api/interface";
import http from "@/api";
import { JOB } from "@/api/config/servicePort";

/**
 * 岗位分页查询
 * @param params
 */
export const getListByPage = (params: sysJob.job) => {
  return http.post<ResPage<sysJob.job>>(JOB + "getListByPage", params, { noLoading: true });
};
export const getList = () => {
  return http.post<sysJob.job[]>(JOB + "getList", {}, { noLoading: true });
};

export const addRow = (params: sysJob.job) => {
  return http.post(JOB + "addRow", params);
};

export const updateRow = (params: sysJob.job) => {
  return http.post(JOB + "updateRow", params);
};

export const deleteRows = (params: { ids: number[] }) => {
  return http.post(JOB + "deleteRows", params);
};

export const changeStatusById = (params: sysJob.changeStatusById) => {
  return http.post(JOB + "changeStatusById", params);
};
