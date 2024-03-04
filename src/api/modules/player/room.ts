import { ResultData } from "@/api/interface";
import http from "@/api";
import { BaseRoom } from "@/api/interface/player/baseRoom";
import { ROOM } from "@/api/config/servicePort";
import { RoomHttp } from "@/api/modules/control/meetRoom";
import { RoomType } from "@/api/interface/control/MeetRoom";

export const getListByPage = (params: BaseRoom.Room) => {
  return http.post<ResultData<BaseRoom.Room>>(ROOM + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: BaseRoom.Room) => {
  return http.post(ROOM + "/addRow", params);
};

export const updateRow = (params: RoomType.Room) => {
  return http.post(ROOM + "/updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(ROOM + "/deleteRows", params);
};

export const changeStatusById = (params: RoomType.changeStatusById) => {
  return http.post(ROOM + "changeStatusById", params);
};

export const getRoomList = () => {
  return http.post<ResultData<RoomType.Room>>(ROOM + "getList");
};
