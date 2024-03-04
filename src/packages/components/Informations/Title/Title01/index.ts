import { ConfigType, PackagesEnum, ChartFrameEnum } from "@/packages/index.d";
import { InformationCategoryEnum, InformationCategoryEnumName } from "@/packages/components/Informations/index.d";

export const Title01Config: ConfigType = {
  key: "Title01",
  chartKey: "VDecorates06",
  conKey: "VCDecorates06",
  title: "标题带边框",
  category: InformationCategoryEnum.TITLE,
  categoryName: InformationCategoryEnumName.TITLE,
  package: PackagesEnum.INFORMATIONS,
  chartFrame: ChartFrameEnum.STATIC,
  image: "decorates06.png"
};
