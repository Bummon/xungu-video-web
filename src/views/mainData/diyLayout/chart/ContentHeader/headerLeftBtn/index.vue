<template>
  <n-space class="header-left-btn" :size="25">
    <n-space>
      <!-- 是否展示模块按钮 开关键 -->
      <n-tooltip v-for="item in btnList" :key="item.key" placement="bottom" trigger="hover">
        <template #trigger>
          <n-button ghost :type="styleHandle(item)" :focusable="false" @click="clickHandle(item)">
            <component :is="item.icon"></component>
            <span style="margin-left: 0.5em">{{ item.title }}</span>
          </n-button>
        </template>
      </n-tooltip>

      <n-divider vertical />

      <!-- 历史记录按钮 -->
      <n-tooltip v-for="item in historyList" :key="item.key" placement="bottom" trigger="hover">
        <template #trigger>
          <n-button ghost type="primary" :disabled="!item.select" @click="clickHistoryHandle(item)">
            <component :is="item.icon"></component>
            <span style="margin-left: 0.5em">{{ item.title }}</span>
          </n-button>
        </template>
      </n-tooltip>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { toRefs, Ref, reactive, computed } from "vue";
import { renderIcon, XGDialog, goHome } from "@/utils";
import { icon } from "@/plugins";
import { useRemoveKeyboard } from "../../hooks/useKeyboard.hook";

import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";

import { useChartHistoryStore } from "@/stores/modules/chartHistoryStore/chartHistoryStore";
import { HistoryStackEnum } from "@/stores/modules/chartHistoryStore/chartHistoryStore.d";

import { useChartLayoutStore } from "@/stores/modules/chartLayoutStore/chartLayoutStore";
import { ChartLayoutStoreEnum } from "@/stores/modules/chartLayoutStore/chartLayoutStore.d";

const { LayersIcon, BarChartIcon, PrismIcon, HomeIcon, ArrowBackIcon, ArrowForwardIcon } = icon.ionicons5;
const { setItem } = useChartLayoutStore();
const { getLayers, getCharts, getDetails } = toRefs(useChartLayoutStore());
const chartEditStore = useChartEditStore();
const chartHistoryStore = useChartHistoryStore();

interface ItemType<T> {
  key: T;
  select: Ref<boolean> | boolean;
  title: string;
  icon: any;
}

const btnList = reactive<ItemType<ChartLayoutStoreEnum>[]>([
  {
    key: ChartLayoutStoreEnum.CHARTS,
    select: getCharts,
    title: "组件库",
    icon: renderIcon(BarChartIcon)
  },
  {
    key: ChartLayoutStoreEnum.LAYERS,
    select: getLayers,
    title: "图层项",
    icon: renderIcon(LayersIcon)
  },
  {
    key: ChartLayoutStoreEnum.DETAILS,
    select: getDetails,
    title: "详情设置",
    icon: renderIcon(PrismIcon)
  }
]);

const isBackStack = computed(() => chartHistoryStore.getBackStack.length > 1);

const isForwardStack = computed(() => chartHistoryStore.getForwardStack.length > 0);

const historyList = reactive<ItemType<HistoryStackEnum>[]>([
  {
    key: HistoryStackEnum.BACK_STACK,
    // 一定会有初始化画布
    select: isBackStack,
    title: "后退",
    icon: renderIcon(ArrowBackIcon)
  },
  {
    key: HistoryStackEnum.FORWARD_STACK,
    select: isForwardStack,
    title: "前进",
    icon: renderIcon(ArrowForwardIcon)
  }
]);

// store 描述的是展示的值，所以和 ContentConfigurations 的 collapsed 是相反的
const styleHandle = (
  item: ItemType<ChartLayoutStoreEnum>
): "default" | "tertiary" | "primary" | "success" | "info" | "warning" | "error" => {
  if (item.key === ChartLayoutStoreEnum.DETAILS) {
    return item.select ? "default" : "primary";
  }
  return item.select ? "primary" : "default";
};

// 布局处理
const clickHandle = (item: ItemType<ChartLayoutStoreEnum>) => {
  // 三个按钮  第一个选项栏  第三个是细节配置项
  setItem(item.key, !item.select);
};

// 历史记录处理
const clickHistoryHandle = (item: ItemType<HistoryStackEnum>) => {
  switch (item.key) {
    case HistoryStackEnum.BACK_STACK:
      chartEditStore.setBack();
      break;
    case HistoryStackEnum.FORWARD_STACK:
      chartEditStore.setForward();
      break;
  }
};
</script>
<style lang="scss" scoped>
.header-left-btn {
  margin-left: -37px;
}
</style>
