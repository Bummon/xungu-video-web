import { ConfigType, PackagesEnum, ChartFrameEnum } from "@/packages/index.d";
import { InformationCategoryEnumName, InformationCategoryEnum } from "@/packages/components/Informations/index.d";

export const TextBarrageConfig: ConfigType = {
  key: "TextBarrage",
  chartKey: "VTextBarrage",
  conKey: "VCTextBarrage",
  title: "滚动文字",
  category: InformationCategoryEnum.TEXT,
  categoryName: InformationCategoryEnumName.TEXT,
  package: PackagesEnum.INFORMATIONS, // 父包 information
  chartFrame: ChartFrameEnum.COMMON,
  image: "text_barrage.png"
};
