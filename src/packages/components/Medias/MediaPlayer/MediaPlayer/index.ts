import { ConfigType, PackagesEnum, ChartFrameEnum } from "@/packages/index.d";
import { MediasCategoryEnum, MediasCategoryEnumName } from "../../index.d";

export const MediaPlayerConfig: ConfigType = {
  key: "MediaPlayer",
  chartKey: "VMediaPlayer",
  conKey: "VCMediaPlayer",
  title: "多媒体播放",
  category: MediasCategoryEnum.PLAYER, // 二级目录
  categoryName: MediasCategoryEnumName.PLAYER, //二级目录名字
  package: PackagesEnum.MEDIAS, //归属包名 MEDIA包
  chartFrame: ChartFrameEnum.COMMON,
  image: "videoPlayer.png"
};
