export namespace sysDict {
  export interface ReqDict {
    pageNum: number;
    pageSize: number;
  }

  export interface dict {
    dictId: bigint;

    parentId: bigint;

    dictName: string;

    dataType: string;

    dataCode: string;

    dataValue: string;

    isDefault: number;

    dictStatus: number;

    orderNum: number;

    dictDescr: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }

  export interface changeStatusById {
    dictId: bigint;
    dictStatus: 1 | 0;
  }
}
