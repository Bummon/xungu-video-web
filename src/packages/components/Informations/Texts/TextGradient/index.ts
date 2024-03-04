import { ConfigType, PackagesEnum, ChartFrameEnum } from "@/packages/index.d";
import { InformationCategoryEnumName, InformationCategoryEnum } from "@/packages/components/Informations/index.d";

export const TextGradientConfig: ConfigType = {
  key: "TextGradient",
  chartKey: "VTextGradient",
  conKey: "VCTextGradient",
  title: "渐变文字",
  category: InformationCategoryEnum.TEXT,
  categoryName: InformationCategoryEnumName.TEXT,
  package: PackagesEnum.INFORMATIONS, // 父包 information
  chartFrame: ChartFrameEnum.NAIVE_UI,
  image: "text_gradient.png"
};
