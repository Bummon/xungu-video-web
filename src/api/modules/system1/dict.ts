import { ResPage } from "@/api/interface";
import { DICT } from "@/api/config/servicePort";
import http from "@/api";
import { sysDict } from "@/api/interface/system1/sysDict";

/**
 * @name 字典管理模块
 */
// 获取字典列表
export const getDictList = (params: sysDict.dict) => {
  return http.post<ResPage<sysDict.dict>>(DICT + `/getListByPage`, params, { noLoading: true });
};

// 新增字典
export const addRow = (params: { id: string }) => {
  return http.post(DICT + `/addRow`, params);
};

// 编辑字典
export const updateRow = (params: sysDict.dict) => {
  return http.post(DICT + `/updateRow`, params);
};

// 删除字典
export const deleteRows = (params: { ids: string[] }) => {
  return http.post(DICT + `/deleteRows`, params);
};

// 根据字典ID查询详情
export const getDictDetail = (params: { id: string[] }) => {
  return http.post(DICT + `/getDetailById`, params);
};

export const changeStatusById = (params: sysDict.changeStatusById) => {
  return http.post(DICT + "changeStatusById", params);
};
