import http from "@/api";
import { ReqPage, ResPage, ResultData } from "@/api/interface";
import { APP } from "@/api/config/servicePort";
import { MeetSourceType } from "@/api/interface/source";

const ReqBrandUrl = "/control/controlBrand";
const ReqModelUrl = "/control/controlModel";

/**
 * 品牌以及 型号 HTTP接口
 * @description 工厂模式下的类 可以直接引用 不要实例化  可以以IOC形式创建
 * @author 党亚南
 */
export class BrandHttp {
  /**
   * 获取品牌列表分页
   * @author 党亚南-20230717
   * @param {ReqPage} params 获取品牌分页列表
   * @return {ResultData<MeetSourceType.brand[]>>}
   */
  static getBrandList(params: ReqPage) {
    return http.post<ResultData<MeetSourceType.brand[]>>(
      ReqBrandUrl + "/getListByPage",
      Object.assign(params, { statusType: 1 }),
      { noLoading: true }
    );
  }

  /**
   * 获取品牌列表
   * @description 获取品牌列表 不进行分页 进行滚动
   * @author 党亚南-20230717
   * @return {ResultData<MeetSourceType.brand[]>>}
   */
  static getBrand() {
    return http.post<MeetSourceType.brand[]>(ReqBrandUrl + "/getList", {}, { noLoading: true });
  }

  /**
   *  新增品牌
   *@param {brandId: bigint; brandName: string; brandStatus: 0|1} params
   */
  static addBrandRow(params: { brandId: bigint; brandName: string; brandStatus: 0 | 1 }) {
    return http.post(ReqBrandUrl + `/addRow`, params, { noLoading: true });
  }

  /**
   * 编辑品牌
   * @param {Partial<MeetSourceType.brand>} params
   */
  static updateBrandRow(params: Partial<MeetSourceType.brand>) {
    return http.post(ReqBrandUrl + `/updateRow`, params, { noLoading: true });
  }

  /**
   * 品牌的启用停用
   * @author 党亚南-20230717
   * @param {bigint} brandId 品牌ID
   * @param {0|1} brandStatus 品牌状态
   * @return {ResultData<any>>}
   */
  static changeBrandStatus(params: { brandId: bigint; brandStatus: 0 | 1 }) {
    return http.post<ResultData<any>>(ReqBrandUrl + "/changeStatusById", params, { noLoading: true });
  }

  /**
   * 删除品牌
   * @param {number[]} ids
   */
  static deleteRows(ids: number[]) {
    return http.post(ReqBrandUrl + `/deleteRows`, { ids });
  }

  //****************************************     型号      **************************************************

  /**
   * 新增型号
   * @param {}
   */
  static addModel(params: Partial<MeetSourceType.model>) {
    return http.post(ReqModelUrl + "/addRow", params, { noLoading: true });
  }

  /**
   * 编辑型号
   * @param {Partial<MeetSourceType.model>} params
   */
  static updateModel(params: Partial<MeetSourceType.model>) {
    return http.post(ReqModelUrl + `/updateRow`, params, { noLoading: true });
  }

  static getModelList(params: MeetSourceType.ReqModelList) {
    return http.post(ReqModelUrl + "/getListByPage", { ...params, ...{ statusType: 1 } }, { noLoading: true });
  }

  static getModel(params: { brandId?: bigint }) {
    return http.post<MeetSourceType.model[]>(ReqModelUrl + "/getList", params, { noLoading: true });
  }

  /**
   * 删除品牌
   * @param {number[]} ids
   */
  static deleteModel(ids: number[]) {
    return http.post(ReqModelUrl + `/deleteRows`, { ids });
  }

  /**
   * 型号的启用停用
   * @author 党亚南-20230717
   * @param {bigint} modelId 品牌ID
   * @param {0|1} modelStatus 品牌状态
   * @return {ResultData<any>>}
   */
  static changeModelStatus(params: { modelId: bigint; modelStatus: 0 | 1 }) {
    return http.post<ResultData<any>>(ReqModelUrl + "/changeStatusById", params, { noLoading: true });
  }

  /**
   * 根据型号id 查询关联的功能
   */
  static getFuncByModelId(params: { modelId: number }) {
    return http.post<ResultData<any>>("control/controlModelFunction/getDetailById", params, { noLoading: true });
  }
}
