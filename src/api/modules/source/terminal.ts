import http from "@/api";
import { ReqPage, ReqPagePlus, ResPage, ResultData } from "@/api/interface";
import { MeetSourceType } from "@/api/interface/source";

const ReqTerminalUrl = "/control/controlTerminal";

/**
 * 设备的HTTP请求接口
 * @description 工厂模式下的类 可以直接引用 不要实例化  可以以IOC形式创建
 * @author 党亚南
 */
export class TerminalHttp {
  /**
   * 获取设备分页
   * @author 党亚南-20230719
   * @param {ReqPage} params 获取设备分页列表
   * @return {ResultData<MeetSourceType.brand[]>>}
   */
  static getTerminalList(params: ReqPagePlus) {
    return http.post<ResultData<MeetSourceType.terminal[]>>(ReqTerminalUrl + "/getListByPage", params, { noLoading: true });
  }

  /**
   * 获取设备列表
   * @description 获取设备列表 不进行分页 进行滚动
   * @author 党亚南-20230717
   * @return {ResultData<MeetSourceType.brand[]>>}
   */
  static getTerminal(params: Partial<MeetSourceType.terminal> = {}) {
    return http.post<MeetSourceType.terminal[]>(ReqTerminalUrl + "/getList", params, { noLoading: true });
  }

  /**
   *  新增设备
   * @param {Partial<MeetSourceType.brand>} params
   */
  static addTerminalRow(params: Partial<MeetSourceType.terminal>) {
    return http.post(ReqTerminalUrl + `/addRow`, params, { noLoading: true });
  }

  /**
   * 编辑设备
   * @param {Partial<MeetSourceType.terminal>} params
   */
  static updateTerminalRow(params: Partial<MeetSourceType.terminal>) {
    return http.post(ReqTerminalUrl + `/updateRow`, params, { noLoading: true });
  }

  /**
   * 删除设备
   * @param {Partial<MeetSourceType.terminal>} params
   */
  static deleteTerminalRow(params: number[] | bigint[]) {
    return http.post(ReqTerminalUrl + `/deleteRows`, { ids: params }, { noLoading: true });
  }

  /**
   * 品牌的启用停用
   * @author 党亚南-20230717
   * @param {bigint} brandId 品牌ID
   * @param {0|1} brandStatus 品牌状态
   * @return {ResultData<any>>}
   */
  static changeTerminalStatus(params: { terminalId: bigint; terminalStatus: 1 | 2 }) {
    return http.post<ResultData<any>>(ReqTerminalUrl + "/changeStatusById", params, { noLoading: true });
  }

  static exportTerminalLedger(params: Partial<MeetSourceType.terminal> = {}) {
    return http.download(ReqTerminalUrl + "/export", params);
  }
}

// 导出用户数据
