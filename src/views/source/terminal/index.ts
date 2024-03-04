import { ResourceTypeHttp } from "@/api/modules/source/resourceType";
import { MeetSourceType } from "@/api/interface/source";
import { RoomHttp, sysApp } from "@/api/modules/control/meetRoom";
import { getList as getJobList } from "@/api/modules/system1/job";
import { sysJob } from "@/api/interface/system1/sysJob";
import { ResultData } from "@/api/interface";
import { BrandHttp } from "@/api/modules/source/brand";
import { DataType } from "@/api/modules/data";
import { AreaType } from "@/api/interface/control/area";
import { AreaHttp } from "@/api/modules/control/area";
import { RoomType } from "@/api/interface/control/MeetRoom";

/**
 * @description 工厂模式下的类  不要实例化  可以做IOC
 */
export class TerminalHandle {
  static getResourceType(): Promise<MeetSourceType.resourceType[] | []> {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await ResourceTypeHttp.getResourceTypeList();
        resolve(res.data);
      } catch (e) {
        reject([]);
      }
    });
  }

  /**
   * 获取会议室列表(不分页)
   */
  static getMeetRoomList(): Promise<sysApp.meeting[] | []> {
    return new Promise(async (resolve, reject) => {
      try {
        let res: ResultData<sysApp.meeting[]> = await RoomHttp.getList();
        resolve(res.data);
      } catch (e) {
        reject([]);
      }
    });
  }

  /**
   * 获取岗位列表(不分页)
   */
  static getJobList(): Promise<sysJob.job[] | []> {
    return new Promise(async (resolve, reject) => {
      try {
        let res: sysJob.job[] = (await getJobList()) as sysJob.job[];
        resolve(res);
      } catch (e) {
        reject([]);
      }
    });
  }

  /**
   * 获取型号的列表
   */
  static getModelList(): Promise<DataType.Cascade[] | []> {
    return new Promise(async (resolve, reject) => {
      try {
        let data: DataType.Cascade[] | [] = [];
        let brandList: MeetSourceType.brand[] = (await BrandHttp.getBrand()).data;
        let modelList = (await BrandHttp.getModel({})).data;
        brandList.forEach(brand => {
          let tmp: DataType.Cascade = {
            label: brand.brandName,
            value: brand.brandId,
            children: []
          };
          modelList.forEach((model: MeetSourceType.model) => {
            if (model.brandId === brand.brandId) {
              tmp.children.push({ label: model.modelName, value: model.modelId });
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

  /**
   * 级联选择 选择会议室   三级可选 1级区域二级区域到会议室
   *
   */
  static getRoomCascaderList(): Promise<[] | DataType.Cascade[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let data: DataType.Cascade[] | [] = [];
        // 一级区域列表
        let firstList: AreaType.area[] = (await AreaHttp.getAreaList({ parentId: 0 })).data;
        // 二级区域列表
        let secondList: AreaType.area[] = (await AreaHttp.getAreaList({ parentId: 1 })).data;
        let roomList: RoomType.Room[] = (await RoomHttp.getList()).data;
        firstList.forEach(firstArea => {
          let tmp: DataType.Cascade = {
            label: firstArea.areaName,
            value: firstArea.areaId,
            children: []
          };
          secondList.forEach((secondArea: AreaType.area) => {
            if (secondArea.parentId === firstArea.areaId) {
              let rooms = [];
              roomList.forEach(room => {
                if (room.areaId === secondArea.areaId) {
                  rooms.push({ label: room.roomName, value: room.roomId });
                }
              });
              tmp.children.push({ label: secondArea.areaName, value: secondArea.areaId, children: rooms });
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
