<template>
  <div class="go-text-box">
    <div class="content">
      <span>
        {{ option.dataset }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, computed, ref } from "vue";
import { CreateComponentType } from "@/packages/index.d";
import { useChartDataFetch } from "@/hooks";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
import { option as configOption } from "./config";
import { values } from "lodash";

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType & typeof option>,
    required: true
  }
});

const { w } = toRefs(props.chartConfig.attr);

const { fontColor, fontSize, letterSpacing, fontWeight, animationTime, animationSpeed, boxShadow } = toRefs(
  props.chartConfig.option
);

const option = shallowReactive({
  dataset: configOption.dataset
});

// 手动更新
watch(
  () => props.chartConfig.option.dataset,
  (newData: any) => {
    option.dataset = newData;
  },
  {
    immediate: true,
    deep: false
  }
);

//阴影
// watch(
//   props.chartConfig.option,
//   () => {
//     try {
//       if (props.chartConfig.option.showShadow) {
//         boxShadow.value = `${props.chartConfig.option.hShadow}px ${props.chartConfig.option.vShadow}px ${props.chartConfig.option.blurShadow}px ${props.chartConfig.option.colorShadow}`;
//       } else {
//         boxShadow.value = "none";
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   },
//   {
//     immediate: true
//   }
// );

const transitionDuration = computed(() => {
  return Math.floor((w.value as any) / (animationSpeed.value as any));
});

// 预览更新
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: string) => {
  option.dataset = newData;
});
</script>

<style lang="scss" scoped>
@include go("text-box") {
  display: flex;
  align-items: center;
  .content {
    position: absolute;
    width: 100%;
    font-size: v-bind('fontSize + "px"');
    font-weight: v-bind("fontWeight");
    color: v-bind("fontColor");

    // text-shadow: v-bind("boxShadow");
    // letter-spacing: v-bind('letterSpacing + "px"');
    animation: barrage v-bind('transitionDuration + "s"') linear v-bind('animationTime + "s"') infinite;
  }

  @keyframes barrage {
    from {
      left: 100%;
      transform: translateX(0);
    }
    to {
      left: 0;
      transform: translateX(-100%);
    }
  }
}
</style>
