import { ConfigType, PackagesEnum, ChartFrameEnum } from "@/packages/index.d";
import { DecoratesCategoryEnumName, DecoratesCategoryEnum } from "../../index.d";
export const Weather01Config: ConfigType = {
  key: "Weather01",
  chartKey: "VWeather",
  conKey: "VCWeather",
  title: "天气组件1",
  category: DecoratesCategoryEnum.WEATHER, // 二级目录
  categoryName: DecoratesCategoryEnumName.WEATHER, //二级目录名字
  package: PackagesEnum.DECORATES, //归属包名 MEDIA包
  chartFrame: ChartFrameEnum.COMMON,
  image: "weather01.png"
};
