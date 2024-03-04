<template>
  <n-layout has-sider sider-placement="right">
    <n-layout-content>
      <!-- 图表拖拽区域 -->
      <content-edit></content-edit>
    </n-layout-content>
    <n-layout-sider
      collapse-mode="transform"
      :collapsed-width="0"
      :width="350"
      :collapsed="collapsed"
      :native-scrollbar="false"
      show-trigger="bar"
      @collapse="collapsedHandle"
      @expand="expandHandle"
    >
      <content-box class="go-content-configurations go-boderbox" :show-top="false" :depth="2">
        <!--         配置 画布 以及背景等  默认项-->
        <n-tabs v-if="!selectTarget" class="tabs-box" size="small" type="segment">
          <n-tab-pane v-for="item in globalTabList" :key="item.key" :name="item.key" size="small" display-directive="show:lazy">
            <template #tab>
              <!--          初始状态下  显示的是 页面配置-->
              <n-space>
                <span>{{ item.title }}</span>
                <el-icon size="16" class="icon-position">
                  <component :is="item.icon"></component>
                </el-icon>
              </n-space>
            </template>
            <component :is="item.render"></component>
          </n-tab-pane>
        </n-tabs>

        <!--         配置 选中的组件   -->
        <n-tabs v-if="selectTarget" v-model:value="tabsSelect" class="tabs-box" size="small" type="segment">
          <!--如果有选中的组件 则显示组件的配置-->
          <n-tab-pane
            v-for="item in selectTarget.isGroup ? chartsDefaultTabList : chartsTabList"
            :key="item.key"
            :name="item.key"
            size="small"
            display-directive="show:lazy"
          >
            <template #tab>
              <n-space>
                <span>{{ item.title }}</span>
                <el-icon size="16" class="icon-position">
                  <component :is="item.icon"></component>
                </el-icon>
              </n-space>
            </template>
            <component :is="item.render"></component>
          </n-tab-pane>
        </n-tabs>
      </content-box>
    </n-layout-sider>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from "vue";
import { icon } from "@/plugins";
import { loadAsyncComponent } from "@/utils";
import { ContentBox } from "../ContentBox/index";
import { TabsEnum } from "./index.d";
import { useChartLayoutStore } from "@/stores/modules/chartLayoutStore/chartLayoutStore";
import { ChartLayoutStoreEnum } from "@/stores/modules/chartLayoutStore/chartLayoutStore.d";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";

const { getDetails } = toRefs(useChartLayoutStore());
const { setItem } = useChartLayoutStore();
const chartEditStore = useChartEditStore();
const { ConstructIcon, FlashIcon, DesktopOutlineIcon, LeafIcon, RocketIcon } = icon.ionicons5;
const ContentEdit = loadAsyncComponent(() => import("../Canvas_Editor/index.vue"));
// 页面配置的界面
const CanvasPage = loadAsyncComponent(() => import("./components/CanvasPage/index.vue"));
// 页面配置最上面的四个选择
const ChartSetting = loadAsyncComponent(() => import("./components/ChartSetting/index.vue"));
const ChartData = loadAsyncComponent(() => import("./components/ChartData/index.vue"));
const ChartEvent = loadAsyncComponent(() => import("./components/ChartEvent/index.vue"));
const ChartAnimation = loadAsyncComponent(() => import("./components/ChartAnimation/index.vue"));

const collapsed = ref<boolean>(getDetails.value);
const tabsSelect = ref<TabsEnum>(TabsEnum.CHART_SETTING);

const collapsedHandle = () => {
  collapsed.value = true;
  setItem(ChartLayoutStoreEnum.DETAILS, true);
};

const expandHandle = () => {
  collapsed.value = false;
  setItem(ChartLayoutStoreEnum.DETAILS, false);
};

const selectTarget = computed(() => {
  const selectId = chartEditStore.getTargetChart.selectId;
  // 排除多个
  if (selectId.length !== 1) return undefined;
  const target = chartEditStore.componentList[chartEditStore.fetchTargetIndex()];
  if (target?.isGroup) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    tabsSelect.value = TabsEnum.CHART_SETTING;
  }
  return target;
});

watch(getDetails, newData => {
  if (newData) {
    collapsedHandle();
  } else {
    expandHandle();
  }
});

// 页面设置
const globalTabList = [
  {
    key: TabsEnum.PAGE_SETTING,
    title: "页面配置",
    icon: DesktopOutlineIcon,
    render: CanvasPage
  }
];

const chartsDefaultTabList = [
  {
    key: TabsEnum.CHART_SETTING,
    title: "自定义设置",
    icon: "Guide",
    render: ChartSetting
  }
];
// ,
// {
//   key: TabsEnum.CHART_ANIMATION,
//     title: "动画",
//   icon: LeafIcon,
//   render: ChartAnimation
// }
const chartsTabList = [
  ...chartsDefaultTabList
  // {
  //   key: TabsEnum.CHART_DATA,
  //   title: "数据",
  //   icon: FlashIcon,
  //   render: ChartData
  // },
  // {
  //   key: TabsEnum.CHART_EVENT,
  //   title: "事件",
  //   icon: RocketIcon,
  //   render: ChartEvent
  // }
];
</script>

<style lang="scss" scoped>
@include go(content-configurations) {
  overflow: hidden;
  .tabs-box {
    padding: 10px;
    .icon-position {
      padding-top: 3px;
    }
  }
}
</style>
