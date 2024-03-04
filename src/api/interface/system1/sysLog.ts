export namespace sysLog {
  export interface ReqLog {
    pageNum: number;
    pageSize: number;
  }

  export interface log {
    logId: bigint;

    title: string;

    logIp: string;

    logIpInfo: string;

    userName: string;

    requestMethod: string;

    requestParam: string;

    requestUrl: string;

    requestCostTime: number;

    logType: number;

    logStatus: number;

    context: string;

    appId: bigint;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }
}
