/*
 ************************************   会议资源的接口   *************************************
 */
import { ReqPage } from "@/api/interface";
import { MeetSourceType } from "@/api/interface/source";

export namespace WorkOrder {
  /**
   * 工单
   * @property {string} orderCode    工单编号
   * @property {bigint} orderId 工单ID
   * @property {string} modifyTime 提交时间
   * @property {bigint} terminalId 设备Id
   * @property {string} alarmType    告警类型
   * @property {bigint} jobId    管理岗位
   * @property {string} alarmLevel    告警等级
   * @property {bigint} roomId  会议室id
   * @property {string} roomName  会议室名称
   * @property {0|1|2|3} orderStatus  工单状态0待接单1维修中2已完成3已关闭
   * @property {string} jobName  岗位名称
   * @property {string} orderDescr  说明
   * @property {string} terminalName  设备名称
   * @property {string} createUserName 报修人
   */
  export interface order {
    orderId: bigint;
    orderCode: string;
    terminalId: bigint;
    alarmTypeId: bigint;
    alarmTypeName: string;
    alarmLevel: string;
    jobId: bigint;
    orderStatus: 0 | 1 | 2 | 3;
    orderDescr: string;
    terminalName: string;
    roomName: string;
    createUserName: string;
    jobName: string;
    modifyTime: string;
    empName: string;
    empId: number;
    terminalList?: number[] | []; //数据中转使用
    roomId: number;
    createTime: string;
    orderFrom: 0 | 1;
  }

  export interface operationLog {
    logId: number;
    relationId: number;
    createUserName: string;
    createTime: string;
    logDescr: string;
  }

  export interface notice {
    noticeId: number;
    orderId: number;
    createUserName: string;
    createTime: string;
    content: string;
    noticeStatus: 0 | 1;
    noticeFrom: 0 | 1;
  }

  export interface alarmType {
    typeId: number;
    typeName: string;
    alarmLevel: string;
    createUserName: string;
    modifyTime: string;
  }

  export interface alarmTypeOptions {
    alarmTypeId: number;
    typeName: string;
    alarmLevel: string;
  }
}
