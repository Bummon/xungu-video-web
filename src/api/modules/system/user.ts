import type { ResPage, User } from "@/api/interface";
import http from "@/api";
import { DEPARTMENT, USER } from "@/api/config/servicePort";
import { sysRole } from "@/api/interface/system/sysRole";
import type { sysUser } from "@/api/interface/system/sysUser";
import { sysDept } from "@/api/interface/system/sysDept";

// 分页查询用户列表
export const getUserPage = (params: sysUser.User) => {
  return http.post<ResPage<User.ResUserList>>(USER + `/page`, params);
};

// 获取角色列表
export const getRoleList = (params: any = {}) => {
  return http.post<sysRole.SysRole>(USER + `/roleList`, params);
};

// 获取部门树
export const getDeptTree = (params: any = {}) => {
  return http.post<sysDept.DeptTree>(DEPARTMENT + `/tree`, params);
};

// 新增用户
export const addUser = (params: sysUser.User) => {
  return http.post(USER + `/add`, params);
};

// 修改用户
export const updateUser = (params: sysUser.User) => {
  return http.post(USER + `/edit`, params);
};

export const deleteUser = (params: number[] | bigint[]) => {
  return http.post(USER + `/remove`, params);
};

// 更改用户状态
export const changeUserStatus = (params: sysUser.User) => {
  return http.post(USER + `/changeStatus`, params);
};

export const resetPassword = (params: { id: number | bigint }) => {
  return http.post(USER + `/resetPassword`, params);
};
