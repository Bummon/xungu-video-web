/**
 * @name 巡检数据接口
 * @description 2023-07-31
 */
export namespace InspectionType {
  /**
   *
   *@property {string} createTime 创建时间
   *@property {number | bigint}  createUserId 创建人Id
   *@property {string}  createUserName 创建人名称
   *@property {string}  cron 执行公式
   *@property {0 | 1}  deletedFlag 是否删除 0未删除1已删除
   *@property {string}  equipmentDescr 描述
   *@property {1 | 2}  executionType 1立即执行 2按公式执行
   *@property {number | bigint}  inspectionId
   *@property {string}  inspectionName 计划名称
   *@property {string}  modifyTime 修改时间
   *@property {number | bigint}  modifyUserId 修改人Id
   *@property {string}  modifyUserName 修改人名称
   *@property {number | bigint}  roomIds 会议室id
   *@property {string}  typeIds 资源类型id
   *@property {number | bigint}  xxlJobId 定时任务id
   */
  export interface inspection {
    createTime: string;
    createUserId: number | bigint; //创建人Id	integer(int64)
    createUserName: string; //创建人名称	string
    cron: string; //执行公式	string
    deletedFlag: 0 | 1; //是否删除 0未删除1已删除	integer(int32)
    equipmentDescr: string; //描述	string
    executionType: 1 | 2; //1立即执行 2按公式执行	integer(int32)
    inspectionId: number | bigint; //主键id	integer(int64)
    inspectionName: string; //计划名称	string
    inspectionStatus: 0 | 1; // 计划启用状态  0未启用 1启用
    modifyTime: string; //修改时间	string(date-time)
    modifyUserId: number | bigint; //修改人Id	integer(int64)
    modifyUserName: string; //修改人名称	string
    parentIds: string;
    areaIds: string;
    roomIds: string; //会议室id集合	string
    typeIds: string; //资源类型id集合	string
    xxlJobId: number | bigint; //定时任务id	integer(int64)
    roomList?: bigint[] | number[]; //中转用数据
    typeIdList?: bigint[] | number[]; //中转用数据
  }
}
