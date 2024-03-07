import http from "@/api";
import { MULTI_UPLOAD, SINGLE_UPLOAD } from "@/api/config/servicePort";
import { common } from "@/api/interface/common/common";

export const uploadFile = (params: File) => {
  return http.post<common.File>(SINGLE_UPLOAD, params);
};

export const uploadFiles = (params: File[]) => {
  return http.post<common.Files>(MULTI_UPLOAD, params);
};
