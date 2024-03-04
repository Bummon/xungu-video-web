import { ReqPage, ResultData } from "@/api/interface";
import http from "@/api";
import { MeetSourceType } from "@/api/interface/source";

const ReqCommandUrl = "/control/controlEquipmentCommand";

/**
 * 这是命令的请求HTTP接口
 * @description 工厂模式下的类 可以直接引用 不要实例化  可以以IOC形式创建
 * @author 党亚南
 */
export class CommandHttp {
  /**
   * 获取命令列表分页
   * @author 党亚南-20230717
   * @param {ReqPage} params 获取品牌分页列表
   * @return {ResultData<MeetSourceType.command[]>>}
   */
  static getCommandList(params: ReqPage) {
    return http.post<ResultData<MeetSourceType.command[]>>(ReqCommandUrl + "/getListByPage", params, { noLoading: true });
  }
  /**
   * 获取品牌列表
   * @description 获取品牌列表 不进行分页 进行滚动
   * @author 党亚南-20230717
   * @return {ResultData<MeetSourceType.brand[]>>}
   */
  static getBrand() {
    return http.post<MeetSourceType.brand[]>(ReqCommandUrl + "/getList", {}, { noLoading: true });
  }
  /**
   *  新增品牌
   *@param {brandId: bigint; brandName: string; brandStatus: 0|1} params
   */
  static addCommandRow(params: Partial<MeetSourceType.command>) {
    return http.post(ReqCommandUrl + `/addRow`, params, { noLoading: true });
  }

  /**
   * 编辑品牌
   * @param {Partial<MeetSourceType.brand>} params
   */
  static updateCommandRow(params: Partial<MeetSourceType.command>) {
    return http.post(ReqCommandUrl + `/updateRow`, params, { noLoading: true });
  }
  /**
   * 品牌的启用停用
   * @author 党亚南-20230717
   * @param {bigint} brandId 品牌ID
   * @param {0|1} brandStatus 品牌状态
   * @return {ResultData<any>>}
   */
  static changeBrandStatus(params: { brandId: bigint; brandStatus: 0 | 1 }) {
    return http.post<ResultData<any>>(ReqCommandUrl + "/changeStatusById", params, { noLoading: true });
  }

  /**
   * 品牌的启用停用
   * @author 党亚南-20230710
   * @param {{ids: bigint[]}}  params  批量删除
   */
  static deleteCommand(params: { ids: bigint[] }) {
    return http.post<ResultData<any>>(ReqCommandUrl + "/deleteRows", params, { noLoading: true });
  }
}
