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
import { getDailyMeetingNumCount } from "@/api/modules/chart/chart";
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

const initChart = (dateArr: string[], countArr: string[]) => {
  let myChart = echarts.init(countChartsRef.value);
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
        name: "Direct",
        type: "bar",
        barWidth: "60%",
        data: countArr
      }
    ]
  };
  option && myChart.setOption(option);
  window.addEventListener("resize", myChart.resize);
};

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab.props.name, 111);
  countType.value = tab.props.name;
  let dateArr = [];
  let countArr = [];
  if (countType.value === "meetingCount") {
    const dailyMeetingCount = meetingCount.value?.dailyMeetingCount;
    dateArr = dailyMeetingCount.map(item => item.date);
    countArr = dailyMeetingCount.map(item => item.count);
  } else if (countType.value === "meetingDurationCount") {
    const dailyMeetingDurationCount = meetingCount.value?.dailyMeetingDurationCount;
    dateArr = dailyMeetingDurationCount.map(item => item.date);
    countArr = dailyMeetingDurationCount.map(item => item.count);
  }
  console.log(countType.value);

  initChart(dateArr, countArr);
};

const getData = async (startTime: string, endTime: string) => {
  const data = {
    startTime: startTime,
    endTime: endTime
  };
  meetingCount.value = (await getDailyMeetingNumCount(data)).data;
  // handleClick();
  let dateArr = [];
  let countArr = [];
  const dailyMeetingCount = meetingCount.value?.dailyMeetingCount;
  dateArr = dailyMeetingCount.map(item => item.date);
  countArr = dailyMeetingCount.map(item => item.count);
  initChart(dateArr, countArr);
};

onMounted(async () => {
  await getData(props.value.startTime, props.value.endTime);
  let dailyMeetingCount = meetingCount.value?.dailyMeetingCount;
  let dateArr = dailyMeetingCount.map(item => item.date);
  let countArr = dailyMeetingCount.map(item => item.count);
  initChart(dateArr, countArr);
});

defineExpose({
  getData
});
</script>

<style scoped>
.count-charts {
  width: 1000px;
  height: 200px;
}
</style>
