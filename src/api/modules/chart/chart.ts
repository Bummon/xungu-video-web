import http from "@/api";
import { CHART } from "@/api/config/servicePort";
import { Chart } from "@/api/interface/chart/chart";

// 数据一览数量统计
export const getMeetingNumCount = (params: { startTime: string; endTime: string }) => {
  return http.post<Chart.MeetingNumCount>(CHART + `/count`, params);
};

// 数据一览每日统计
export const getDailyMeetingNumCount = (params: { startTime: string; endTime: string }) => {
  return http.post<Chart.DailyNumCount>(CHART + `/dailyCount`, params);
};

// 数据一览每月统计（年度）
export const getYearMeetingNumCount = (params: { startTime: string; endTime: string }) => {
  return http.post<Chart.DailyNumCount>(CHART + `/year/dailyCount`, params);
};

//数据一览环形图统计
export const getComplexCount = (params: { startTime: string; endTime: string }) => {
  return http.post<Chart.ComplexCount>(CHART + `/complexCount`, params);
};
