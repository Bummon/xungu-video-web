export namespace sysUser {
  export interface User {
    userId: bigint;
    userAccount: string;
    password: string;
    nickname: string;
    email?: string;
    phone: string;
    deptId: bigint;
    deptName: string;
    gender: number;
    avatar?: string;
    type: number;
    enabled: number;
    sort: number;
    defaultType: number;
    remark?: string;
    createUserId?: bigint;
    createUsername?: string;
    createTime?: string;
    modifyUserId?: bigint;
    modifyUsername?: string;
    modifyTime?: string;
    roleId: bigint;
  }
}
