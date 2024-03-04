import { Upload } from "@/api/interface/index";
import { RESOURCE } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// 图片上传  单文件上传
export const uploadImg = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(`common/file/upload`, params);
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(RESOURCE + `/file/upload/video`, params);
};

//单文件上传
export const upload = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(`common/file/upload`, params);
};
export const fileRemove = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(`/common/file/remove`, params);
};

export const fileRemoveByUrl = (params: { url: string | undefined }) => {
  return http.post<Upload.ResFileUrl>(`/common/file/removeByUrl`, params);
};
