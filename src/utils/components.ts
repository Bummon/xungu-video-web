import { defineAsyncComponent, AsyncComponentLoader } from "vue";
import { AsyncLoading, AsyncSkeletonLoading } from "@/components/diyLayoutLoading";

/**
 * * 动态注册组件
 */
export const componentInstall = <T>(key: string, node: T) => {
  console.log("动态注册组件", key, node);
  if (!window["$vue"].component(key) && node) {
    window["$vue"].component(key, node);
    console.log(window["$vue"]);
  }
};

/**
 * * 异步加载组件
 * @param loader
 * @returns
 */
export const loadAsyncComponent = (loader: AsyncComponentLoader) =>
  defineAsyncComponent({
    loader,
    loadingComponent: AsyncLoading, //加载图
    delay: 2
  });

export const loadSkeletonAsyncComponent = (loader: AsyncComponentLoader) =>
  defineAsyncComponent({
    loader,
    loadingComponent: AsyncSkeletonLoading,
    delay: 20
  });
