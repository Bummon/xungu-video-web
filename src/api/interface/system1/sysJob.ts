export namespace sysJob {
  export interface ReqJob {
    pageNum: number;
    pageSize: number;
  }

  export interface job {
    jobId: number;

    jobName: string;

    jobGroup: string;

    jobStatus: number;

    jobSort: number;

    jobDescr: string;

    deletedFlag: number;

    createTime: number;

    createUserId: number;

    createUserName: string;

    modifyTime: number;

    modifyUserId: number;

    modifyUserName: string;
  }

  export interface changeStatusById {
    jobId: number;
    jobStatus: 1 | 0;
  }
}
