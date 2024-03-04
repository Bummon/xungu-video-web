export namespace BaseRoom {
  /**
   *@description 会议室
   *@property {number | bigint}   areaId 区域ID
   *@property {number[] | bigint[]}   areaList  手动把父级跟子级区域的id组合成级联的样式
   * @property { string} location 位置
   * @property {number | bigint} centralId 中控ID
   */
  export interface Room {
    roomId: number;
    parentId: number;
    roomName: string;
    siteId: number;
    roomStatus: number;
    roomSort: number;
    roomDescr: string;
    deletedFlag: number;
    createTime: string;
    createUserId: number;
    createUserName: string;
    modifyTime: number;
    modifyUserId: number;
    modifyUserName: string;
    siteName: string;
    billStatus: number;
    areaId: number;
    location: string;
    areaList: any[];
    centralId: number;
  }

  export interface Option {
    roomName: string;
    roomId: number;
  }
}
