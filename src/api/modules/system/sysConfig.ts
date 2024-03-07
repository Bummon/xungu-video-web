import http from "@/api";
import { SYS_CONFIG } from "@/api/config/servicePort";
import { sysConfig } from "@/api/interface/system/sysConfig";

export const getConfigInfo = () => {
  return http.post<sysConfig.Config>(SYS_CONFIG + `/info`);
};

export const updateConfig = (params: sysConfig.Config) => {
  return http.post(SYS_CONFIG + `/edit`, params);
};
