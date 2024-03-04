import http from "@/api";
import { ReqPage, ResPage, ResultData } from "@/api/interface";
import { InspectionType } from "@/api/interface/inspection";

const ReqInspectionResultUrl = "/control/controlTask/";

/**
 * 巡检结果  HTTP接口
 * @description 工厂模式下的类 可以直接引用 不要实例化  可以以IOC形式创建
 * @author 党亚南
 */
export class InspectionResultHttp {
  /**
   * 获取巡检列表分页
   * @author 党亚南-20230731
   * @param {ReqPage} params 获取巡检分页列表
   * @return {MeetSourceType.brand[]}
   */
  static getInspectionResultList(params: ReqPage) {
    return http.post<InspectionType.inspection[]>(ReqInspectionResultUrl + "getListByPage", params, { noLoading: true });
  }

  /**
   * 获取巡检列表
   * @description 获取巡检列表 不进行分页 进行滚动
   * @author 党亚南-20230731
   * @return {ResultData<MeetSourceType.brand[]>>}
   */
  static getInspectionResult() {
    return http.post<InspectionType.inspection[]>(ReqInspectionResultUrl + "getList", {}, { noLoading: true });
  }

  /**
   *  新增巡检
   *@param {inspectionId: number|bigint; brandName: string; brandStatus: 0|1} params
   */
  static addInspectionResultRow(params: { inspectionId: bigint; inspectionName: string; inspectionStatus: 0 | 1 }) {
    return http.post(ReqInspectionResultUrl + `addRow`, params, { noLoading: true });
  }

  /**
   * 编辑巡检
   * @param {Partial<InspectionType.inspection>} params
   */
  static updateInspectionResultRow(params: Partial<InspectionType.inspection>) {
    return http.post(ReqInspectionResultUrl + `updateRow`, params, { noLoading: true });
  }
}
