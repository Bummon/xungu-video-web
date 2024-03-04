import { sysRoles } from "@/api/interface/system1/sysRole";
import { ResPage } from "@/api/interface";
import http from "@/api";
import { ROLE } from "@/api/config/servicePort";
import { SysMenu } from "@/api/interface/system1/sysMenu";

export const getListByPage = (params: sysRoles.ReqRoles) => {
  return http.post<ResPage<sysRoles.SysRole>>(ROLE + "getListByPage", params, { noLoading: true });
};
export const getRoleListCustom = (params: sysRoles.ReqRoles) => {
  return http.post<ResPage<sysRoles.SysRole>>(ROLE + "getList", params, { noLoading: true });
};
export const addRow = (params: sysRoles.SysRole) => {
  return http.post(ROLE + "addRow", params);
};

export const updateRow = (params: sysRoles.SysRole) => {
  return http.post(ROLE + "updateRow", params);
};

export const deleteRows = (id: string) => {
  return http.post(ROLE + "deleteRows", id);
};

export const selectMenuByRoleId = params => {
  return http.post<SysMenu.TreeMenu[]>(ROLE + "selectMenuByRoleId", params);
};

export const roleBindMenu = (params: sysRoles.SysRole) => {
  return http.post(ROLE + "roleBindMenu", params);
};

export const changeStatusById = (params: sysRoles.changeStatusById) => {
  return http.post(ROLE + "changeStatusById", params);
};
