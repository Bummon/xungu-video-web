export namespace SysExceptionLog {
  export interface ExceptionLog {
    exceptionId: number | bigint;
    moduleName: string;
    operationName: string;
    ip: string;
    type: number;
    isSuccess: number;
    requestType: string;
    requestUri: string;
    methodName: string;
    requestJson: string;
    exceptionMsg: string;
    createUserId?: number | bigint;
    createUsername?: string;
    createTime?: string;
  }
}
