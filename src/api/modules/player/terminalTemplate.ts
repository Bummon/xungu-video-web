import http from "@/api";
import { ResultData } from "@/api/interface";
import { TERMINALTEMPLATE } from "@/api/config/servicePort";
import { BaseTerminalTemplate } from "@/api/interface/player/baseTerminalTemplate";

export const templateStatus = [
  { label: "禁用", value: 0 },
  { label: "启用", value: 1 }
];

export const getListByPage = (params: BaseTerminalTemplate.Template) => {
  return http.post<ResultData<BaseTerminalTemplate.Template>>(TERMINALTEMPLATE + "getListByPage", params, { noLoading: true });
};

export const addRow = (params: BaseTerminalTemplate.Template) => {
  return http.post(TERMINALTEMPLATE + "addRow", params);
};

export const updateRow = (params: BaseTerminalTemplate.Template) => {
  return http.post(TERMINALTEMPLATE + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(TERMINALTEMPLATE + "deleteRows", params);
};

export const changeStatusById = (params: BaseTerminalTemplate.changeStatusById) => {
  return http.post(TERMINALTEMPLATE + "changeStatusById", params);
};
