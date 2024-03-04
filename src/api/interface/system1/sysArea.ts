export namespace sysArea {
  export interface ReqArea {
    pageNum: number;
    pageSize: number;
  }

  export interface area {
    areaId: bigint;

    parentId: bigint;

    areaName: string;

    areaType: number;

    fullName: string;

    helpCode: string;

    areaSort: number;

    areaCode: string;

    zipCode: string;

    mapBarName: string;

    lng: number;

    lat: number;

    areaLevel: number;

    areaStatus: number;

    areaDescr: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }

  export interface TreeArea {
    areaId: bigint;

    parentId: bigint;

    areaName: string;

    areaType: number;

    fullName: string;

    helpCode: string;

    areaSort: number;

    areaCode: string;

    zipCode: string;

    mapBarName: string;

    lng: number;

    lat: number;

    areaLevel: number;

    areaStatus: number;

    areaDescr: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;

    //菜单子集
    children: area[];
  }
}
