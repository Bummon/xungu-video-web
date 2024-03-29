<template>
  <div class="myFlex">
    <div class="pie-charts" id="countChartsRef" ref="countChartsRef"></div>
    <div class="pie-charts" id="durationChartsRef" ref="durationChartsRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { getComplexCount } from "@/api/modules/chart/chart";
import { getStartAndEndOfWeek } from "@/utils/dateUtils";
import { Chart } from "@/api/interface/chart/chart";

type EchartsOption = echarts.EChartsOption;
let countChartsRef = ref();
let durationChartsRef = ref();
let deptOption: EchartsOption;
let durationOption: EchartsOption;

interface Props {
  startTime: string;
  endTime: string;
}

const { startTime, endTime } = getStartAndEndOfWeek();

const props = ref<Props>({
  startTime: startTime.format("YYYY-MM-DD 00:00:00.000"),
  endTime: endTime.format("YYYY-MM-DD 23:59:59.999")
});

const initChart = (deptDataArr: any, durationDataArr: any) => {
  let deptCharts = echarts.init(document.getElementById("countChartsRef")!);
  let durationCharts = echarts.init(document.getElementById("durationChartsRef")!);
  deptOption = {
    title: {
      subtext: "部门分布",
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
        name: "部门分布",
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
        data: deptDataArr
      }
    ]
  };
  durationOption = {
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
        name: "时长分布",
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
        data: durationDataArr
      }
    ]
  };
  deptOption && deptCharts.setOption(deptOption);
  deptOption && durationCharts.setOption(durationOption);
};

interface EchartsProps {
  name: string;
  value: any;
}

//转换数据为echarts所需格式
const convertDurationData = (params: Chart.DurationDistribution): EchartsProps[] => {
  const data: EchartsProps[] = [];
  data.push({ name: "0-15分钟", value: params.zeroToFifteenCount });
  data.push({ name: "15-30分钟", value: params.fifteenToThirtyCount });
  data.push({ name: "30-45分钟", value: params.thirtyToFortyFiveCount });
  data.push({ name: "45-60分钟", value: params.fortyFiveToSixtyCount });
  data.push({ name: "60分钟以上", value: params.sixtyPlusCount });
  return data;
};

//获取数据并重新加载图表
const getData = async (startTime: string, endTime: string) => {
  const params = {
    startTime: startTime,
    endTime: endTime
  };
  const data = (await getComplexCount(params)).data;
  countChartsRef.value = data.deptDistribution;
  durationChartsRef.value = data.durationDistribution;
  //部门分布
  const deptData = [];
  data.deptDistribution.forEach(any => {
    const item = {
      name: any.deptName,
      value: any.count
    };
    deptData.push(item);
  });
  const durationData = convertDurationData(data.durationDistribution);
  console.log(deptData);
  initChart(deptData, durationData);
};

onMounted(() => {
  console.log(props.value);
  getData(props.value?.startTime, props.value?.endTime);
});
defineExpose({
  getData
});
</script>

<style scoped>
.myFlex {
  display: flex;
  justify-content: space-around;
}
.pie-charts {
  display: inline-block;
  width: 500px;
  height: 300px;
  padding-top: 10px;
  margin-right: 20px;
}
</style>
