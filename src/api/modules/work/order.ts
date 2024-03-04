import http from "@/api";
import { ReqPage, ReqPagePlus, ResPage, ResultData } from "@/api/interface";
import { WorkOrder } from "@/api/interface/work";

const ReqOrderUrl = "/control/controlWorkOrder";
const ReqOrderLogUrl = "/control/controlOrderLog";
const ReqOrderNoticeUrl = "/control/controlOrderNotice";

export const status = [
  { label: "待维修", value: 0, tagType: "warning" },
  { label: "维修中", value: 1, tagType: "danger" },
  { label: "已完成", value: 2, tagType: "success" },
  { label: "已关闭", value: 3, tagType: "info" }
];

/**
 * 工单的接口
 */
export class OrderHttp {
  /**
   * 获取工单分页
   * @param {ReqPage} params 获取工单分页列表
   * @return {ResultData<WorkOrder.order[]>>}
   */
  static getOrderList(params: ReqPagePlus) {
    return http.post<ResultData<WorkOrder.order[]>>(ReqOrderUrl + "/getListByPage", params, { noLoading: true });
  }

  /**
   * 获取工单列表
   * @description 获取工单列表 不进行分页 进行滚动
   * @return {ResultData<WorkOrder.order[]>>}
   */
  static getOrder(params: Partial<WorkOrder.order> = {}) {
    return http.post<ResultData<WorkOrder.order[]>>(ReqOrderUrl + "/getList", {}, { noLoading: true });
  }

  /**
   *  新增工单
   * @param {Partial<WorkOrder.order>} params
   */
  static addOrderRow(params: Partial<WorkOrder.order>) {
    return http.post(ReqOrderUrl + `/addRow`, params, { noLoading: true });
  }

  /**
   * 编辑工单
   * @param {Partial<WorkOrder.order>} params
   */
  static updateOrderRow(params: Partial<WorkOrder.order>) {
    return http.post(ReqOrderUrl + `/updateRow`, params, { noLoading: true });
  }

  /**
   * 工单的状态切换
   * @param {bigint} brandId 品牌ID
   * @param {0|1} brandStatus 品牌状态
   * @return {ResultData<any>>}
   */
  static changeOrderStatus(params: { orderId: bigint; orderStatus: 1 | 3 }) {
    return http.post<ResultData<any>>(ReqOrderUrl + "/changeStatusById", params, { noLoading: true });
  }

  /**
   * 完成工单
   * @param {Partial<WorkOrder.order>} params
   */
  static finishOrderRow(params: Partial<WorkOrder.order>) {
    return http.post(ReqOrderUrl + `/finishRow`, params, { noLoading: true });
  }

  /**
   * 获取操作日志
   * @param {Partial<WorkOrder.order>} params
   */
  static getOrderLogList(params: Partial<WorkOrder.operationLog>) {
    return http.post<WorkOrder.operationLog[]>(ReqOrderLogUrl + `/getList`, params, { noLoading: true });
  }

  /**
   * 获取通知列表
   * @return {ResultData<WorkOrder.order[]>>}
   */
  static getOrderNotice(params: Partial<WorkOrder.notice> = {}) {
    return http.post<ResultData<WorkOrder.notice[]>>(ReqOrderNoticeUrl + "/getList", {}, { noLoading: true });
  }

  /**
   * 通知状态切换
   * @return {ResultData<any>>}
   */
  static changeNoticeStatus(params: { noticeId: bigint; noticeStatus: number }) {
    return http.post(ReqOrderNoticeUrl + "/changeStatusById", params, { noLoading: true });
  }
}
