import type { App } from "vue";
import diyLayoutLoading from "./index.vue";
import AsyncLoading from "./index.vue";
import AsyncSkeletonLoading from "./LoadingSkeleton.vue";

// 正常组件
export { diyLayoutLoading };

// 异步
AsyncLoading.install = (app: App): void => {
  app.component("AsyncLoading", AsyncLoading);
};

AsyncSkeletonLoading.install = (app: App): void => {
  app.component("AsyncSkeletonLoading", AsyncSkeletonLoading);
};
export { AsyncLoading, AsyncSkeletonLoading };
