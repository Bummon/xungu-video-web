// import { sysJob } from "@/api/interface/system/sysJob";
import { ReqPagePlus, ResPage, ResultData } from "@/api/interface";
import http from "@/api";
import { CONTROLAREA } from "@/api/config/servicePort";
import { AreaType } from "@/api/interface/control/area";
import { ReqPage } from "@/api/interface/index";

export const status = [
  { label: "禁用", value: 0, tagType: "info" },
  { label: "启用", value: 1, tagType: "success" }
];

export class AreaHttp {
  /**
   * 分页查询获取 区域的扁平列表
   * @param params
   * @param {number|bigint} parentId 不加parentId查所有  传0 查一级区域， 传1 查二级区域，  传具体一级区域的id 查它下面二级区域
   */
  static getAreaListByPage = (params: ReqPagePlus) => {
    return http.post<ResPage<AreaType.area>>(CONTROLAREA + "getListByPage", params, { noLoading: true });
  };

  /**
   * 不分页 查所有的区域列表
   */
  static getAreaList = (params: Partial<AreaType.area> = {}) => {
    return http.post<AreaType.area[]>(CONTROLAREA + "getList", params, { noLoading: true });
  };
  /**
   * 新增区域
   * @param params
   */
  static addRow = (params: AreaType.area) => {
    return http.post(CONTROLAREA + "addRow", params);
  };

  /**
   * 删除区域
   * @param id
   */
  static deleteRows = (ids: number[]) => {
    return http.post(CONTROLAREA + "deleteRows", { ids: ids });
  };

  /**
   * 更新区域的内容
   * @param params
   */
  static updateRow = (params: AreaType.area) => {
    return http.post(CONTROLAREA + "updateRow", params);
  };
}
