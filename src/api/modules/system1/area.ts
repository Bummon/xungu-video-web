import { ResultData } from "@/api/interface";
import { AREA } from "@/api/config/servicePort";
import http from "@/api";
import { sysArea } from "@/api/interface/system1/sysArea";

export const getTreeList = (params: sysArea.area) => {
  return http.post<ResultData<sysArea.TreeArea>>(AREA + `/getTreeList`, params);
};
export const getListByPage = (params: sysArea.area) => {
  return http.post<ResultData<sysArea.area>>(AREA + `/getListByPage`, params);
};

// 新增区域
export const addRow = (params: { id: string }) => {
  return http.post(AREA + `/addRow`, params);
};

// 编辑区域
export const updateRow = (params: sysArea.area) => {
  return http.post(AREA + `/updateRow`, params);
};

// 删除区域
export const deleteRows = (params: { ids: string[] }) => {
  return http.post(AREA + `/deleteRows`, params);
};

// 切换区域状态
export const changeAreaStatus = (params: { deptId: string; deptStatus: number }) => {
  return http.post(AREA + `/changeAreaStatus`, params);
};
