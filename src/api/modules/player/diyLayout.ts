import http from "@/api";
import { ReqPage, Result, ResultData } from "@/api/interface";
import { BaseDiyLayout } from "@/api/interface/player/baseDiyLayout";
import { DIYLAYOUT } from "@/api/config/servicePort";
import { UnwrapRef } from "vue";

/**
 * 查询分页列表
 * @param params
 */
export const getLayoutListByPage = (params: ReqPage) => {
  return http.post<ResultData<BaseDiyLayout.DiyLayoutList>>(DIYLAYOUT + "getListByPage", params, { noLoading: true });
};

/**
 * 新增布局
 * @param params
 * @constructor
 */
// 不可复用
export interface addRowLayoutParams {
  layoutDescr: string; // 描述
  layoutDesign: string; // json字符串
  layoutTitle: string; // 标题
  layoutIco: string; // 缩略图
}
export const DiyLayoutAddRow = (params: addRowLayoutParams) => {
  return http.post<Result>(DIYLAYOUT + "addRow", params);
};

/**
 * 编辑布局
 * @param params
 * @constructor
 */
export const DiyLayoutUpdateRow = (params: BaseDiyLayout.DiyLayout) => {
  return http.post<Result>(DIYLAYOUT + "updateRow", params);
};

/**
 * 删除布局
 * @param ids:layoutId[]
 * @constructor
 */

export const DiyLayoutDeleteRow = (params: BaseDiyLayout.deleteLayoutParams) => {
  return http.post<Result>(DIYLAYOUT + "deleteRows", params);
};

export const getList = () => {
  return http.post<ResultData<BaseDiyLayout.DiyLayoutList>>(DIYLAYOUT + "getList");
};

export const changeStatusById = (params: BaseDiyLayout.changeStatusById) => {
  return http.post(DIYLAYOUT + "changeStatusById", params);
};

/**
 * 通过id去查询布局详情
 */
export const getDetailById = (id: bigint) => {
  return http.post(DIYLAYOUT + "getDetailById", { id });
};
/**
 * 上传背景资源图
 * @param params
 * file:  file
 * folderName:  文件夹名
 */
export const uploadBgcImg = (file: FormData) => {
  return http.post("/common/file/upload/source", file);
};
