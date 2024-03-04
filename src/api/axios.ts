import axios, { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { ResultEnum } from "@/enums/httpEnum";
import { ErrorPageNameMap } from "@/enums/pageEnum";
import { redirectErrorPage } from "@/utils";
import { ResultData } from "@/api/interface";

/**
 * axios请求 只有拦截器 没有登录转圈等
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL2
});

axiosInstance.interceptors.request.use(
  // 注：axios 1.4之后的版本 原先的axiosRequestConfig类型已经被弃用，需要换成现在这个
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosRequestConfig) => {
    Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const { code } = res.data as ResultData<any>;
    if (code === undefined || code === null) return Promise.resolve(res.data);
    if (code === ResultEnum.DATA_SUCCESS) return Promise.resolve(res.data);
    // 重定向
    if (ErrorPageNameMap.get(code)) redirectErrorPage(code);
    return Promise.resolve(res.data);
  },
  (err: AxiosResponse) => {
    Promise.reject(err);
  }
);

export default axiosInstance;
