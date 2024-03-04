// 场景
import { ReqPagePlus, ResPage } from "@/api/interface";
import http from "@/api";
import { SceneType } from "@/api/interface/control/scene";

const SceneUrl = "/control/controlScenario/";
const ScenePlanUrl = "/control/controlScenarioPlan/";

export class SceneHttp {
  /**
   * 分页查询获取 区域的扁平列表
   * @param params
   * @param {number|bigint} parentId 不加parentId查所有  传0 查一级区域， 传1 查二级区域，  传具体一级区域的id 查它下面二级区域
   */
  static getSceneListByPage = (params: ReqPagePlus) => {
    return http.post<ResPage<SceneType.Scene>>(SceneUrl + "getListByPage", params, { noLoading: true });
  };

  /**
   * 不分页 查所有的场景
   */
  static getSceneList = (params: Partial<SceneType.Scene> = {}) => {
    return http.post<SceneType.Scene[]>(SceneUrl + "getList", params, { noLoading: true });
  };
  /**
   * 新增区域
   * @param params
   */
  static addSceneRow = (params: SceneType.Scene) => {
    return http.post(SceneUrl + "addRow", params);
  };

  /**
   * 删除区域
   * @param id
   */
  static deleteSceneRows = (ids: number[]) => {
    return http.post(SceneUrl + "deleteRows", { ids: ids });
  };

  /**
   * 更新区域的内容
   * @param params
   */
  static updateSceneRow = (params: SceneType.Scene) => {
    return http.post(SceneUrl + "updateRow", params);
  };
  //  切换 会议室的场景
  static tabScene = (params: { ip: string; scenarioId: number }) => {
    return http.post("/control/sceneControl", params);
  };
}

export class ScenePlanHttp {
  /**
   * 分页查询获取 区域的扁平列表
   * @param params
   */
  static getScenePlanListByPage = (params: ReqPagePlus) => {
    return http.post<ResPage<SceneType.Scene>>(ScenePlanUrl + "getListByPage", params, { noLoading: true });
  };

  /**
   * 不分页 查所有的场景
   */
  static getScenePlanList = (params: Partial<SceneType.ScenePlan> = {}) => {
    return http.post<SceneType.ScenePlan[]>(ScenePlanUrl + "getList", params, { noLoading: true });
  };
  /**
   * 新增区域
   * @param params
   */
  static addScenePlanRow = (params: SceneType.ScenePlan) => {
    return http.post(ScenePlanUrl + "addRow", params);
  };

  /**
   * 删除区域
   * @param id
   */
  static deleteScenePlanRows = (ids: number[]) => {
    return http.post(ScenePlanUrl + "deleteRows", { ids: ids });
  };

  /**
   * 更新区域的内容
   * @param params
   */
  static updateScenePlanRow = (params: SceneType.Scene) => {
    return http.post(ScenePlanUrl + "updateRow", params);
  };
  /**
   * 切换状态
   * @param params
   * @param {1|2|3} status  1是未启用 2是启用中  3是已经结束
   */
  static changeScenePlanStatus = (params: { planId: number; status: 1 | 2 | 3 }) => {
    return http.post(ScenePlanUrl + "changeStatusById", params);
  };
}
