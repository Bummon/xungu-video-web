<template>
  <div class="card table-search">
    <div class="chart-date-picker">
      <el-radio-group v-model="dateType" @change="handleDateTypeChange">
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="year">本年</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        @change="handleDateChange()"
        :clearable="false"
        unlink-panels
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        size="default"
        :placeholder="dateType === 'week' ? '选择周' : dateType === 'month' ? '选择月' : dateType === 'year' ? '选择年' : ''"
        style="margin-left: 20px; vertical-align: bottom"
      />
    </div>
    <NumCount ref="meetingNumCountRef" />
    <Bar ref="countBarRef" />
    <div class="pie-charts-title">数据分布</div>
    <TimePie />
  </div>
</template>

<script setup lang="ts" name="Chart">
import NumCount from "@/views/chart/component/NumCount.vue";
import { ref } from "vue";
import dayjs from "dayjs";
import { getStartAndEndOfMonth, getStartAndEndOfWeek, getStartAndEndOfYear } from "@/utils/dateUtils";
import Bar from "@/views/chart/component/Bar.vue";
import TimePie from "@/views/chart/component/TimePie.vue";

// 搜索默认项
const dateType = ref<string>("week");

//ref
const meetingNumCountRef = ref<InstanceType<typeof NumCount> | null>(null);
const countBarRef = ref<InstanceType<typeof Bar> | null>(null);

const { startTime, endTime } = getStartAndEndOfWeek();
const dateRange = ref<{}>([startTime, endTime]);
const handleDateChange = () => {
  const startTime = dayjs(dateRange.value[0]).format("YYYY-MM-DD 00:00:00.000");
  const endTime = dayjs(dateRange.value[1]).format("YYYY-MM-DD 23:59:59.999");
  meetingNumCountRef.value?.getData(startTime, endTime);
  countBarRef.value?.getData(startTime, endTime);
};
const handleDateTypeChange = () => {
  if (dateType.value === "week") {
    const { startTime, endTime } = getStartAndEndOfWeek();
    dateRange.value = [startTime, endTime];
  } else if (dateType.value === "month") {
    const { startTime, endTime } = getStartAndEndOfMonth();
    dateRange.value = [startTime, endTime];
  } else if (dateType.value === "year") {
    const { startTime, endTime } = getStartAndEndOfYear();
    dateRange.value = [startTime, endTime];
  }
  handleDateChange();
};
</script>

<style scoped>
.pie-charts-title {
  display: flex;
  align-items: center;
  justify-self: flex-start;
  height: 50px;
}
</style>
