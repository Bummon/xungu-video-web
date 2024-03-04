import http from "@/api";
import { ResultData } from "@/api/interface";
import { BaseTerminalGroup } from "@/api/interface/player/baseTerminalGroup";
import { SEND } from "@/api/config/servicePort";

export const sendGroupMsg = (params: BaseTerminalGroup.Group) => {
  return http.post<ResultData<BaseTerminalGroup.Group>>(SEND + "sendGroupMsg", params);
};
