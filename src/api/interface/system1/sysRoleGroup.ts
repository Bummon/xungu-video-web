export namespace sysRoleGroup {
  export interface ReqRoleGroup {
    pageNum: number;
    pageSize: number;
  }

  export interface roleGroup {
    groupId: bigint;

    groupName: string;

    groupStatus: number;

    groupSort: number;

    groupDescr: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }
}
