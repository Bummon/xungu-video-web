import { sysAppVersionRange } from "@/api/interface/system1/sysAppVersionRange";
import http from "@/api";
import { VERSIONRANGE } from "@/api/config/servicePort";

export const addRangeRow = (params: sysAppVersionRange.appVersionRange) => {
  return http.post(VERSIONRANGE + "addRow", params);
};
export const getSelectList = (params: sysAppVersionRange.appVersionRange) => {
  return http.post(VERSIONRANGE + "getList", params);
};
export const updateRow = (params: sysAppVersionRange.appVersionRange) => {
  return http.post(VERSIONRANGE + "updateRow", params);
};

export const deleteRows = (params: { ids: string[] }) => {
  return http.post(VERSIONRANGE + "deleteRows", params);
};
