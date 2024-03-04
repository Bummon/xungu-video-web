<template>
  <div class="go-edit-range go-transition" :style="rangeStyle" @mousedown="mousedownBoxSelect($event, undefined)">
    <slot></slot>
    <!-- 水印 -->
    <edit-watermark></edit-watermark>
    <!-- 拖拽时的辅助线 -->
    <edit-align-line></edit-align-line>
    <!-- 框选时的样式框 -->
    <edit-select></edit-select>
    <!-- 拖拽时的遮罩 -->
    <div class="go-edit-range-model" :style="rangeModelStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from "vue";
import { useSizeStyle } from "../../hooks/useStyle.hook";
import { canvasModelIndex } from "@/settings/designSetting";
import { mousedownBoxSelect } from "../../hooks/useDrag.hook";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
import { EditAlignLine } from "../EditAlignLine/index";
import { EditWatermark } from "../EditWatermark/index";
import { EditSelect } from "../EditSelect/index";

const chartEditStore = useChartEditStore();

const { getEditCanvasConfig, getEditCanvas } = toRefs(chartEditStore);

const size = computed(() => {
  return {
    w: getEditCanvasConfig.value.width,
    h: getEditCanvasConfig.value.height
  };
});

const rangeStyle = computed(() => {
  // 缩放
  const scale = {
    transform: `scale(${getEditCanvas.value.scale})`
  };
  // @ts-expect-error
  return { ...useSizeStyle(size.value), ...scale };
});

// 模态层
const rangeModelStyle = computed(() => {
  const dragStyle = getEditCanvas.value.isCreate && { "z-index": 99999 };
  // @ts-expect-error
  return { ...useSizeStyle(size.value), ...dragStyle };
});
</script>

<style lang="scss" scoped>
@include go(edit-range) {
  position: relative;
  overflow: hidden;
  background-color: $--color-light-bg-2;
  background-size: cover;
  border-color: $--color-light-bg-4;
  border-radius: 10px;
  transform-origin: left top;

  @include go(edit-range-model) {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
}
</style>
