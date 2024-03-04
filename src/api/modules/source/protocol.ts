import { ReqPage, ReqPagePlus, ResultData } from "@/api/interface";
import http from "@/api";
import { MeetSourceType } from "@/api/interface/source";

const ReqProtocolUrl = "/control/controlEquipmentProtocol";
/**
 * 这是协议的HTTP请求接口
 * @description 工厂模式下的类 可以直接引用 不要实例化  可以以IOC形式创建
 * @author 党亚南
 */
export class ProtocolHttp {
  /**
   * 获取协议列表(分页)
   * @param {ReqPage} params 分页参数
   * @return {MeetSourceType.protocol[]}
   */
  static getProtocolList(params: ReqPagePlus) {
    return http.post<MeetSourceType.protocol[]>(ReqProtocolUrl + "/getListByPage", params, { noLoading: true });
  }
  /**
   * 获取协议列表(完整)
   * @return {MeetSourceType.protocol[]}
   */
  static getProtocol() {
    return http.post<MeetSourceType.protocol[]>(ReqProtocolUrl + "/getList", {}, { noLoading: true });
  }

  /**
   * 获取新增协议时的选项
   */
  static getOptions() {
    return http.post<MeetSourceType.protocolOptions>(ReqProtocolUrl + "/getOptions", {}, { noLoading: true });
  }
  /**
   *  新增品牌
   *@param {Partial<MeetSourceType.protocol>} params
   */
  static addProtocolRow(params: Partial<MeetSourceType.protocol>) {
    return http.post(ReqProtocolUrl + `/addRow`, params, { noLoading: true });
  }

  /**
   * 编辑品牌
   * @param {Partial<MeetSourceType.protocol>} params
   */
  static updateProtocolRow(params: Partial<MeetSourceType.protocol>) {
    return http.post(ReqProtocolUrl + `/updateRow`, params, { noLoading: true });
  }

  /**
   * 删除
   * @author 党亚南-20230710
   * @param {{ids: bigint[]}}  params  批量删除
   */
  static deleteProtocol(params: { ids: bigint[] }) {
    return http.post<any>(ReqProtocolUrl + "/deleteRows", params, { noLoading: true });
  }
}
