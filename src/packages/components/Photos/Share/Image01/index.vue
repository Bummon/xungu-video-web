<template>
  <div class="go-packages-image">
    <div>
      <el-image v-if="!option.dataset" :width="w" :height="h" :src="defaultImg"> 图片 </el-image>
      <n-image v-else preview-disabled :src="option.dataset" :fallback-src="requireErrorImg()" :width="w" :height="h"></n-image>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs } from "vue";
import { requireErrorImg } from "@/utils";
import { useChartDataFetch } from "@/hooks";
import { CreateComponentType } from "@/packages/index.d";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
import defaultImg from "@/assets/images/chart/photos/upload.png";
import { borderRadius } from "@/settings/designSetting";

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
});

// 这里能拿到图表宽高等
const { w, h } = toRefs(props.chartConfig.attr);
// 这里能拿到上面 config.ts 里的 option 数据
const { dataset } = toRefs(props.chartConfig.option);

const option = shallowReactive({
  dataset: ""
});

// 编辑更新 观察到地址变化 重新渲染
watch(
  () => props.chartConfig.option.dataset,
  (newData: any) => {
    option.dataset = newData;
  },
  {
    immediate: true
  }
);

// 预览更新
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: string) => {
  option.dataset = newData;
});

const getStyle = (radius: number) => {
  return {
    borderRadius: `${radius}px`,
    overflow: "hidden"
  };
};
</script>
