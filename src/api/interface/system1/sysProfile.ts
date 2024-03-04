export namespace sysProfile {
  export interface ReqProfile {
    pageNum: number;
    pageSize: number;
  }

  export interface profile {
    profileId: bigint;

    title: string;

    profileValue: string;

    defaultValue: string;

    profileSort: number;

    profileStatus: number;

    profileDescr: string;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;

    profileKey: string;
  }

  export interface changeStatusById {
    profileId: number;
    profileStatus: 1 | 0;
  }
}
