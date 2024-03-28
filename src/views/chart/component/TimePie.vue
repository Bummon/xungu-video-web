<template>
  <div>
    <div class="pie-charts" ref="countChartsRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { getComplexCount } from "@/api/modules/chart/chart";
import { getStartAndEndOfWeek } from "@/utils/dateUtils";

type EchartsOption = echarts.EChartsOption;
let countChartsRef = ref();
let option: EchartsOption;

interface Props {
  startTime: string;
  endTime: string;
}

const { startTime, endTime } = getStartAndEndOfWeek();

const props = ref<Props>({
  startTime: startTime.format("YYYY-MM-DD 00:00:00.000"),
  endTime: endTime.format("YYYY-MM-DD 23:59:59.999")
});

const initChart = (dataArr: any) => {
  let myChart = echarts.init(countChartsRef.value);
  option = {
    title: {
      subtext: "时长分布",
      subtextStyle: {
        fontSize: "14px",
        color: "#000",
        fontWeight: "bold"
      },
      top: "-3px",
      left: "center"
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      top: "-20%",
      left: "center"
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: "{b} : {c} ({d}%)"
            },
            labelLine: { show: true }
          }
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: false,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            name: "111",
            value: 1
          },
          {
            name: "222",
            value: 2
          }
        ]
      }
    ]
  };
  option && myChart.setOption(option);
};

const getData = async (startTime: string, endTime: string) => {
  const params = {
    startTime: startTime,
    endTime: endTime
  };
  const data = (await getComplexCount(params)).data;
  countChartsRef.value = data;
  const myData = [];
  data.deptDistribution.forEach(any => {
    const item = {
      name: any.deptName,
      value: any.count
    };
    myData.push(item);
  });
  console.log(myData);
  initChart(myData);
};

onMounted(() => {
  getData(props.value?.startTime, props.value?.endTime);
});
</script>

<style scoped>
.pie-charts {
  width: 500px;
  height: 300px;
  padding-top: 10px;
}
</style>
