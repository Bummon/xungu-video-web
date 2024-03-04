<template>
  <div class="go-content-layers-list-item" :class="{ hover, select, 'list-mini': selectText }">
    <div class="go-flex-center item-content">
      <n-image
        class="list-img"
        object-fit="contain"
        preview-disabled
        :src="imageInfo"
        :fallback-src="requireErrorImg()"
      ></n-image>
      <n-ellipsis style="margin-right: auto">
        <span class="list-text">
          {{ props.componentData.chartConfig.title }}
        </span>
      </n-ellipsis>
      <layers-status :isGroup="isGroup" :hover="hover" :status="status"></layers-status>
    </div>
    <div :class="{ 'select-modal': select }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { requireErrorImg } from "@/utils";
import { useDesignStore } from "@/stores/modules/designStore/designStore";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
import { LayerModeEnum } from "@/stores/modules/chartLayoutStore/chartLayoutStore.d";
import { fetchImages } from "@/packages/index";
import { CreateComponentType, CreateComponentGroupType } from "@/packages/index.d";
import { LayersStatus } from "../LayersStatus/index";

const props = defineProps({
  componentData: {
    type: Object as PropType<CreateComponentType | CreateComponentGroupType>,
    required: true
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  layerMode: {
    type: String as PropType<LayerModeEnum>,
    default: LayerModeEnum.THUMBNAIL
  }
});

// 全局颜色
const designStore = useDesignStore();
const chartEditStore = useChartEditStore();
const imageInfo = ref("");

// 获取图片
const fetchImageUrl = async () => {
  imageInfo.value = await fetchImages(props.componentData.chartConfig);
};
fetchImageUrl();

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme;
});

// 计算当前选中目标
const select = computed(() => {
  const id = props.componentData.id;
  return chartEditStore.getTargetChart.selectId.find((e: string) => e === id);
});

// 悬浮对象
const hover = computed(() => {
  return props.componentData.id === chartEditStore.getTargetChart.hoverId;
});

// 组件状态 隐藏/锁定
const status = computed(() => {
  return props.componentData.status;
});

// 是否选中文本
const selectText = computed(() => {
  return props.layerMode === LayerModeEnum.TEXT;
});
</script>

<style lang="scss" scoped>
$center-height: 52px;
$center-mini-height: 28px;
$text-size: 10px;

@include go(content-layers-list-item) {
  position: relative;
  width: 90%;
  height: $center-height;
  margin: 5px 5%;
  margin-bottom: 5px;
  cursor: pointer;
  border: 1px solid rgb(0 0 0 / 0%);
  border-radius: 5px;

  @extend .go-transition-quick;
  &.hover,
  &:hover {
    @include fetch-bg-color("background-color4");
  }
  &:hover {
    @include deep {
      .icon-item {
        opacity: 1;
      }
    }
  }
  .select-modal,
  .item-content {
    position: absolute;
    top: 0;
    left: 0;
  }
  .item-content {
    z-index: 1;
    justify-content: start !important;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    padding: 6px 5px;
  }
  .select-modal {
    width: 100%;
    height: 100%;
    background-color: v-bind("themeColor");
    opacity: 0.3;
  }
  .list-img {
    flex-shrink: 0;
    height: $center-height;
    padding: 2px;
    overflow: hidden;
    border: none !important;
    border-radius: 5px;

    @include hover-border-color("hover-border-color");
  }
  .list-text {
    padding-left: 6px;
    font-size: $text-size;
  }

  /* 选中样式 */
  &.select {
    background-color: rgb(0 0 0 / 0%);
    border: 1px solid v-bind("themeColor");
  }

  // mini样式
  &.list-mini {
    height: $center-mini-height;
  }
}
</style>
