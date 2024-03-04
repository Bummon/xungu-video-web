export namespace sysNotice {
  export interface ReqNotice {
    pageNum: number;
    pageSize: number;
  }

  export interface notice {
    noticeId: bigint;

    noticeContext: string;

    noticeType: number;

    noticeStatus: number;

    userId: bigint;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }
}
