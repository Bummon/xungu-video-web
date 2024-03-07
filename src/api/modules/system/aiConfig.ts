import http from "@/api";
import { ResPage } from "@/api/interface";
import { sysAiConfig } from "@/api/interface/system/sysAiConfig";
import { AI_CONFIG } from "@/api/config/servicePort";

export const getAiConfigList = (params: sysAiConfig.AiConfig) => {
  return http.post<sysAiConfig.AiConfig[]>(AI_CONFIG + `/list`, params);
};

export const getAiConfigPage = (params: sysAiConfig.AiConfig) => {
  return http.post<ResPage<sysAiConfig.AiConfig[]>>(AI_CONFIG + `/page`, params);
};

export const getAiConfigInfo = (aiId: number | bigint) => {
  return http.post<sysAiConfig.AiConfig>(AI_CONFIG + `/info`, { id: aiId });
};

export const addAiConfig = (params: sysAiConfig.AiConfig) => {
  return http.post(AI_CONFIG + `/add`, params);
};

export const updateAiConfig = (params: sysAiConfig.AiConfig) => {
  return http.post(AI_CONFIG + `/edit`, params);
};

export const deleteAiConfig = (aiIds: number[] | bigint[]) => {
  return http.post(AI_CONFIG + `/remove`, { ids: aiIds });
};

export const changeAiConfigStatus = (params: { aiId: number | bigint; enabled: number }) => {
  return http.post(AI_CONFIG + `/changeStatus`, params);
};
