import { ConfigType, PackagesEnum, ChartFrameEnum } from "@/packages/index.d";
import { InformationCategoryEnumName, InformationCategoryEnum } from "@/packages/components/Informations/index.d";

export const TextCommonConfig: ConfigType = {
  key: "TextCommon",
  chartKey: "VTextCommon",
  conKey: "VCTextCommon",
  title: "文字",
  category: InformationCategoryEnum.TEXT,
  categoryName: InformationCategoryEnumName.TEXT,
  package: PackagesEnum.INFORMATIONS, // 父包 information
  chartFrame: ChartFrameEnum.COMMON,
  image: "text_static.png"
};
