export namespace TMeeting {
  export interface Meeting {
    meetId: number | bigint;
    meetCode: string;
    meetName: string;
    meetStartTime: string;
    meetEndTime: string;
    meetActualTime: string;
    meetDelayTime: string;
    meetDuration: number | bigint;
    meetUrl: string;
    meetPassword: string;
    meetStatus: number;
    remark?: string;
    createUserId?: number | bigint;
    createUsername?: string;
    createTime?: string;
    modifyUserId?: number | bigint;
    modifyUsername?: string;
    modifyTime?: string;
  }
}
