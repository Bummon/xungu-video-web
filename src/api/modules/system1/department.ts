import { sysDepartment } from "@/api/interface/system1/sysDepartment";
import { ResultData } from "@/api/interface";
import { DEPARTMENT, DEPARTMENTS } from "@/api/config/servicePort";
import http from "@/api";

export const getTreeList = (params: sysDepartment.Department) => {
  return http.post<ResultData<sysDepartment.TreeDepartment>>(DEPARTMENT + `/getTreeList`, params, { noLoading: true });
};

export const getDepartmentTree = (params: sysDepartment.Department) => {
  return http.post<ResultData<sysDepartment.TreeDepartment>>(DEPARTMENTS + `/getDepartmentTree`, params, { noLoading: true });
};

// 新增部门
export const addRow = (params: Partial<sysDepartment.Department>) => {
  return http.post(DEPARTMENT + `/addRow`, params);
};

// 编辑部门
export const updateRow = (params: sysDepartment.Department) => {
  return http.post(DEPARTMENT + `/updateRow`, params);
};

// 删除部门
export const deleteRows = (params: { ids: string[] }) => {
  return http.post(DEPARTMENT + `/deleteRows`, params);
};

// 切换部门状态
export const changeDeptStatus = (params: { deptId: string; deptStatus: number }) => {
  return http.post(DEPARTMENT + `/changeDeptStatus`, params);
};
