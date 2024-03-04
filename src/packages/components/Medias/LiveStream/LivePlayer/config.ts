// 公共类型
import { PublicConfigClass } from "@/packages/public";
// 公共类型
import { CreateComponentType } from "@/packages/index.d";
// 获取上面的 index 配置内容
import { LivePlayerConfig } from "./index";

// 深拷贝
import cloneDeep from "lodash/cloneDeep";

import img from "@/assets/images/chart/medias/liveStream.png";
// 数据源
export const option = {
  // 图片路径
  dataset: img,
  url: ""
};
// 图表类  继承自公共样式 并且添加实现
export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = LivePlayerConfig.key;
  public chartConfig = cloneDeep(LivePlayerConfig);
  public option = cloneDeep(option);
}
