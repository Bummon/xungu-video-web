<template>
  <div class="go-packages-image">
    <div>
      <n-image
        :object-fit="fit"
        preview-disabled
        :src="option.dataset"
        :fallback-src="requireErrorImg()"
        :width="w"
        :height="h"
      ></n-image>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs } from "vue";
import { requireErrorImg } from "@/utils";
import { useChartDataFetch } from "@/hooks";
import { CreateComponentType } from "@/packages/index.d";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";

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

// 编辑更新
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
</script>
