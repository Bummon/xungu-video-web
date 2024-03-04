// 处理数据
import { SourceTypeEnums } from "@/enums/sourceTypeEnums";
import { EquipmentControlHttp, reqSendCommand } from "@/api/modules/equipmentControl";
import { MeetSourceType } from "@/api/interface/source";
import { ResourceTypeHttp } from "@/api/modules/source/resourceType";

export interface terminalDataType {
  Matrix: any[];
  RecordingHost: any[];
  VideoTerminal: any[];
  VideoCamera: any[];
  AudioControl: any[];
  Power: any[];
}

export class MeetingControllerHandle {
  /**
   * 获取设备的清单   按资源类型分组
   * @param list
   */
  static async getTerminalList(list) {
    let typeList = (await ResourceTypeHttp.getResourceTypeList()).data;
    typeList = typeList.filter(item => item.preset === 0);
    // 过滤出 非默认类型
    console.log(typeList);
    let data: terminalDataType = {
      Matrix: [],
      RecordingHost: [],
      VideoTerminal: [],
      VideoCamera: [],
      AudioControl: [],
      Power: [],
      Other: []
    };
    let tmpList = [];
    typeList.forEach(type => {
      tmpList.push({ typeName: type.typeName, typeId: type.typeId, terminalList: [] });
    });
    if (!list || list.constructor !== Array) {
      return data;
    }
    list.forEach(item => {
      switch (item.resourceTypeId) {
        case SourceTypeEnums.Matrix.id:
          data.Matrix.push(item);
          break;
        case SourceTypeEnums.RecordingHost.id:
          data.RecordingHost.push(item);
          break;
        case SourceTypeEnums.VideoTerminal.id:
          data.VideoTerminal.push(item);
          break;
        case SourceTypeEnums.VideoCamera.id:
          data.VideoCamera.push(item);
          break;
        case SourceTypeEnums.AudioControl.id:
          data.AudioControl.push(item);
          break;
        case SourceTypeEnums.Power.id:
          data.Power.push(item);
          break;
        default:
          tmpList.forEach(tmp => {
            if (tmp.typeName === item.typeName) {
              tmp.terminalList.push(item);
            }
          });
          return;
      }
    });
    data.Other = tmpList;
    return data;
  }

  // 处理自定义类型数据
  handleOtherType() {}

  /**
   * 获取设备开关状态
   * @param activeAudio
   */
  static async getTerminalStatus(terminalId: number, roomIp: string) {
    return (await EquipmentControlHttp.getTerminalState(terminalId, roomIp)).data;
  }

  // 切换电源状态
  static async updateSwitchState(terminalId: number, roomIp: string, status: 2 | 1) {
    return new Promise((resolve, reject) => {
      EquipmentControlHttp.updateSwitchState(terminalId, roomIp, status)
        .then(async res => {
          let state = await MeetingControllerHandle.getTerminalStatus(terminalId, roomIp);
          resolve(state);
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  /**
   * 发送命令
   */
  static async sendCommand(ip, command: MeetSourceType.command) {
    return new Promise(async (resolve, reject) => {
      let params: reqSendCommand = { ...command, ip: ip };
      try {
        await EquipmentControlHttp.sendCommand(params);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
}
