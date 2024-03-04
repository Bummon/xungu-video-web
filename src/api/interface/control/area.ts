/**
 * @name 区域
 */
export namespace AreaType {
  export interface area {
    areaDescr: string;
    areaId: number;
    areaName: string;
    areaStatus: number;
    createTime: string;
    createUserId: number;
    createUserName: string;
    deletedFlag: number;
    modifyTime: string;
    modifyUserId: number;
    modifyUserName: string;
    parentId: number | bigint;
    files: file[];
  }

  export interface file {
    fileExt: string;
    fileName: string;
    fileSize: string;
    fileUrl: string;
  }
}
