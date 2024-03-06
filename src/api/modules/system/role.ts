import http from "@/api";
import { MENU, ROLE } from "@/api/config/servicePort";
import { sysRole } from "@/api/interface/system/sysRole";
import { ResPage } from "@/api/interface";
import { sysMenu } from "@/api/interface/system/sysMenu";

export const getRoleInfo = (roleId: number | bigint) => {
  return http.post<sysRole.Role>(ROLE + `/info`, { id: roleId });
};

export const getRoleList = (params: sysRole.Role) => {
  return http.post<sysRole.Role[]>(ROLE + `/list`, params);
};

export const getRolePage = (params: sysRole.Role) => {
  return http.post<ResPage<sysRole.Role[]>>(ROLE + `/page`, params);
};

export const addRole = (params: sysRole.Role) => {
  return http.post(ROLE + `/add`, params);
};

export const updateRole = (params: sysRole.Role) => {
  return http.post(ROLE + `/edit`, params);
};

export const deleteRole = (roleIds: number[] | bigint[]) => {
  return http.post(ROLE + `/remove`, { ids: roleIds });
};

export const assignRoleMenu = (params: { roleId: number | bigint; menuIdList: number[] | bigint[] }) => {
  return http.post(ROLE + `/assignMenu`, params);
};

export const changeRoleStatus = (params: sysRole.Role) => {
  return http.post(ROLE + `/changeStatus`, params);
};

// 根据角色ID获取菜单列表
export const getMenuByRoleId = (roleId: number | bigint) => {
  return http.post<sysMenu.Menu>(MENU + `/role`, { id: roleId });
};
