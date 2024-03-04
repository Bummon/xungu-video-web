import { ResourceTypeHttp } from "@/api/modules/source/resourceType";
import { MeetSourceType } from "@/api/interface/source";
import { RoomHttp, sysApp } from "@/api/modules/control/meetRoom";
import { getList as getJobList } from "@/api/modules/system1/job";
import { sysJob } from "@/api/interface/system1/sysJob";
import { ResultData } from "@/api/interface";
import { BrandHttp } from "@/api/modules/source/brand";
import { TerminalHttp } from "@/api/modules/source/terminal";
import { WorkOrder } from "@/api/interface/work";
import { OrderHttp } from "@/api/modules/work/order";
import { DataType } from "@/api/modules/data";
import { AlarmHttp } from "@/api/modules/work/alarm";
import { RoomType } from "@/api/interface/control/MeetRoom";

export class OrderHandle {
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
  static getModelList() {
    return new Promise(async (resolve, reject) => {
      try {
        let brandList: MeetSourceType.brand[] = (await BrandHttp.getBrand()).data;
        let modelList = (await BrandHttp.getModel({})).data;
        console.log(brandList, modelList);
        brandList.forEach(brand => {
          console.log(brand);
          brand.modelName = brand.brandName;
          brand.modelId = brand.brandId;
          let tmp: MeetSourceType.model[] = [];
          modelList.forEach((model: MeetSourceType.model) => {
            if (model.brandId === brand.brandId) {
              tmp.push(model);
            }
          });
          brand.children = tmp;
        });
        resolve(brandList);
      } catch (e) {
        reject([]);
      }
    });
  }

  static getTerminal(roomId: bigint): Promise<MeetSourceType.terminal[] | []> {
    return new Promise(async (resolve, reject) => {
      try {
        let room = { roomId: roomId } as MeetSourceType.terminal;
        console.log("roomId", room);
        let res = await TerminalHttp.getTerminal(room);
        resolve(res.data);
      } catch (e) {
        reject([]);
      }
    });
  }

  static getOrderLog(orderId: bigint): Promise<WorkOrder.operationLog[] | []> {
    return new Promise(async (resolve, reject) => {
      try {
        let order = { relationId: orderId } as WorkOrder.operationLog;
        let res = await OrderHttp.getOrderLogList(order);
        resolve(res.data);
      } catch (e) {
        reject([]);
      }
    });
  }

  static getOrderNotice() {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await OrderHttp.getOrderNotice();
        resolve(res.data);
      } catch (e) {
        reject([]);
      }
    });
  }

  /**
   * 获取型号的列表
   */
  static getTerminalList(): Promise<DataType.Cascade[] | []> {
    return new Promise(async (resolve, reject) => {
      try {
        let data: DataType.Cascade[] = [];
        let meetRoomList: RoomType.Room[] = (await RoomHttp.getList()).data;
        let terminalList = (await TerminalHttp.getTerminal({})).data;
        meetRoomList.forEach(room => {
          let tmp: DataType.Cascade = {
            label: room.roomName,
            value: room.roomId,
            children: []
          };
          terminalList.forEach((terminal: MeetSourceType.terminal) => {
            if (terminal.roomId === room.roomId) {
              tmp.children.push({ label: terminal.terminalName, value: terminal.terminalId });
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
   * 获取告警类型列表
   */
  static getAlarmType() {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await AlarmHttp.getAlarm();
        resolve(res.data);
      } catch (e) {
        reject([]);
      }
    });
  }
}
