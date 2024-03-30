<template>
  <div>
    <el-tabs v-model="countType" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="总会议数" name="meetingCount" />
      <el-tab-pane label="会议总时长" name="meetingDurationCount" />
    </el-tabs>
    <div class="count-charts" ref="countChartsRef"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { getDailyMeetingNumCount, getYearMeetingNumCount } from "@/api/modules/chart/chart";
import { getStartAndEndOfWeek } from "@/utils/dateUtils";
import type { TabsPaneContext } from "element-plus";

const countType = ref("meetingCount");

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
const meetingCount = ref({});
const chartBarWidth = ref("40%");
const initChart = (dateArr: string[], countArr: string[]) => {
  let myChart = echarts.init(countChartsRef.value);
  let seriesName = countType.value === "meetingCount" ? "数量" : "时长(min)";
  option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: dateArr,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: "value"
      }
    ],
    series: [
      {
        name: seriesName,
        type: "bar",
        barWidth: chartBarWidth.value,
        data: countArr
      }
    ]
  };
  option && myChart.setOption(option);
  window.addEventListener("resize", myChart.resize);
};

//标签切换处理函数
const handleClick = (tab: TabsPaneContext, event: Event) => {
  countType.value = tab.props.name;
  let count;
  if (countType.value === "meetingCount") {
    count = meetingCount.value?.dailyMeetingCount;
  } else if (countType.value === "meetingDurationCount") {
    count = meetingCount.value?.dailyMeetingDurationCount;
  }
  const dateArr = count.map(item => item.date);
  const countArr = count.map(item => item.count);
  console.log(countType.value);

  initChart(dateArr, countArr);
};

//获取每日统计
const getData = async (startTime: string, endTime: string, dateType: string) => {
  if (dateType === "week") {
    chartBarWidth.value = "10%";
  } else if (dateType === "month") {
    chartBarWidth.value = "40%";
  }
  const params = {
    startTime: startTime,
    endTime: endTime
  };
  meetingCount.value = (await getDailyMeetingNumCount(params)).data;
  // handleClick();
  let dateArr = [];
  let countArr = [];
  const dailyMeetingCount = meetingCount.value?.dailyMeetingCount;
  dateArr = dailyMeetingCount.map(item => item.date);
  countArr = dailyMeetingCount.map(item => item.count);
  initChart(dateArr, countArr);
};

//获取每月统计（年度）
const getYearData = async (startTime: string, endTime: string, dateType) => {
  if (dateType === "year") {
    chartBarWidth.value = "20%";
    console.log("year", chartBarWidth.value);
  }
  const params = {
    startTime: startTime,
    endTime: endTime
  };
  meetingCount.value = (await getYearMeetingNumCount(params)).data;
  let dateArr = [];
  let countArr = [];
  const dailyMeetingCount = meetingCount.value?.dailyMeetingCount;
  dateArr = dailyMeetingCount.map(item => item.date);
  countArr = dailyMeetingCount.map(item => item.count);
  initChart(dateArr, countArr);
};

onMounted(async () => {
  await getData(props.value.startTime, props.value.endTime, "week");
  let dailyMeetingCount = meetingCount.value?.dailyMeetingCount;
  let dateArr = dailyMeetingCount.map(item => item.date);
  let countArr = dailyMeetingCount.map(item => item.count);
  initChart(dateArr, countArr);
});

defineExpose({
  getData,
  getYearData
});
</script>

<style scoped>
.count-charts {
  width: 100%;
  height: 200px;
}
</style>
