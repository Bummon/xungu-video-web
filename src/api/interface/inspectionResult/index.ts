/**
 * 巡检数据接口
 * @description 2023-07-31
 */
export namespace InspectionResultType {
  /**
   *
   *@property {string}            createTime      创建时间
   *@property {number | bigint}   createUserId    创建人Id
   *@property {string}            createUserName  创建人名称
   *@property {string}            modifyTime      修改时间
   *@property {number | bigint}   modifyUserId    修改人Id
   *@property {string}            modifyUserName  修改人名称
   *@property {number | bigint}   inspectionId    巡检ID
   *@property {number}            number          设备数量
   *@property {number}            faultNumber     故障数量
   *@property {number | bigint}   taskId          主键id
   *@property {number | bigint}   orderId         工单id
   *
   */
  export interface inspectionResult {
    createTime: string;
    createUserId: number | bigint; //创建人Id
    createUserName: string; //创建人名称
    modifyTime: string; //修改时间
    modifyUserId: number | bigint; //修改人Id
    modifyUserName: string; //修改人名称
    faultNumber: number; //	故障数量
    inspectionId: bigint | number; //	巡检id
    number: number; //	设备数量
    orderId: bigint | number; //	工单id
    taskId: bigint | number; //	主键id
  }
}
