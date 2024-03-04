export namespace sysEmployee {
  export interface ReqEmployee {
    pageNum: number;
    pageSize: number;
  }

  export interface employee {
    empId: bigint;

    empCode: string;

    empName: string;

    gender: number;

    helpCode: string;

    phone: string;

    email: string;

    avatar: string;

    orgId: bigint;

    deptId: bigint;

    empStatus: number;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }

  export interface changeStatusById {
    empId: number;
    empStatus: 1 | 0;
  }

  export interface checkName {
    name: string;
    empId: bigint | undefined;
  }
}
