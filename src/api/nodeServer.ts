import axios, { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { ContentTypeEnum, RequestHttpEnum, ResultEnum } from "@/enums/httpEnum";
import { ErrorPageNameMap } from "@/enums/pageEnum";
import { redirectErrorPage } from "@/utils";
import { ResultData } from "@/api/interface";

const nodeBaseURLHttp = window.location.protocol + "//" + window.location.hostname + ":8777";
// const nodeBaseURLHttps = "http://192.168.1.89:8777/";
const nodeBaseURLWs = "ws://" + window.location.hostname + ":8777/";
export { nodeBaseURLHttp, nodeBaseURLWs };
/**
 * axios请求 只有拦截器 没有登录转圈等
 */
const nodeServer = axios.create({
  // baseURL: import.meta.env.VITE_NODE_HTTP
  baseURL: nodeBaseURLHttp
});

nodeServer.interceptors.request.use(
  // 注：axios 1.4之后的版本 原先的axiosRequestConfig类型已经被弃用，需要换成现在这个
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosRequestConfig) => {
    Promise.reject(error);
  }
);

// 响应拦截器
nodeServer.interceptors.response.use(
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

const post = <T>(url: string, data?: T, headersType?: string) => {
  return nodeServer({
    url: url,
    method: RequestHttpEnum.POST,
    data: data,
    headers: {
      "Content-Type": headersType || ContentTypeEnum.JSON
    }
  });
};
const get = (url: string, params?: object) => {
  return nodeServer({
    url: url,
    method: RequestHttpEnum.GET,
    params: params
  });
};

const $node = {
  [RequestHttpEnum.GET]: get,
  [RequestHttpEnum.POST]: post
};
export default $node;
