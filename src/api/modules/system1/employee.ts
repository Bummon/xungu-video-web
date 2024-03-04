import http from "@/api";
import { ResPage } from "@/api/interface";
import { COMMON, EMPLOYEE } from "@/api/config/servicePort";
import { sysEmployee } from "@/api/interface/system1/sysEmployee";
import { SysOrganization } from "@/api/interface/system1/sysOrganization";
import { sysDepartment } from "@/api/interface/system1/sysDepartment";

export const getListByPage = (params: sysEmployee.employee) => {
  return http.post<ResPage<sysEmployee.employee>>(EMPLOYEE + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: sysEmployee.employee) => {
  return http.post(EMPLOYEE + "addRow", params);
};

export const updateRow = (params: sysEmployee.employee) => {
  return http.post(EMPLOYEE + "updateRow", params);
};

export const deleteRows = (params: { id: string[] }) => {
  return http.post(EMPLOYEE + "deleteRows", params);
};

export const changeStatusById = (params: sysEmployee.employee) => {
  return http.post(EMPLOYEE + "changeStatusById", params);
};

// 获取组织列表
export const getOrgList = () => {
  return http.post<SysOrganization.organization[]>(COMMON + `getOrganization`);
};

/**
 * 获取部门列表 树型结构
 * @param { orgId: number | bigint } params  可以根据组织id来查询  不传则是全部查询
 */
export const getDeptsList = (params: { orgId: number | bigint } = {}) => {
  return http.post<sysDepartment.Department[]>(COMMON + `getDepartmentTree`, params, { noLoading: true });
};

export const checkName = (params: any) => {
  return http.post(EMPLOYEE + "checkName", params);
};
