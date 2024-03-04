import { sysDepartment } from "@/api/interface/system1/sysDepartment";
import { ResultData } from "@/api/interface";
import { ORGANIZATION, ORGANIZATIONS } from "@/api/config/servicePort";
import http from "@/api";

export const getTreeList = (params: sysDepartment.Department = {}) => {
  return http.post<ResultData<sysDepartment.TreeDepartment>>(ORGANIZATION + `/getTreeList`, params, { noLoading: true });
};
export const getOrganization = (params: sysDepartment.Department) => {
  return http.post<ResultData<sysDepartment.TreeDepartment>>(ORGANIZATIONS + `/getOrganizationTree`, params, { noLoading: true });
};

// 新增部门
export const addRow = (params: { id: string }) => {
  return http.post(ORGANIZATION + `/addRow`, params);
};

// 编辑部门
export const updateRow = (params: sysDepartment.Department) => {
  return http.post(ORGANIZATION + `/updateRow`, params);
};

// 删除部门
export const deleteRows = (params: { ids: string[] }) => {
  return http.post(ORGANIZATION + `/deleteRows`, params);
};

// 切换部门状态
export const changeDeptStatus = (params: { deptId: string; deptStatus: number }) => {
  return http.post(ORGANIZATION + `/changeDeptStatus`, params);
};

export class OrganizationHttp {
  static changeOrganizationStatus(params: { orgId: number; orgStatus: 0 | 1 }) {
    return http.post(ORGANIZATION + `/changeStatusById`, params);
  }

  static getOrgTreeList = (params: sysDepartment.Department = {}) => {
    return http.post<ResultData<sysDepartment.TreeDepartment>>(ORGANIZATION + `/getTreeList`, params, { noLoading: true });
  };
}
