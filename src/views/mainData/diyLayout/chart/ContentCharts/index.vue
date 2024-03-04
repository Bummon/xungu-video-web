<template>
  <!-- 左侧所有组件的展示列表 -->
  <content-box class="go-content-charts" :class="{ scoped: !getCharts }" title="可选组件" :depth="1" :backIcon="false">
    <template #icon>
      <n-icon size="14" :depth="2">
        <bar-chart-icon></bar-chart-icon>
      </n-icon>
    </template>
    <!--搜索栏目-->
    <template #top-right>
      <charts-search v-show="getCharts" :menuOptions="menuOptions"></charts-search>
    </template>
    <!-- 图表 -->
    <aside>
      <div class="menu-width-box">
        <!--        选项列表-->
        <n-menu
          class="menu-width"
          v-model:value="selectValue"
          :options="menuOptions"
          :icon-size="16"
          :indent="18"
          @update:value="clickItemHandle"
        ></n-menu>
        <!--    第二栏 选择列表-->
        <div class="menu-component-box">
          <!--          骨架屏-->
          <!--          <go-skeleton :load="!selectOptions" round text :repeat="2" style="width: 90%"></go-skeleton>-->
          <!--          元素选择菜单-->
          <charts-option-content v-if="selectOptions" :selectOptions="selectOptions" :key="selectValue"></charts-option-content>
        </div>
      </div>
    </aside>
  </content-box>
</template>

<script setup lang="ts">
import { ContentBox } from "../ContentBox/index";
import { ChartsOptionContent } from "./components/ChartsOptionContent/index";
import { ChartsSearch } from "./components/ChartsSearch/index";
import { useAsideHook } from "./hooks/useAside.hook";
import { GoSkeleton } from "@/components/GoSkeleton/index";
// 获取Charts列表   图表图标 选项  选项值  点击事件方法  菜单选项
const { getCharts, BarChartIcon, selectOptions, selectValue, clickItemHandle, menuOptions } = useAsideHook();
</script>

<style lang="scss" scoped>
/* 整体宽度 */
$width: 330px;

/* 列表的宽度 */
$width-scoped: 65px;

/* 此高度与 ContentBox 组件关联 */
$top-height: 40px;

@include go(content-charts) {
  width: $width;

  @extend .go-transition;
  &.scoped,
  .menu-width {
    width: $width-scoped;
  }
  .menu-width-box {
    display: flex;
    height: calc(100vh - #{$--header-height} - #{$top-height});
    .menu-width {
      flex-shrink: 0;
      background-color: $--color-light-bg-2;
    }
    .menu-component-box {
      flex-shrink: 0;
      width: $width - $width-scoped;
      overflow: hidden;
    }
  }

  @include deep {
    .menu-width {
      .n-menu-item {
        height: auto !important;
        &.n-menu-item--selected {
          &::after {
            position: absolute;
            top: 0;
            left: 2px;
            width: 3px;
            height: 100%;
            content: "";
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
          }
        }
        .n-menu-item-content {
          display: flex;
          flex-direction: column;
          padding: 6px 12px !important;
          font-size: 14px !important;
        }
        .n-menu-item-content__icon {
          margin-right: 0 !important;
          font-size: 18px !important;
        }
      }
    }
  }
}
</style>
