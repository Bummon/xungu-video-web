export namespace sysDbBackup {
  export interface ReqDbBackup {
    pageNum: number;
    pageSize: number;
  }

  export interface dbBackup {
    backupId: bigint;

    backupTitle: string;

    backupTime: string;

    backupFileName: string;

    backupFileSize: number;

    backupFileUrl: string;

    backupType: number;

    backupStatus: number;

    backupDescr: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }
}
