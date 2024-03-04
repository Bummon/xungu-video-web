// 公共类型
import { PublicConfigClass } from "@/packages/public";
// 公共类型
import { CreateComponentType } from "@/packages/index.d";
// 获取上面的 index 配置内容
import { Weather01Config } from "./index";

// 深拷贝
import cloneDeep from "lodash/cloneDeep";

import img from "@/assets/images/chart/decorates/weather01.png";
// 数据源
export const option = {
  // 图片路径
  dataset: img,
  url: ""
};
// 图表类  继承自公共样式 并且添加实现
export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Weather01Config.key;
  public chartConfig = cloneDeep(Weather01Config);
  public option = cloneDeep(option);
}
