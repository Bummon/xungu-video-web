export namespace sysUserRole {
  export interface ReqUserRole {
    pageNum: number;
    pageSize: number;
  }

  export interface UserRole {
    userId: bigint;
    roleId: bigint;
  }
}
