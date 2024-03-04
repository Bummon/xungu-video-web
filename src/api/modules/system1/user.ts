import { ResPage, User } from "@/api/interface";
import { USER } from "@/api/config/servicePort";
import http from "@/api";
import { sysRoles } from "@/api/interface/system1/sysRole";
import { SysUser } from "@/api/interface/system1/sysUser";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(USER + `/getListByPage`, params);
};

// 获取树形用户列表
// export const getUserTreeList = (params: User.ReqUserParams) => {
//   return http.post<ResPage<User.ResUserList>>(USER + `/user/tree/list`, params);
// };

// 获取角色列表
export const getRoleList = params => {
  return http.post<sysRoles.SysRole[]>(USER + `/getRoleList`, params);
};

// 新增用户
export const addRow = (params: { id: string }) => {
  return http.post(USER + `/addRow`, params);
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(USER + `/import`, params);
};

// 编辑用户
export const updateRow = (params: User.ResUserList) => {
  return http.post(USER + `/updateRow`, params);
};

// 删除用户
export const deleteRows = (params: { ids: string[] }) => {
  return http.post(USER + `/deleteRows`, params);
};

// 根据用户ID查询用户详情
export const getUserDetail = (params: { id: string[] }) => {
  return http.post(USER + `/getDetailById`, params);
};

// 切换用户状态
export const changeUserStatus = (params: { userId: string; userStatus: number }) => {
  return http.post(USER + `/changeStatus`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(USER + `/adminResetPassword`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(USER + `/export`, params);
};

// 获取导入模板
export const importTemplate = (params: User.ReqUserParams) => {
  return http.download(USER + `/importTemplate`, params);
};
//
// // 获取用户角色字典
// export const getUserRole = () => {
//   return http.get<User.ResRole[]>(PORT1 + `/user/role`);
// };

export const checkName = (params: SysUser.checkName) => {
  return http.post(USER + "/checkName", params);
};

/**
 * 用户类 Http
 */
export class UserHttp {
  /**
   * 查用户详情信息
   */
  static getDetailById(id: number | bigint) {
    return http.post<SysUser.User>(USER + "/getDetailById", { id });
  }

  /**
   * 更新用户密码
   * @param {string}          loginPassword
   * @param {string }         newPassword
   * @param {bigint | number} userId
   */
  static updatePassword(params: { loginPassword: string; newPassword: string; userId: bigint | number }) {
    return http.post(USER + "/updatePassword", params);
  }

  /**
   * 增加关注的会议室
   */
  static addVIPRoom(params: { roomId: number; userId: number }) {
    return http.post("/control/controlUserMeetingRoom/addRow", params);
  }

  /**
   * 删除关注会议室
   */
  static deleteVIPRoom(params: { roomId: number; userId: number }) {
    return http.post("/control/controlUserMeetingRoom/deleteRowById", params);
  }

  /**
   * 更新头像
   * @param params
   */
  static updateAvatar(params: FormData) {
    return http.post("/system/sysUser/updateAvatar", params);
  }
}
