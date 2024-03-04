import http from "@/api";
import { ReqPagePlus, ResPage } from "@/api/interface";
import { RoomTypeType } from "@/api/interface/control/MeetRoomType";

const baseRoomTypeUrl = "/control/controlMeetingRoomType/";

export class MeetRoomTypeHttp {
  static getListByPage(params: ReqPagePlus) {
    return http.post<ResPage<RoomTypeType.RoomType[]>>(baseRoomTypeUrl + "getListByPage", params);
  }

  static getList() {
    return http.post<RoomTypeType.RoomType[]>(baseRoomTypeUrl + "getList");
  }

  static addRow(params: Partial<RoomTypeType.RoomType>) {
    return http.post(baseRoomTypeUrl + "addRow", params);
  }

  static updateRow(params: Partial<RoomTypeType.RoomType>) {
    return http.post(baseRoomTypeUrl + "updateRow", params);
  }

  static deleteRoomType(params: { ids: number[] }) {
    return http.post(baseRoomTypeUrl + "deleteRows", params);
  }
}
