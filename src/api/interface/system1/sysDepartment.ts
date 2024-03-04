export namespace sysDepartment {
  export interface Department {
    deptId: number;

    deptCode: string;

    parentId: number;

    deptName: string;

    helpCode: string;

    deptType: number;

    deptSort: number;

    deptStatus: number;

    linkMan: string;

    linkPhone: string;

    deptDescr: string;

    orgId: number;

    deletedFlag: number;

    createTime: number;

    createUserId: number;

    createUserName: string;

    modifyTime: number;

    modifyUserId: number;

    modifyUserName: string;
  }

  export interface TreeDepartment {
    deptId: number;

    deptCode: string;

    parentId: number;

    deptName: string;

    helpCode: string;

    deptType: number;

    deptSort: number;

    deptStatus: number;

    linkMan: string;

    linkPhone: string;

    deptDescr: string;

    orgId: number;

    deletedFlag: number;

    createTime: number;

    createUserId: number;

    createUserName: string;

    modifyTime: number;

    modifyUserId: number;

    modifyUserName: string;
    //菜单子集
    children: Department[];
  }
}
