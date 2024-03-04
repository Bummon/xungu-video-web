export namespace sysApp {
  export interface ReqApp {
    pageNum: number;
    pageSize: number;
  }

  export interface app {
    appId: bigint;

    appName: string;

    appIconUrl: string;

    appKey: string;

    appStatus: number;

    appSort: number;

    appDescr: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
    homeParam: string;
  }

  export interface changeStatusById {
    appId: number;
    appStatus: 1 | 0;
  }

  export interface Option {
    appId: number;
    appName: string;
    appKey: string;
  }
}
