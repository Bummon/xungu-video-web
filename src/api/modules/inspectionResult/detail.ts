import http from "@/api";
import { ReqPage, ResPage, ResultData } from "@/api/interface";
import { TaskDetailType } from "@/api/interface/inspectionResult/detail";

const ReqTaskDetailUrl = "/control/controlTaskDetail/";

/**
 * 巡检结果  HTTP接口
 * @description 工厂模式下的类 可以直接引用 不要实例化  可以以IOC形式创建
 * @author 党亚南
 */
export class TaskDetailHttp {
  /**
   * 获取巡检列表分页
   * @author 党亚南-20230731
   * @param {ReqPage} params 获取巡检分页列表
   * @return {MeetSourceType.brand[]}
   */
  static getTaskDetailListByPage(params: ReqPage) {
    return http.post<ResPage<TaskDetailType.taskDetail[]>>(ReqTaskDetailUrl + "getListByPage", params, { noLoading: true });
  }

  /**
   * 获取巡检列表
   * @description 获取巡检列表 不进行分页 进行滚动
   * @author 党亚南-20230731
   * @return {ResultData<MeetSourceType.brand[]>>}
   */
  static getTaskDetailList(params = {}) {
    return http.post<TaskDetailType.taskDetail[]>(ReqTaskDetailUrl + "getList", params, { noLoading: true });
  }
}
