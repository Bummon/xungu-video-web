export namespace sysOperationLog {
  export interface OperationLog {
    operId: number | bigint;
    moduleName: string;
    operationName: string;
    ip: string;
    type: number;
    isSuccess: number;
    requestType: string;
    requestUri: string;
    methodName: string;
    requestJson: string;
    responseJson: string;
    remark?: string;
    createUserId?: number | bigint;
    createUsername?: string;
    createTime?: string[];
  }

  export interface OperationLogQuery extends OperationLog {
    startTime: string;
    endTime: string;
  }
}
