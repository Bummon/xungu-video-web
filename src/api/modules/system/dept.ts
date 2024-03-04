import { sysDept } from "@/api/interface/system/sysDept";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { DEPARTMENT } from "@/api/config/servicePort";

export const getDeptPage = (params: sysDept.Dept) => {
  return http.post<ResPage<sysDept.Dept>>(DEPARTMENT + `/page`, params);
};

export const getDeptList = (params: sysDept.Dept) => {
  return http.post<sysDept.Dept[]>(DEPARTMENT + `/list`, params);
};

export const getDeptTree = (params: any = {}) => {
  return http.post(DEPARTMENT + `/tree`, params);
};
