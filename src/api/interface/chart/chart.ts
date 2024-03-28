export namespace Chart {
  export interface MeetingNumCount {
    meetingCount: number | bigint;
    dailyMeetingCount: number | bigint;
    meetingDurationCount: number | bigint;
    dailyMeetingDurationCount: number | bigint;
  }

  export interface DailyNumCount {
    dailyMeetingCount: Chart.DailyCount[] | [];
    dailyMeetingDurationCount: Chart.DailyCount[] | [];
  }

  export interface DailyCount {
    date: string;
    count: number;
  }

  export interface ComplexCount {
    meetingTotalCount: number;
    durationDistribution: Chart.DurationDistribution;
    deptDistribution: Chart.DeptDistribution[] | [];
  }

  export interface DurationDistribution {
    zeroToFifteenCount: number;
    fifteenToThirtyCount: number;
    thirtyToFortyFiveCount: number;
    fortyFiveToSixtyCount: number;
    sixtyPlusCount: number;
  }

  export interface DeptDistribution {
    deptName: string;
    count: number;
  }
}
