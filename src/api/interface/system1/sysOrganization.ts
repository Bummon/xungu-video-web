export namespace SysOrganization {
  export interface ReqOrganization {
    pageNum: number;
    pageSize: number;
  }

  export interface organization {
    orgId: bigint;

    orgCode: string;

    parentId: bigint;

    orgName: string;

    fullName: string;

    helpCode: string;

    orgType: number;

    orgSort: number;

    orgStatus: number;

    orgDescr: string;

    city: string;

    address: string;

    linkMan: string;

    linkPhone: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }

  export interface Treeorganization {
    orgId: bigint;

    orgCode: string;

    parentId: bigint;

    orgName: string;

    fullName: string;

    helpCode: string;

    orgType: number;

    orgSort: number;

    orgStatus: number;

    orgDescr: string;

    city: string;

    address: string;

    linkMan: string;

    linkPhone: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
    //菜单子集
    children: organization[];
  }
}
