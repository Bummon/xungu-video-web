import { ConfigType, PackagesEnum, ChartFrameEnum } from "@/packages/index.d";
import { DecoratesCategoryEnumName, DecoratesCategoryEnum } from "../../index.d";
export const Date01Config: ConfigType = {
  key: "Date01",
  chartKey: "VDate",
  conKey: "VCDate",
  title: "日期组件1",
  category: DecoratesCategoryEnum.DATE, // 二级目录
  categoryName: DecoratesCategoryEnumName.DATE, //二级目录名字
  package: PackagesEnum.DECORATES, //归属包名 MEDIA包
  chartFrame: ChartFrameEnum.COMMON,
  image: "date01.png"
};
