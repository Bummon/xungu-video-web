<template>
  <el-row :gutter="16">
    <el-col :span="12">
      <div class="statistic-card">
        <el-statistic :value="`${meetingCount.meetingCount} 场`">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              会议总场次
              <el-tooltip effect="dark" content="所选时间范围内召开过的总会议场次" placement="top">
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>
              日均场次：{{ meetingCount.dailyMeetingCount }} 场
              <el-tooltip effect="dark" content="所选时间范围内每日平均会议场次" placement="top">
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="statistic-card">
        <el-statistic :value="`${meetingCount.meetingDurationCount} min`">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              会议总时长
              <el-tooltip effect="dark" content="所选时间范围内会议召开时长总和" placement="top">
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>
              日均时长：{{ meetingCount.dailyMeetingDurationCount }} min
              <el-tooltip effect="dark" content="所选时间范围内每日平均会议时长" placement="top">
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
//数据
import { ref } from "vue";
import { getMeetingNumCount } from "@/api/modules/chart/chart.js";
import { getStartAndEndOfWeek } from "@/utils/dateUtils";

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

// 获取图表所需数据
const getData = async (startTime: string, endTime: string) => {
  const data = {
    startTime: startTime,
    endTime: endTime
  };
  meetingCount.value = (await getMeetingNumCount(data)).data;
};

getData(props.value.startTime, props.value.endTime);

defineExpose({
  getData
});
</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}
.el-statistic {
  --el-statistic-content-font-size: 28px;
}
.statistic-card {
  height: 100%;
  padding: 20px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 4px;
}
.statistic-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}
.statistic-footer .footer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}
</style>
