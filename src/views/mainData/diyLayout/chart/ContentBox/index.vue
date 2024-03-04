<template>
  <!-- 每个小模块的公共样式 图层区-->
  <div class="go-content-box" :class="[`bg-depth${depth}`, flex && 'flex']">
    <div v-if="showTop" class="top go-mt-0 go-flex-no-wrap">
      <!--      左边区域  第三栏 展示图层-->
      <n-space class="go-flex-no-wrap" :size="5">
        <n-ellipsis>
          <n-text>{{ title }}</n-text>
        </n-ellipsis>
        <div class="mt-1">
          <slot name="icon"></slot>
        </div>
      </n-space>
      <n-space class="go-flex-no-wrap" align="center" style="gap: 4px">
        <slot name="top-right"></slot>
        <n-icon v-show="backIcon" size="20" class="go-cursor-pointer go-d-block" @click="backHandle">
          <chevron-back-outline-icon></chevron-back-outline-icon>
        </n-icon>
      </n-space>
    </div>

    <div
      class="content"
      :class="{
        'content-height-show-top-bottom': showBottom || showTop,
        'content-height-show-both': showBottom && showTop
      }"
    >
      <template v-if="disabledScroll">
        <slot></slot>
      </template>
      <template v-else-if="xScroll">
        <n-scrollbar x-scrollable>
          <n-scrollbar>
            <slot></slot>
          </n-scrollbar>
        </n-scrollbar>
      </template>

      <template v-else>
        <n-scrollbar>
          <slot></slot>
        </n-scrollbar>
      </template>
    </div>

    <div v-if="showBottom" class="bottom go-mt-0">
      <slot name="bottom"></slot>
    </div>
    <div class="aside">
      <slot name="aside"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { icon } from "@/plugins";

const { ChevronBackOutlineIcon } = icon.ionicons5;

const emit = defineEmits(["back"]);

defineProps({
  title: String,
  showTop: {
    type: Boolean,
    default: true
  },
  showBottom: {
    type: Boolean,
    default: false
  },
  flex: {
    type: Boolean,
    default: false
  },
  // back
  backIcon: {
    type: Boolean,
    default: true
  },
  // 背景深度
  depth: {
    type: Number,
    default: 1
  },
  // x 轴滚动
  xScroll: {
    type: Boolean,
    default: false
  },
  disabledScroll: {
    type: Boolean,
    default: false
  }
});

const backHandle = () => {
  emit("back");
};
</script>

<style lang="scss" scoped>
$top-or-bottom-height: 40px;

@include go(content-box) {
  height: calc(100vh - #{$--header-height});
  margin: 1px;
  margin-bottom: 0;
  &.bg-depth0 {
    background-color: $--color-light-bg-1;
    .bottom,
    .top {
      background-color: $--color-light-bg-1;
    }
  }
  &.bg-depth1 {
    background-color: $--color-light-bg-1;
    .bottom,
    .top {
      background-color: $--color-light-bg-2;
    }
  }
  &.bg-depth2 {
    background-color: $--color-light-bg-2;
    .bottom,
    .top {
      background-color: $--color-light-bg-3;
    }
  }
  &.bg-depth3 {
    background-color: $--color-light-bg-3;
    .bottom,
    .top {
      background-color: $--color-light-bg-4;
    }
  }
  &.flex {
    flex: 1;
  }
  .top,
  .bottom {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    height: $top-or-bottom-height;
    padding: 0 10px;

    // border-top: 1px solid;
    background-color: $--color-light-bg-4;
    .mt-1 {
      margin-top: 2px;
    }
  }
  .top {
    // border-bottom: 1px solid;
    background-color: $--color-light-bg-1;
  }
  .content {
    height: calc(100vh - #{$--header-height});
    overflow: hidden;
  }
  .aside {
    position: relative;
  }
  .content-height-show-top-bottom {
    height: calc(100vh - #{$--header-height} - #{$top-or-bottom-height});
  }
  .content-height-show-both {
    height: calc(100vh - #{$--header-height} - #{$top-or-bottom-height} - #{$top-or-bottom-height});
  }
}
</style>
