export namespace sysAppVersion {
  export interface ReqAppVersion {
    pageNum: number;
    pageSize: number;
  }

  export interface appVersion {
    versionId: bigint;

    versionNum: string;

    major: number;

    minor: number;

    revise: number;

    attach: string;

    title: string;

    fileName: string;

    context: string;

    fileSize: number;

    isMust: number;

    versionUrl: string;

    versionType: number;

    versionStatus: number;

    versionDescr: string;

    appId: bigint;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }

  export interface changeStatusById {
    versionId: bigint;
    versionStatus: 1 | 0;
  }
}
