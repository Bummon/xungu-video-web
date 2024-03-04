import http from "@/api";
import { ReqPage, ResPage } from "@/api/interface";
import { COMPONENT } from "@/api/config/servicePort";

interface reqList extends ReqPage {
  billType: number;
}
export const getListByPage = params => {
  return http.post<ResPage<BaseComponent.Component>>(COMPONENT + "getListByPage", params, { noLoading: true });
};
