/*
 ************************************   会议资源的接口   *************************************
 */
import { ReqPage } from "@/api/interface";
import AudioControl from "@/views/meetingController/components/audioControl.vue";
import RecordingHost from "@/views/meetingController/components/recordingHost.vue";

export namespace MeetSourceType {
  /** 功能
   * @description 功能的数据
   * @property {bigint} functionId 功能的id
   * @property {string} functionName 功能名称
   * @property {0|1}    functionStatus 功能状态 0禁用1启用
   * @property {string} functionDescr 描述
   * @property {string} createTime 创建时间
   * @property {bigint | number} createUserId 创建者的id
   * @property {string} createUserName 创建者的名字
   * @property {string} modifyTime 最后修改时间
   * @property {bigint | number} modifyUserId 修改者的id
   * @property {string} modifyUserName 修改者的名字
   * */
  export interface functionData {
    functionId: bigint | number;
    functionName: string;
    functionStatus: 0 | 1;
    functionDescr: string;
    createTime: string;
    createUserId: bigint | number;
    createUserName: string;
    modifyTime: string;
    modifyUserId?: bigint | number;
    modifyUserName?: string;
  }

  /**
   * 型号
   * @description 这是每一个型号的详细数据
   * @author 党亚南-20230713
   * @property {bigint | number} id 型号的id
   * @property {string} name 型号的名称
   * @property {bigint | number} brandId 从属品牌的ID
   * @property {bigint | number} protocolId 绑定的协议的ID
   * @property {functionData.functionId[]}  functions: ;
   */
  export interface model {
    modelId: bigint;
    modelName: string;
    brandId: bigint;
    functionIds: bigint[];
    protocolId: bigint | number;
  }

  /**
   * 品牌
   * @author 党亚南
   * @property {bigint} brandId 品牌ID
   * @property {string} brandName 品牌名称
   * @property {0|1} brandStatus 品牌的启用停用状态
   * @property {string} createTime 创建时间
   * @property {bigint} createUserId 创建者的id
   * @property {string} createUserName 创建者的名字
   * @property {string} modifyTime 最后修改时间
   * @property {bigint} modifyUserId 修改者的id
   * @property {string} modifyUserName 修改者的名字
   */
  export interface brand {
    children?: any[];
    brandId: bigint;
    brandName: string;
    brandStatus: 0 | 1;
    createTime: string;
    createUserId: bigint;
    createUserName: string;
    modifyTime: string;
    modifyUserId?: bigint;
    modifyUserName?: string;
    modelId?: number | bigint; //过度数据
    modelName?: string; // 过度数据
  }

  /**
   * 资源类型
   * @property {bigint} typeId 资源类型的id
   * @property {string} functionName 资源类型名称
   * @property {0|1}    typeStatus 功能状态 0禁用1启用
   * @property {string} createTime 创建时间
   * @property {bigint} createUserId 创建者的id
   * @property {string} createUserName 创建者的名字
   * @property {string} modifyTime 最后修改时间
   * @property {bigint} modifyUserId 修改者的id
   * @property {string} modifyUserName 修改者的名字
   */
  export interface resourceType {
    typeId: bigint;
    typeName: string;
    typeDescr: string;
    typeStatus: 0 | 1;
    createTime: string;
    createUserId?: bigint;
    createUserName?: string;
    modifyTime?: string;
    modifyUserId?: bigint;
    modifyUserName?: string;
    preset: 0 | 1; // 1 是内置 0 是非内置
  }

  export interface ReqModelList extends ReqPage {
    brandId?: bigint;
  }

