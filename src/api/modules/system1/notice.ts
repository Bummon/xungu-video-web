import http from "@/api";

const Email = "/control/controlNoticeEmail";
const Message = "/control/controlNoticeMessage";
const Send = "/control/controlNoticeSend";

export class noticeHttp {
  /**
   * 查询邮箱通知列表
   */
  static getEmail() {
    return http.post(Email + `/getList`, {}, { noLoading: true });
  }

  static addEmail(params: Partial<NoticeType.email>) {
    return http.post(Email + `/addRow`, params, { noLoading: true });
  }

  static updateEmail(params: Partial<NoticeType.email>) {
    return http.post(Email + `/updateRow`, params, { noLoading: true });
  }

  static deleteEmail(params: { ids: number[] }) {
    return http.post(Email + `/deleteRows`, params, { noLoading: true });
  }

  static changeEmailStatusById(params: { emailId: number | bigint; emailStatus: 0 | 1 }) {
    return http.post(Email + `/changeStatusById`, params, { noLoading: true });
  }

  /**************************************************************/
  /**
   * 查询邮箱通知列表
   */
  static getMessage() {
    return http.post(Message + `/getList`, {}, { noLoading: true });
  }

  static addMessage(params: Partial<NoticeType.message>) {
    return http.post(Message + `/addRow`, params, { noLoading: true });
  }

  static updateMessage(params: Partial<NoticeType.message>) {
    return http.post(Message + `/updateRow`, params, { noLoading: true });
  }

  static deleteMessage(params: { ids: number[] }) {
    return http.post(Message + `/deleteRows`, params, { noLoading: true });
  }

  static changeMessageStatusById(params: { messageId: number | bigint; messageStatus: 0 | 1 }) {
    return http.post(Message + `/changeStatusById`, params, { noLoading: true });
  }

  /************************************************************************************/
  /**
   * 查询 通知的发送方式 email 或短信
   */
  static getNoticeMode() {
    return http.post(Send + `/getList`, {}, { noLoading: true });
  }

  static addNoticeMode(params: Partial<NoticeType.noticeMode>) {
    return http.post(Send + `/addRow`, params, { noLoading: true });
  }

  static updateNoticeMode(params: Partial<NoticeType.noticeMode>) {
    return http.post(Send + `/updateRow`, params, { noLoading: true });
  }

  static deleteNoticeMode(params: { ids: [] }) {
    return http.post(Send + `/deleteRows`, params, { noLoading: true });
  }
}

export namespace NoticeType {
  export interface email {
    authorizeCode: string; // 邮件授权码
    emailId: bigint | number; // id
    emailName: string; // 邮箱名字
    emailStatus: 0 | 1; // 是否启用
    serverAddress: string; // 服务器地址
    serverPort: number; // 服务器端口
  }

  export interface message {
    accessKey: string; // 邮件授权码
    accessKeySecret: string; // id
    messageStatus: 0 | 1; // 是否启用s
    signature: string; // 短信签名
    templateId: string; // 模板编号
    messageId: number | bigint; // id
  }

  export interface noticeMode {
    startTime: string; //	开始时间	string(date-time)
    endTime: string; // 	结束时间	string(date-time)
    isCustom: 0 | 1; //	是否自定义时间	integer(int32)
    sendId: bigint | number; //发送通知id	integer(int64)
    sendStatus: 0 | 1; //	状态0禁用1启用
    type: 0 | 1; //	类型0邮件1短信	integer(int32)
  }
}
