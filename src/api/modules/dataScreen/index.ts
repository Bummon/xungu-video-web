import http from "@/api/index.ts";

const Url = "/control/screen/";
export namespace DataScreenType {
  export interface workList {
    addTotal: number;
    finishTotal: number;
    personTotal: number;
    repairTotal: number;
    systemTotal: number;
    total: number;
  }
}

/**
 * 数据大屏 HTTP接口
 * @description 工厂模式下的类 可以直接引用 不要实例化  可以以IOC形式创建
 * @author 党亚南
 */
export class DataScreenHttp {
  /**
   * 统计工单总数
   * @author 党亚南-20230809
   */
  static getOrderCountList(startTime: string, endTime: string) {
    return http.post<DataScreenType.workList[]>(Url + "getOrderCountList", { endTime, startTime }, { noLoading: true });
  }

  /**
     * 根据资源类型 统计设备总数 在线数量

     */
  static getTerminalCountListByType() {
    return http.post(Url + "getTerminalCountListByType", {}, { noLoading: true });
  }

  /**
   * 根据会议室类型查询会议室数量
   */
  static getMeetingRoomCountListByType() {
    return http.post(Url + "getMeetingRoomCountListByType", {}, { noLoading: true });
  }

  static getMeetingRoomCountList() {
    return http.post(Url + "getMeetingRoomCountList", {}, { noLoading: true });
  }

  /**
   * 获取告警详情列表
   */
  static getAlarmDetailListByType(startTime: string, endTime: string) {
    return http.post(Url + "getAlarmDetailListByType", { endTime: endTime, startTime: startTime }, { noLoading: true });
  }

  /**
   * 获取资源类型下的 告警统计数量
   */
  static getAlarmCountListByType(startTime: string, endTime: string) {
    return http.post(Url + "getAlarmCountListByType", { endTime: endTime, startTime: startTime }, { noLoading: true });
  }
}
