import { AreaHttp } from "@/api/modules/control/area";
import { ResPage } from "@/api/interface";
import { AreaType } from "@/api/interface/control/area";

export class AreaHandle {
  /**
   * 获取一级区域的列表
   */
  static async getFirstArea() {
    try {
      let area = (await AreaHttp.getAreaList()).data || [];
      let firstAreaList: AreaType.area[] = [];
      area.forEach(item => {
        if (item.parentId === 0) {
          firstAreaList.push(item);
        }
      });
      console.log(firstAreaList);
      return firstAreaList;
    } catch (e) {
      return [];
    }
  }

  /**
   * 将查询到的全部数据 清洗出二级区域 再展示
   */
  static async getSecondArea(res: ResPage<AreaType.area[]>) {
    res.data = res.data?.filter(item => item.parentId === 0);
    console.log("过滤掉一级区域后的数据", res);
    return res;
  }
}
