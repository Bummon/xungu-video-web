import http from "@/api";
import { ResultData } from "@/api/interface";
import { BaseTerminalGroup } from "@/api/interface/player/baseTerminalGroup";
import { DASHBOARD } from "@/api/config/servicePort";

export const getTerminalList = (params: BaseTerminalGroup.Group) => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(DASHBOARD + "getTerminalList", params);
};

export const getMediaList = (params: BaseTerminalGroup.Group) => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(DASHBOARD + "getMediaList", params);
};

export const getLibraryList = (params: BaseTerminalGroup.Group) => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(DASHBOARD + "getLibraryList", params);
};
