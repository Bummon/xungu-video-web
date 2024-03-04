export namespace SceneType {
  /**
   * @property {number}           scenarioId        场景ID
   * @property {0|1}            deletedFlag       是否删除
   * @property {string}            scenarioName      场景名称
   * @property {string}          terminalDescr      会议室类型
   *
   */
  export interface Scene {
    commandNumber: number; // 命令编号		false      integer(int64)
    createTime: string; // 创建时间		false      string(date-time)
    createUserId: number; // 创建人Id		false      integer(int64)
    createUserName: string; // 创建人名称		false      string
    deletedFlag: 0 | 1; // 删除标记 0未删1已删		false      integer(int32)
    modifyTime: string; // 修改时间		false      string(date-time)
    modifyUserId: number; // 修改人Id		false      integer(int64)
    modifyUserName: string; // 修改人名称		false      string
    roomId: number; // 会议室id		false       integer(int64)
    scenarioId: number; // 主键id		false       integer(int64)
    scenarioName: string; // 场景名称		false      string
    terminalDescr: string; // 说明		false string
  }

  export interface ScenePlan {
    createTime: string; //	创建时间		false      string(date-time)
    createUserId: number; //创建人Id		false      integer(int64)
    createUserName: string; //	创建人名称		false      string
    cron: string; //执行公式	false      string
    deletedFlag: 0 | 1; //删除标记 0未删1已删		false      integer(int32)
    equipmentDescr: string; //定时任务参数		false      string
    executionType: 1 | 2; //	1立即执行 2按公式执行		false       integer(int32)
    modifyTime: string; //修改时间		false      string(date-time)
    modifyUserId: number; //	修改人Id		false      integer(int64)
    modifyUserName: string; //修改人名称		false      string
    planId: number; //	主键id		false      integer(int64)
    planName: string; //计划名称		false      string
    roomId: number; //会议室id		false      integer(int64)
    scenarioId: number; //场景id		false      integer(int64)
    status: 1 | 2 | 3; //1未开始 2进行中 3已结束		false      integer(int32)
    terminalDescr: string; //说明		false      string
    xxlJobId: number; //定时任务id		false integer(int64)
    startTime: string;
    endTime: string;
  }
}
