/**
 * 故障设备详情接口
 * @description 2023-07-31
 */
export namespace TaskDetailType {
  export interface taskDetail {
    alarmLevel: string; // 告警等级
    alarmName: string; //告警类型
    areaName: string; //位置	string
    createTime: string; //创建时间	string(date-time)
    createUserId: number | bigint; //创建人Id	integer(int64)
    createUserName: string; //创建人名称	string
    deletedFlag: 0 | 1; //是否删除 0未删除1已删除	integer(int32)
    dirDescr: string; //描述说明	string
    modifyTime: string; //修改时间	string(date-time)
    modifyUserId: number | bigint; //修改人Id	integer(int64)
    modifyUserName: string; //修改人名称	string
    orderId: number | bigint; //工单id	integer(int64)
    roomName: string; //会议室名称	string
    taskId: number | bigint; //计划任务id	integer(int64)
    terminalId: number | bigint; //设备id	integer(int64)
    terminalName: string; //设备名称	string
    typeId: number | bigint; //告警id	integer(int64)
    typeName: string; //资源类型	string
    msg: string; //消息内容	string
  }
}
