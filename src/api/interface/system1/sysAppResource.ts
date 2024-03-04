export namespace sysAppResource {
  export interface ReqAppResource {
    pageNum: number;
    pageSize: number;
  }

  export interface appResource {
    resourceId: bigint;

    resourceVersion: string;

    resourceAttach: string;

    resourceTitle: string;

    fileUrl: string;

    fileDir: string;

    fileIsMust: number;

    resourceType: number;

    resourceStatus: number;

    resourceDescr: string;

    fileName: string;

    fileSize: number;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }
}
