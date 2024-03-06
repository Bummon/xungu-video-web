export namespace sysDept {
  export interface Dept {
    deptId: bigint;
    deptName: string;
    deptCode: string;
    parentId: bigint;
    deptLeader: string;
    deptPhone: string;
    deptSort: number;
    enabled: number;
    remark: string;
    createUserId: bigint;
    createUsername: string;
    createTime: number;
    modifyUserId: bigint;
    modifyUsername: string;
    modifyTime: number;
  }

  export interface DeptTree {
    deptId: bigint;
    deptName: string;
    deptCode: string;
    parentId: bigint;
    deptLeader: string;
    deptPhone: string;
    deptSort: number;
    enabled: number;
    remark: string;
    createUserId: bigint;
    createUsername: string;
    createTime: number;
    modifyUserId: bigint;
    modifyUsername: string;
    modifyTime: number;
    children: DeptTree[];
  }
}
