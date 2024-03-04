export namespace RoomType {
  /**
   * @property {string}           areaName          完整的路径名
   * @property {string}           ip                中控ID
   * @property {number}           terminalNum       设备数量
   * @property {number}           roomTypeId        会议室类型ID
   * @property {string}           roomTypeName      会议室类型
   * @property {0|1|2}            runningStatus     启用时0故障1在线 禁用时2离线
   * @property {any[]}            terminalVos       设备列表
   *
   */
  export interface Room {
    areaId: number;
    areaIdFirst: number; // 一级区域id
    parentId: number;
    capacity: number;
    createTime: string;
    createUserId: number;
    createUserName: string;
    deletedFlag: number;
    imageUrl: string;
    modifyTime: string;
    modifyUserId: number;
    modifyUserName: string;
    roomId: number;
    roomName: string;
    roomStatus: number;
    roomTypeId: number;
    roomTypeName: string;
    runningStatus: number;
    location: string; // 位置
    areaList: number[]; // 中转数据
    centralId: number; // 中控ID
    files: any[];
    terminalNum: number;
    terminalVos: any[];
  }

  export interface Option {
    roomName: string;
    roomId: number;
  }

  export interface changeStatusById {
    roomId: number;
    roomStatus: 1 | 0;
  }

  export interface DrawerProps {
    title: string;
    isView: boolean;
    row: Partial<Room>;
    api?: (params: any) => Promise<any>;
  }
}
