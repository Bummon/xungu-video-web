import { ConfigType, PackagesEnum, ChartFrameEnum } from "@/packages/index.d";
import { PhotosCategoryEnumName, PhotosCategoryEnum } from "@/packages/components/Photos/index.d";
export const Image01Config: ConfigType = {
  key: "Image01",
  chartKey: "VImage",
  conKey: "VCImage",
  title: "图片组件1",
  category: PhotosCategoryEnum.SHARE, // 二级目录
  categoryName: PhotosCategoryEnumName.SHARE, //二级目录名字
  package: PackagesEnum.PHOTOS, //归属包名 MEDIA包
  chartFrame: ChartFrameEnum.COMMON,
  image: "upload.png"
};
