//获取周开始结束时间
import dayjs, { Dayjs } from "dayjs";

export const getStartAndEndOfWeek = (): { startTime: Dayjs; endTime: Dayjs } => {
  const now = dayjs();
  // 获取本周的开始和结束时间（假设周一为每周的第一天）
  const weekStart = now.subtract(now.day() - 1, "day").startOf("day");
  const weekEnd = weekStart.add(6, "day").endOf("day");
  return {
    startTime: weekStart,
    endTime: weekEnd
  };
};
// 获取本月的开始和结束时间
export const getStartAndEndOfMonth = (): { startTime: Dayjs; endTime: Dayjs } => {
  const now = dayjs();
  const monthStart = now.startOf("month");
  const monthEnd = now.endOf("month");
  return {
    startTime: monthStart,
    endTime: monthEnd
  };
};
// 获取本年的开始和结束时间
export const getStartAndEndOfYear = (): { startTime: Dayjs; endTime: Dayjs } => {
  const now = dayjs();
  const yearStart = now.startOf("year");
  const yearEnd = now.endOf("year");
  return {
    startTime: yearStart,
    endTime: yearEnd
  };
};
