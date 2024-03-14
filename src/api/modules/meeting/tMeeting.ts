import http from "@/api";
import { TMeeting } from "@/api/interface/meeting/tMeeting";
import { MEETING } from "@/api/config/servicePort";
import { ResPage } from "@/api/interface";

export const getMeetingList = (params: TMeeting.Meeting) => {
  return http.post<TMeeting.Meeting[]>(MEETING + `/list`, params);
};

export const getMeetingPage = (params: TMeeting.Meeting) => {
  return http.post<ResPage<TMeeting.Meeting[]>>(MEETING + `/page`, params);
};

export const getMeetingInfo = (meetId: number | bigint) => {
  return http.post<TMeeting.Meeting>(MEETING + `/info`, { id: meetId });
};

export const deleteMeeting = (meetIds: number[] | bigint[]) => {
  return http.post(MEETING + `/remove`, { ids: meetIds });
};
