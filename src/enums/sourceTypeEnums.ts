// export enum SourceTypeEnums {
//   Matrix = {
//     id: 6222102838213,
//     name: "矩阵"
//   },
//   AudioControl = {
//     id: 6222108386629,
//     name: "音频处理器"
//   },
//   VideoCamera = {
//     id: 6223295141573,
//     name: "摄像机"
//   },
//   VideoTerminal = {
//     id: 6256713292997,
//     name: "视频会议终端"
//   },
//   Power = {
//     id: 6222105722437,
//     name: "时序电源"
//   },
//   RecordingHost = {
//     id: 6222106965317,
//     name: "会议录播主机"
//   }
// }
const SourceTypeEnums = {
  Matrix: {
    id: 6222102838213,
    name: "矩阵"
  },
  AudioControl: {
    id: 6222108386629,
    name: "音频处理器"
  },
  VideoCamera: {
    id: 6223295141573,
    name: "摄像机"
  },
  VideoTerminal: {
    id: 6256713292997,
    name: "视频会议终端"
  },
  Power: {
    id: 6222105722437,
    name: "时序电源"
  },
  RecordingHost: {
    id: 6222106965317,
    name: "会议录播主机"
  }
} as const;

export type SourceType = keyof typeof SourceTypeEnums;

export { SourceTypeEnums };

export const sourceTypeIdEnum = [
  SourceTypeEnums.RecordingHost.id,
  SourceTypeEnums.Power.id,
  SourceTypeEnums.VideoTerminal.id,
  SourceTypeEnums.VideoCamera.id,
  SourceTypeEnums.AudioControl.id,
  SourceTypeEnums.Matrix.id
];
