// 这是关于播放清单的一些数据类

export namespace PlanMedia {
  // 计划清单的行数据
  export interface PlanMediaRowData {
    billCopyCount: number;
    billDescr: null | string;
    billId: bigint;
    billItemCount: number;
    billItemDuration: number;
    billItemStep: number;
    billNo: string;
    billSort: number;
    billStatus: number;
    billTimeOff: string;
    billTimeOn: string;
    billTitle: string;
    billType: number;
    createUserId: bigint;
    createUserName: string;
    deptId: bigint;
    mediaItemList: any[];
    orgId: bigint;
    playList: null | any[];
    terminalList: null | any[];
  }
  export interface PlanMediaRow {
    createTime: string; //创建时间
    createUserId: bigint; //创建者ID
    createUserName: string; //创建者名字
    deletedFlag: 0 | 1; //是否删除
    dirId: bigint;
    libDescr: null | string;
    libExt: string;
    libFilename: string;
    libFilesize: bigint;
    libIco: null | string;
    libId: bigint;
    libName: string;
    libSort: number;
    libSpecs: null;
    libStatus: number;
    libType: number;
    libUrl: string;
    modifyTime: string; //最后修改时间
    modifyUserId: null | bigint; //最后修改人的ID
    modifyUserName: null | string; // 最后修改人的名字
  }
}
