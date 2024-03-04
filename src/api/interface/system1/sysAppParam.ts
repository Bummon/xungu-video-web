export namespace sysAppParam {
  export interface ReqAppParam {
    pageNum: number;
    pageSize: number;
  }

  export interface appParam {
    paramId?: bigint;

    appId: bigint;

    paramGroup?: string;

    paramKey?: string;

    paramValue?: string;

    paramStatus?: number;

    paramSort?: bigint;

    paramDescr?: string;

    createTime?: number;

    createUserId?: bigint;

    createUserName?: string;

    modifyTime?: number;

    modifyUserId?: bigint;

    modifyUserName?: string;
  }

  export interface changeStatusById {
    paramId: number;
    paramStatus: 1 | 0;
  }
}
