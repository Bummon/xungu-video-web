export namespace sysLoginLog {
  export interface LoginLog {
    logId: number | bigint;
    loginUsername: string;
    ip: string;
    responseMsg: string;
    isSuccess: number;
    remark: string;
    loginTime: number;
  }

  export interface LoginLogQueryBo {
    logId: number | bigint;
    loginUsername: string;
    ip?: string;
    responseMsg?: string;
    isSuccess?: number;
    remark?: string;
    loginTime: number;
    startTime?: string;
    endTime?: string;
  }
}
