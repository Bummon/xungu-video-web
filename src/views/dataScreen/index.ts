import { DataType } from "@/api/modules/data";
import { AreaType } from "@/api/interface/control/area";
import { AreaHttp } from "@/api/modules/control/area";

export class DataScreenHandle {
  static getAreaList(): Promise<[] | DataType.Cascade[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let data: DataType.Cascade[] | [] = [];
        // 一级区域列表
        let firstList: AreaType.area[] = (await AreaHttp.getAreaList({ parentId: 0 })).data;
        // 二级区域列表
        let secondList: AreaType.area[] = (await AreaHttp.getAreaList({ parentId: 1 })).data;

        firstList.forEach(firstArea => {
          let tmp: DataType.Cascade = {
            label: firstArea.areaName,
            value: firstArea.areaId,
            children: []
          };
          secondList.forEach((secondArea: AreaType.area) => {
            if (secondArea.parentId === firstArea.areaId) {
              tmp.children.push({ label: secondArea.areaName, value: secondArea.areaId });
            }
          });
          if (tmp.children?.length > 0) {
            data.push(tmp);
          }
        });
        resolve(data);
      } catch (e) {
        reject([]);
      }
    });
  }
}
