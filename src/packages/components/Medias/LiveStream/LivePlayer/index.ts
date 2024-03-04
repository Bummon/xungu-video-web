import { ConfigType, PackagesEnum, ChartFrameEnum } from "@/packages/index.d";
import { MediasCategoryEnum, MediasCategoryEnumName } from "../../index.d";

export const LivePlayerConfig: ConfigType = {
  key: "LivePlayer", // 当前的目录
  chartKey: "VLivePlayer", // 画布组件 key
  conKey: "VCLivePlayer", // 右侧设置面板组件 key
  title: "直播播放",
  category: MediasCategoryEnum.LIVE, // 二级目录
  categoryName: MediasCategoryEnumName.LIVE, //二级目录名字
  package: PackagesEnum.MEDIAS, //归属包名 MEDIA包
  chartFrame: ChartFrameEnum.COMMON, // 归类 可选参数
  image: "liveStream.png" // 预览图
};
