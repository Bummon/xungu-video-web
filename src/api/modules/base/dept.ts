import { sysDept } from "@/api/interface/base/sysDept";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { DEPARTMENT } from "@/api/config/servicePort";

export const getDeptInfo = (deptId: number | bigint) => {
  return http.post<sysDept.Dept>(DEPARTMENT + `/info`, { id: deptId });
};

export const getDeptPage = (params: sysDept.Dept) => {
  return http.post<ResPage<sysDept.Dept>>(DEPARTMENT + `/page`, params);
};

export const getDeptList = (params: sysDept.Dept) => {
  return http.post<sysDept.Dept[]>(DEPARTMENT + `/list`, params);
};

export const getDeptTree = (params: any = {}) => {
  return http.post<sysDept.DeptTree>(DEPARTMENT + `/tree`, params);
};

export const addDept = (params: sysDept.Dept) => {
  return http.post(DEPARTMENT + `/add`, params);
};

export const updateDept = (params: sysDept.Dept) => {
  return http.post(DEPARTMENT + `/edit`, params);
};

export const deleteDept = (deptIds: number[] | bigint[]) => {
  return http.post(DEPARTMENT + `/remove`, { ids: deptIds });
};

export const changeDeptStatus = (params: sysDept.Dept) => {
  return http.post(DEPARTMENT + `changeStatus`, params);
};