  /**
     * 终端设备
     * @property {string} areaName    区域
     * @property {bigint} brandId 品牌ID
     * @property {string} createTime 创建时间
     * @property {bigint} functionId 功能Id数组
     * @property {string | null} imageUrl 图标地址

     * @property {string} location    位置
     * @property {bigint} manageJobId    管理岗位
     * @property {bigint} modelId    型号id
     * @property {number} port    端口
     * @property {number} price    价格
     * @property {string} protocol    协议
     * @property {number} resourceTypeId    资源类型
     * @property {number} roomId  会议室id
     * @property {string} roomName        会议室名称
     * @property {0|1} roomStatus         会议室状态0禁用1启用
     * @property {0|1} terminalStatus     设备状态0禁用1启用
     * @property {0|1|2} runningStatus    启用时 0 故障 1 在线 禁用 2 离线
     * @property {string} sellByDate      质保期
     * @property {string} supplierName     供应商名称
     * @property {string} telephone       联系方式
     * @property {string} terminalDescr   说明
     * @property {bigint} terminalId      主键id
     * @property {string} terminalName    设备名称
     * @property {string} terminalLabel   资产标签
     * @property {string} typeName        资源类型名称
     * @property {string}    ip           ip地址  摄像机 录播主机 视频终端共用
     * @property {string}    cameraUrl    摄像机流地址;
     * @property {string}    rtsp         录播主机的rtsp流列表;
     * @property {string}    account      视频会议终端 账号
     * @property {string}    password     视频会议终端 密码
     */
  export interface terminal {
    modelList?: number[] | []; //数据中转使用
    brandId: number;
    files: any[];
    functionId: number;
    imageUrl: string | null;
    ip: string;
    labels: string[];
    manageJobId: number;
    modelId: number;
    port: number;
    price: number;
    protocol: string;
    resourceTypeId: number;
    roomId: number;
    roomStatus: 0 | 1;
    runningStatus: 0 | 1 | 2;
    terminalStatus: 0 | 1;
    sellByDate: string;
    supplierName: string;
    telephone: string;
    terminalDescr: string;
    terminalId: number;
    terminalName: string;
    terminalLabel: string;
    typeName: string;
    areaName: string;
    location: string;
    createTime: string;
    roomName: string | null;
    jobName: string | null;
    empName: string | null;
    empId: number;
    cameraUrl: string | null;
    rtsp?: string;
    account?: string; // 视频会议终端 账号
    password?: string; // 视频会议终端 密码
    matrixSpecification?: 9 | 18 | 36; // 矩阵类型
    commandVos: any[]; // 命令集合
    controlTerminalSwitchBo: powerControl[];
  }

  type powerControl = {
    number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    terminalIdBind: number;
  };

  /**
   * 命令数据
   * @property {bigint} commandId 命令Id
   * @property {string} commandName 命令名称
   * @property {number} commandCode 命令编号
   * @property {string} commandContext 命令内容
   * @property {string} commandDescr 命令描述
   * @property {string} commandFormat 命令格式
   * @property {string} modelIds 型号集
   * @property {string} equipmentCode 设备编号
   */
  export interface command {
    commandId: bigint;
    commandName: string;
    commandCode?: number; //命令编号
    commandContext?: string; //	命令内容
    commandDescr: string; //	描述
    commandFormat: string; //	命令格式
    equipmentCode: string; //设备编号  不知道干啥的
    modelIds: bigint[]; //	型号id集合
    modelList?: any[]; // 中转数据 接口中不体现
    modelNames: string[]; // 型号名字列表
  }

  /**
   * 协议
   * @property {number|bigint} protocolId
   * @property {string}        protocolName   协议名称
   * @property {string}        interfaceCode  接口编号
   * @property {string}        interfaceType  接口类别
   * @property {string}        ipPort         目标IP及端口
   * @property {string}        serialBps      串口波特率
   * @property {string}        serialCheck    串口校验
   * @property {string}        serialStop     串口停止位
   * @property {string}        protocolCode   协议编号
   *
   */
  export interface protocol {
    createTime: string;
    createUserId: bigint;
    createUserName: string;
    deletedFlag: 0 | 1;
    equipmentDescr: string;
    protocolId: bigint;
    protocolName: string;
    interfaceCode: string;
    interfaceType: string;
    ipPort: string;
    modifyTime: string;
    modifyUserId: bigint;
    modifyUserName: string;
    serialBps: string;
    serialCheck: string;
    serialStop: string;
    protocolCode: string;
  }

  /**
     * 新增协议是的可选项
     *@property {string[]}  interfaceCodes  接口编号
     *@property {string[]}  interfaceTypes  接口类型
     *@property {string[]}  serialBps       波特率
     *@property {string[]}  serialChecks    波特校验
     *@property {string[]}  serialStops     波特停止位

     *
     */
  export interface protocolOptions {
    interfaceCodes: string[];
    interfaceTypes: string[];
    serialBps: string[];
    serialChecks: string[];
    serialStops: string[];
  }
}

/**
 * @param Power         时序电源
 * @param Matrix        矩阵
 * @param RecordingHost  会议录播系统
 * @param AudioControl  音频处理器
 * @param VideoCamera   摄像机
 * @param VideoTerminal 视频终端
 */
export enum SourceTypeEnum {
  Power = 6222105722437,
  Matrix = 6222102838213,
  RecordingHost = 6222106965317,
  AudioControl = 6222108386629,
  VideoCamera = 6223295141573,
  VideoTerminal = 6256713292997
}
