import http from "@/api";
import { ResultData } from "@/api/interface";
import { BasePlay } from "@/api/interface/release/playList";
import { PLATLIST } from "@/api/config/servicePort";
import { PlanMedia } from "@/api/interface/player/playerPlanMedia";

export const getListByPage = (params: BasePlay.Terminal) => {
  return http.post<ResultData<BasePlay.Terminal>>(PLATLIST + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: BasePlay.Terminal) => {
  return http.post(PLATLIST + "addRow", params);
};
export const auditRow = (params: BasePlay.Terminal) => {
  return http.post(PLATLIST + "auditRow", params);
};
export const updateRow = params => {
  return http.post(PLATLIST + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(PLATLIST + "deleteRows", params);
};

export const getAllList = (params: BasePlay.Terminal) => {
  return http.post<ResultData<BasePlay.Terminal>>(PLATLIST + "getList", params);
};
export const getDetailById = (params: BasePlay.Terminal) => {
  return http.post(PLATLIST + "getDetailById", params);
};
