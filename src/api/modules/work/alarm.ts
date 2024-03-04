import http from "@/api";
import { ReqPage, ReqPagePlus, ResPage, ResultData } from "@/api/interface";
import { WorkOrder } from "@/api/interface/work";

const ReqAlarmUrl = "/control/controlOrderAlarmType";

/**
 * 工单告警类型的接口
 */
export class AlarmHttp {
  /**
   * 获取告警类型分页
   * @author 党亚南-20230719
   * @param {ReqPage} params 获取告警类型分页列表
   * @return {ResultData<WorkOrder.alarmType[]>>}
   */
  static getAlarmList(params: ReqPagePlus) {
    return http.post<ResultData<WorkOrder.alarmType[]>>(ReqAlarmUrl + "/getListByPage", params, { noLoading: true });
  }

  /**
   * 获取告警类型列表
   * @description 获取告警类型列表 不进行分页 进行滚动
   * @author 党亚南-20230717
   * @return {ResultData<WorkOrder.alarmType[]>>}
   */
  static getAlarm(params: Partial<WorkOrder.alarmType> = {}) {
    return http.post<WorkOrder.alarmType[]>(ReqAlarmUrl + "/getList", {}, { noLoading: true });
  }

  /**
   *  新增告警类型
   * @param {Partial<WorkOrder.alarmType>} params
   */
  static addAlarmRow(params: Partial<WorkOrder.alarmType>) {
    return http.post(ReqAlarmUrl + `/addRow`, params, { noLoading: true });
  }

  /**
   * 编辑告警类型
   * @param {Partial<WorkOrder.alarmType>} params
   */
  static updateAlarmRow(params: Partial<WorkOrder.alarmType>) {
    return http.post(ReqAlarmUrl + `/updateRow`, params, { noLoading: true });
  }

  /**
   * 告警类型的删除
   * @author 党亚南-20230710
   * @param {{ids: bigint[]}}  params  批量删除
   */
  static deleteAlarm(params: { ids: bigint[] }) {
    return http.post<ResultData<any>>(ReqAlarmUrl + "/deleteRows", params, { noLoading: true });
  }
}
