import http from "@/api";
import { ReqPage, ReqPagePlus, ResPage, ResultData } from "@/api/interface";
import { MeetSourceType } from "@/api/interface/source";

// 前缀路径
const ReqBaseUrl = "/control/controlResourceType";

export namespace ResourceTypeHttp {
  /**
   * 切换资源类型启用停用状态的接口
   * @author 党亚南-20230717
   * @param {bigint} typeId 资源类型ID
   * @param {0|1} typeStatus 启用状态
   * @return {ResultData<any>>}
   */
  export const changeResourceTypeStatus = (params: { typeId: bigint; typeStatus: 0 | 1 }) => {
    return http.post<ResultData<any>>(ReqBaseUrl + "/changeStatusById", params, { noLoading: true });
  };
  /**
   * 查询资源类型
   * @param { ReqPagePlus } params 多参数查询分页
   */
  export const getResourceTypeList = (params: Partial<MeetSourceType.resourceType> = {}) => {
    return http.post<MeetSourceType.resourceType[]>(ReqBaseUrl + "/getList", params, {
      noLoading: true
    });
  };
  /**
   * 查询分页数据
   * @param { ReqPagePlus } params 多参数查询分页
   */
  export const getListByPage = (params: ReqPagePlus) => {
    return http.post<MeetSourceType.resourceType[]>(ReqBaseUrl + "/getListByPage", params, {
      noLoading: true
    });
  };
  /**
   *  新增资源类型
   *@param {typeId: bigint; typeName: string; typeStatus: 0|1}
   */
  export const addRow = (params: Partial<MeetSourceType.resourceType>) => {
    return http.post(ReqBaseUrl + `/addRow`, params);
  };

  /**
   * 编辑资源类型
   * @param {Partial<MeetSourceType.functionData>}
   */
  export const updateRow = (params: Partial<MeetSourceType.resourceType>) => {
    return http.post(ReqBaseUrl + `/updateRow`, params);
  };
  /**
   * 删除资源类型
   * @param {Partial<MeetSourceType.functionData>}
   */
  export const deleteRows = (ids: number[]) => {
    return http.post(ReqBaseUrl + `/deleteRows`, { ids });
  };
}
