import { AreaHttp } from "@/api/modules/control/area";
import { MeetRoomTypeHttp } from "@/api/modules/control/meetRoomType";
import { RoomHttp } from "@/api/modules/control/meetRoom";

export class InspectionHandle {
  /**
   * 从1级区域到二级区域 到房间  三层遍历
   */
  static async getRoomTree() {
    // 1. 获取区域列表
    let options = [];
    let areaFirstList = (await AreaHttp.getAreaList({ parentId: 0 })).data;
    let areaSecondList = (await AreaHttp.getAreaList({ parentId: 1 })).data;
    // 2. 获取会议室列表
    let roomList = (await RoomHttp.getList()).data;
    areaFirstList.forEach(first => {
      let tmp = []; // 二级区域列表
      areaSecondList.forEach(second => {
        let tmpRoom = []; //房间
        if (second.parentId === first.areaId) {
          roomList.forEach(room => {
            if (room.areaId === second.areaId) {
              tmpRoom.push({ label: room.roomName, value: room.roomId });
            }
          });
          if (tmpRoom.length > 0) {
            tmp.push({ label: second.areaName, value: second.areaId, children: tmpRoom });
          }
        }
      });
      if (tmp.length > 0) {
        options.push({
          label: first.areaName,
          value: first.areaId,
          children: tmp
        });
      }
    });
    return options;
  }
}
