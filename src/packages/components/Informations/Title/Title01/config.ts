import { PublicConfigClass } from "@/packages/public";
import { chartInitConfig } from "@/settings/designSetting";
import { CreateComponentType } from "@/packages/index.d";
import { Title01Config } from "./index";
import cloneDeep from "lodash/cloneDeep";

export const option = {
  colors: ["#1DC1F533", "#1DC1F5FF"],
  dataset: "我是标题",
  textColor: "#fff",
  textSize: 32
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Title01Config.key;
  public attr = { ...chartInitConfig, w: 500, h: 90, zIndex: 1 };
  public chartConfig = cloneDeep(Title01Config);
  public option = cloneDeep(option);
}
