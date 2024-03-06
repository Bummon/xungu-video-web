import type { ResPage, User } from "@/api/interface";
import http from "@/api";
import { USER } from "@/api/config/servicePort";
import { sysRole } from "@/api/interface/system/sysRole";
import type { sysUser } from "@/api/interface/system/sysUser";

// 分页查询用户列表
export const getUserPage = (params: sysUser.User) => {
  return http.post<ResPage<User.ResUserList>>(USER + `/page`, params);
};

// 获取用户详情
export const getUserInfo = (userId: number | bigint) => {
  return http.post<sysUser.User>(USER + `/info`, { id: userId });
};

// 获取角色列表
export const getRoleList = (params: any = {}) => {
  return http.post<sysRole.Role[]>(USER + `/roleList`, params);
};

// 新增用户
export const addUser = (params: sysUser.User) => {
  return http.post(USER + `/add`, params);
};

// 修改用户
export const updateUser = (params: sysUser.User) => {
  return http.post(USER + `/edit`, params);
};

export const deleteUser = (userIds: number[] | bigint[]) => {
  return http.post(USER + `/remove`, { ids: userIds });
};

// 更改用户状态
export const changeUserStatus = (params: sysUser.User) => {
  return http.post(USER + `/changeStatus`, params);
};

export const resetPassword = (userId: number | bigint) => {
  return http.post(USER + `/resetPassword`, { id: userId });
};
