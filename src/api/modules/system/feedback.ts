import http from "@/api";
import { TFeedback } from "@/api/interface/system/tFeedback";
import { FEEDBACK } from "@/api/config/servicePort";
import { ResPage } from "@/api/interface";

//获取意见反馈列表
export const getFeedbackList = (params: TFeedback.FeedBack) => {
  return http.post<TFeedback.FeedBack[]>(FEEDBACK + `/list`, params);
};

//分页查询意见反馈
export const getFeedbackPage = (params: TFeedback.FeedBack) => {
  return http.post<ResPage<TFeedback.FeedBack[]>>(FEEDBACK + `/page`, params);
};

//查询反馈详情
export const getFeedbackInfo = (feedbackId: number | bigint) => {
  return http.post<TFeedback.FeedBack>(FEEDBACK + `/info`, { id: feedbackId });
};

//新增反馈
export const addFeedback = (params: TFeedback.FeedBack) => {
  return http.post(FEEDBACK + `/add`, params);
};

//修改反馈
export const updateFeedback = (params: TFeedback.FeedBack) => {
  return http.post(FEEDBACK + `/edit`, params);
};

//删除反馈
export const deleteFeedback = (feedbackIds: number[] | bigint[]) => {
  return http.post(FEEDBACK + `/remove`, { ids: feedbackIds });
};
