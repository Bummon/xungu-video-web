// 公共类型
import { PublicConfigClass } from "@/packages/public";
// 公共类型
import { CreateComponentType } from "@/packages/index.d";
// 获取上面的 index 配置内容
import { Image01Config } from "./index";

// 深拷贝
import cloneDeep from "lodash/cloneDeep";

import img from "@/assets/images/chart/photos/upload.png";
// 数据源
export const option = {
  // 图片路径
  dataset: null
};
// 图表类  继承自公共样式 并且添加实现
export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Image01Config.key;
  public chartConfig = cloneDeep(Image01Config);
  public option = cloneDeep(option);
}
