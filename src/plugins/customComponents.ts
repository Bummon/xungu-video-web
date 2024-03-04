// 全局注册自定义组件  可以导出引用
import type { App } from "vue";
import { GoSkeleton } from "@/components/GoSkeleton";
import { diyLayoutLoading } from "@/components/diyLayoutLoading";
// 用于页面展示的缩放操作  固定插件
import { SketchRule } from "vue3-sketch-ruler";

/**
 * 全局注册自定义组件
 * @param app
 */
export function setupCustomComponents(app: App) {
  app.component("GoSkeleton", GoSkeleton);
  app.component("DiyLayoutLoading", diyLayoutLoading); //加载界面
  app.component("SketchRule", SketchRule);
}
