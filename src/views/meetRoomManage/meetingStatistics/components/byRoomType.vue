<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
import { DataScreenHttp } from "@/api/modules/dataScreen";
import { useGlobalStore } from "@/stores/modules/global";

type EChartsOption = echarts.EChartsOption;
let roomCharts = ref();
const globalStore = useGlobalStore();
let option: EChartsOption;
const data = ref();

onMounted(() => {
  init();
});

async function init() {
  data.value = (await DataScreenHttp.getMeetingRoomCountListByType()).data;
  console.log("会议室", data.value);
  data.value.forEach(item => {
    item.value = item.total;
    item.name = item.dataType;
  });
  option = {
    color: [globalStore.primary, "rgba(5,8,5,0.9)", "#8e8e8e", "#ad3826", "rgba(139,179,22,0.9)", "#ad3826"],
    title: {
      text: "按会议室类型统计",
      left: "center",
      top: 0,
      textStyle: {
        color: "#000",
        fontFamily: "Microsoft YaHei",
        fontStyle: "normal",
        fontWeight: "normal"
      }
    },

    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0,0,0,.9)",
      textStyle: {
        color: "#fff",
        fontFamily: "Microsoft YaHei",
        fontStyle: "normal",
        fontWeight: "normal"
      }
    },
    legend: {
      orient: "vertical",
      left: "0",
      textStyle: {
        color: "#000"
      }
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: "50%",
        data: data.value,
        left: "auto",
        top: "auto",
        label: {
          color: "#000",
          show: true,
          formatter: "{b}: {c}" // {b} 表示名称，{c} 表示数值
        },
        // 高亮状态的扇区和标签样式。
        emphasis: {
          itemStyle: {
            shadowBlur: 2,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.9)" // 圆饼的阴影
          }
        }
      }
    ]
  };
  let myChart = echarts.init(roomCharts.value);
  option && myChart.setOption(option);
}
</script>

<template>
  <div id="room-info">
    <div class="room-charts" ref="roomCharts"></div>
  </div>
</template>

<style scoped lang="scss">
@import "@/views/dataScreen/index.scss";
#room-info {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60vw;
  height: 70vh;
  margin: 0 auto;
  .room-charts {
    width: 60vw;
    height: 70vh;
    margin: 0 auto;
  }
}
</style>
