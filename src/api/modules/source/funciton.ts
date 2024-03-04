import http from "@/api";
import { ReqPage, ReqPagePlus, ResPage, ResultData } from "@/api/interface";
import { MeetSourceType } from "@/api/interface/source";

// 前缀路径
const ReqBaseUrl = "/control/controlFunction";

export namespace FunctionHttp {
  /**
   * 切换功能启用停用状态的接口
   * @author 党亚南-20230713
   * @param {bigint} functionId 功能ID
   * @param {0|1} functionStatus 功能状态
   * @return {ResultData<any>>}
   */
  export const changeFunctionStatus = (params: { functionId: bigint; functionStatus: 0 | 1 }) => {
    return http.post<ResultData<any>>(ReqBaseUrl + "/changeStatusById", params, { noLoading: true });
  };
  /**
   * 获取功能列表
   * @description 获取品牌列表 不进行分页 进行滚动
   * @author 党亚南-20230717
   * @return {ResultData<MeetSourceType.functionDat[]>>}
   */
  export const getFunction = (params = {}) => {
    return http.post<MeetSourceType.functionData[]>(ReqBaseUrl + "/getList", params);
  };
  /**
   * 查询分页数据
   * @param {ReqPage}分页参数
   */
  export const getListByPage = (params: ReqPagePlus) => {
    return http.post<MeetSourceType.functionData>(ReqBaseUrl + "/getListByPage", params, {
      noLoading: true
    });
  };

  /**
   *  新增功能
   *@param {functionId: bigint; functionName: string; functionStatus: 0|1}
   */
  export const addRow = (params: { functionId: bigint; functionName: string; functionStatus: 0 | 1 }) => {
    return http.post(ReqBaseUrl + `/addRow`, params);
  };

  /**
   * 编辑功能资源
   * @param {Partial<MeetSourceType.functionData>}
   */
  export const updateRow = (params: Partial<MeetSourceType.functionData>) => {
    return http.post(ReqBaseUrl + `/updateRow`, params);
  };
  /**
   * 编辑功能资源
   * @param {Partial<MeetSourceType.functionData>}
   */
  export const deleteFunction = (params: { ids: number[] }) => {
    return http.post(ReqBaseUrl + `/deleteRows`, params);
  };
}
