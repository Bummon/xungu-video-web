import http from "@/api";
import { MeetSourceType } from "@/api/interface/source";

const URL = "/control/";

export class EquipmentControlHttp {
  static sendCommand(params: reqSendCommand) {
    return http.post(URL + "tcpSend", params, { noLoading: true });
  }

  /**
   * 查询某一个矩阵的关联通道
   * @param params
   */
  static getMatrixStatus(params: reqMatrixStatus) {
    return http.post(URL + "getMatrixTypes", params, { noLoading: true });
  }

  /**
   * 查询 矩阵的输入通道列表
   */
  static getMatrixInputChannel(params: Partial<reqMatrixChannel>) {
    return http.post(URL + "controlTerminalMatrix/getList", params, { noLoading: true });
  }

  /**
   * 修改矩阵通道绑定关系
   */
  static updateMatrix(params: updateMatrixChannelBind) {
    return http.post(URL + "updateMatrix", params, { noLoading: true });
  }

  /**
   * 全部修改
   * @param params
   */
  static updateMatrixRow(params: any[]) {
    return http.post(URL + "controlTerminalMatrix/updateRow", { controlTerminalMatrixBo: params }, { noLoading: true });
  }

  /****************************************************/
  /**
   * 音频处理器
   */
  static getAudioVolume(params: reqAudioControl) {
    return http.post(URL + "getAudioVolume", params, { noLoading: true });
  }

  /**
   * 全部静音 全部解除静音
   */

  static setAllMute(params: { ip: string; modelId: bigint | number; type: string; upOrDown: string }) {
    return http.post(URL + "totalVolumeQuiet", params, { noLoading: true });
  }

  /**
   *
   * 增减 音量 （音频控制器）
   *
   */

  static updateVolume(params: { ip: string; modelId: number | bigint; number: string; type: string; volumeValue: number }) {
    return http.post(URL + "updateVolume", params, { noLoading: true });
  }

  /**
   * 设置单独某个通道的静音效果
   * @param params
   */
  static volumeQuiet(params: { ip: string; modelId: number | bigint; number: number; type: number; upOrDown: 0 | 1 }) {
    return http.post(URL + "volumeQuiet", params, { noLoading: true });
  }

  /**
   * 获取设备开关状态
   * @param id
   * @param ip
   */
  static getTerminalState(id: number, ip: string) {
    return http.post("/control/getSwitchState", { ip: ip, terminalId: id }, { noLoading: true });
  }

  /**
   *
   * @param id
   * @param ip
   * @param status
   */
  static updateSwitchState(id: number, ip: string, status: 2 | 1) {
    return http.post("/control/updateSwitchState", { ip: ip, terminalId: id, status: status }, { noLoading: true });
  }
}

export interface reqMatrixChannel {
  name: string;
  number: number;
  terminalId: bigint | number;
  type: 2 | 1; // 	1入 2出
}

export interface updateMatrixChannelBind {
  enterNumber: number | string; // 输入通道
  goOutNumbers: number[]; // 输出通道
  ip: string;
  modelId: number | bigint;
}

/**
 * 查询音频的参数
 */
export interface reqAudioControl {
  ip: string;
  modelId: bigint | number;
  volumeList: {
    commandType: string;
    number: string;
    type: string;
  }[];
}

// 发送命令的接口
export interface reqSendCommand extends MeetSourceType.command {
  ip: string; // ip
}

interface reqMatrixStatus {
  ip: string;
  modelId: number | bigint;
  number: string;
}
