export namespace TFeedback {
  export interface FeedBack {
    feedbackId: number | bigint;
    feedbackName: string;
    feedbackContent: string;
    createUserId?: number | bigint;
    createUsername?: string;
    createTime?: string;
    modifyUserId: number | bigint;
    modifyUsername: string;
    modifyTime?: string;
  }
}
