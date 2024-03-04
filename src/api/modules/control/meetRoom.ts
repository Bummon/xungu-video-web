// import { sysJob } from "@/api/interface/system/sysJob";
import { ReqPagePlus, ResPage, ResultData } from "@/api/interface";
import http from "@/api";
import { MEETROOM } from "@/api/config/servicePort";
import { RoomType } from "@/api/interface/control/MeetRoom";

export const status = [
  { label: "禁用", value: 0, tagType: "info" },
  { label: "启用", value: 1, tagType: "success" }
];

/**
 * 会议室相关的接口
 */
export class RoomHttp {
  /**
   * 分页查询
   * @param params
   */
  static getListByPage(params: ReqPagePlus) {
    return http.post<ResPage<RoomType.Room[]>>(MEETROOM + "getListByPage", params);
  }

  /**
   * 不分页 全部查询
   */
  static getList(params = {}) {
    return http.post<RoomType.Room[]>(MEETROOM + "getList", params, { noLoading: true });
  }

  static addRow(params: Partial<RoomType.Room>) {
    return http.post(MEETROOM + "addRow", params);
  }

  static updateRow(params: Partial<RoomType.Room>) {
    return http.post(MEETROOM + "updateRow", params);
  }

  static deleteRows(id: string) {
    return http.post(MEETROOM + "deleteRows", id);
  }

  static changeRoomStatus(params: RoomType.changeStatusById) {
    return http.post<ResultData<any>>(MEETROOM + "/changeStatusById", params, { noLoading: true });
  }

  static getRoomDetailById(id: bigint | number) {
    return http.post<ResultData<any>>(MEETROOM + "/getDetailById", { id: id }, { noLoading: true });
  }

  static getCountRoomsByArea() {
    return http.post<ResultData<any>>(MEETROOM + "/countMeetingRoomsBySubRegion", {}, { noLoading: true });
  }

  /**
   * 统计会议室下资源类型数量
   * @param params
   */
  static getCountRoomsBySourceType(params: { roomId: number } | {} = {}) {
    return http.post<ResultData<any>>(MEETROOM + "/resourceTypeStatistics", params, { noLoading: true });
  }

  /**
   * 统计会议室的工单
   */
  static getCountRoomsByWorkOrder() {
    return http.post<ResultData<any>>(MEETROOM + "/workOrderStatistics", {}, { noLoading: true });
  }

  /**
   * 获取会议室使用率前三
   */
  static getTopThree(params: { end: string; start: string }) {
    return http.post<ResultData<any>>(MEETROOM + "/getTopThree", params, { noLoading: true });
  }

  /**
   * 获得环境检测数据
   */

  static getEnvironmentDetail(params: { id: number }) {
    return http.post<ResultData<any>>("/control/controlEnvironment/getDetailById", params, { noLoading: true });
  }

  /**
   * 获得按预约次数排名的会议室列表
   */

  static getBookCount(params: { start: string; end: string }) {
    return http.post<ResultData<any>>("/control/controlMeetingRoom/getBookCount", params, { noLoading: true });
  }
}

/**
 * @name 会议室模块
 */
export namespace sysApp {
  export interface ReqApp {
    pageNum: number;
    pageSize: number;
  }

  export interface meeting {
    areaId: number;
    capacity: number;
    createTime: string;
    createUserId: number;
    createUserName: string;
    deletedFlag: number;
    imageUrl: string;
    location: string;
    modifyTime: string;
    modifyUserId: number;
    modifyUserName: string;
    roomId: number;
    roomName: string;
    roomStatus: number;
    roomType: string;
    runningStatus: number;
  }
}
