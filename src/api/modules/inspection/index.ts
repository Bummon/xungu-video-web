import http from "@/api";
import { ReqPage, ResPage, ResultData } from "@/api/interface";
import { InspectionType } from "@/api/interface/inspection";

const ReqInspectionUrl = "/control/controlInspection/";

/**
 * 巡检以及 型号 HTTP接口
 * @description 工厂模式下的类 可以直接引用 不要实例化  可以以IOC形式创建
 * @author 党亚南
 */
export class InspectionHttp {
  /**
   * 获取巡检列表分页
   * @author 党亚南-20230731
   * @param {ReqPage} params 获取巡检分页列表
   * @return {MeetSourceType.brand[]}
   */
  static getInspectionList(params: ReqPage) {
    return http.post<InspectionType.inspection[]>(ReqInspectionUrl + "getListByPage", params, { noLoading: true });
  }

  /**
   * 获取巡检列表
   * @description 获取巡检列表 不进行分页 进行滚动
   * @author 党亚南-20230731
   * @return {ResultData<MeetSourceType.brand[]>>}
   */
  static getInspection() {
    return http.post<InspectionType.inspection[]>(ReqInspectionUrl + "getList", {}, { noLoading: true });
  }

  /**
   *  新增巡检
   *@param {inspectionId: number|bigint; brandName: string; brandStatus: 0|1} params
   */
  static addInspectionRow(params: { inspectionId: bigint; inspectionName: string; inspectionStatus: 0 | 1 }) {
    return http.post(ReqInspectionUrl + `addRow`, params, { noLoading: true });
  }

  /**
   * 编辑巡检
   * @param {Partial<InspectionType.inspection>} params
   */
  static updateInspectionRow(params: Partial<InspectionType.inspection>) {
    return http.post(ReqInspectionUrl + `updateRow`, params, { noLoading: true });
  }

  /**
   * 删除巡检
   * @param {Partial<InspectionType.inspection>} params
   */
  static deleteInspectionRow(params: { ids: [] }) {
    return http.post(ReqInspectionUrl + `deleteRows`, params, { noLoading: true });
  }

  /**
   * 巡检的启用停用
   * @author 党亚南-20230731
   * @return {ResultData<any>>}
   * @param params
   */
  static changeInspectionStatus(params: { inspectionId: bigint; inspectionStatus: 0 | 1 }) {
    return http.post<ResultData<any>>(ReqInspectionUrl + "changeStatusById", params, { noLoading: true });
  }
}
