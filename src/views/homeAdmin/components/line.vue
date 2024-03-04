<template>
  <!-- 数据来源 -->
  <div class="echarts" ref="echartsRef"></div>
</template>
<script setup lang="ts" name="cure">
import { ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";

const echartsRef = ref<HTMLElement>();
const initChart = (data: any) => {
  const myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  const option = {
    xAxis: [
      {
        type: "category",
        data: data.map((val: any) => {
          return {
            value: val.spotName
          };
        }),
        boundaryGap: false
      }
    ],
    yAxis: { type: "value" },
    series: [
      {
        name: "Direct",
        type: "line",
        data: data.map((val: any) => {
          return {
            value: val.value
          };
        }),
        areaStyle: {},
        smooth: true
      }
    ]
  };
  useEcharts(myChart, option);
};
defineExpose({
  initChart
});
</script>
<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
