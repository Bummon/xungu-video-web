<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="历史会议"
      row-key="meetId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 扩展 -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 菜单图标 -->
      <template #icon>
        <el-icon :size="18">
          <component :is="'Avatar'"></component>
        </el-icon>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import ProTable from "@/components/ProTable/index.vue";
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getMeetingPage } from "@/api/modules/meeting/tMeeting";
import { TMeeting } from "@/api/interface/meeting/tMeeting";

// 表格配置项
const columns: ColumnProps<TMeeting.Meeting>[] = [
  //{ type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: 50 },
  { prop: "meetCode", label: "会议ID", align: "left" },
  { prop: "meetName", label: "会议名称", align: "left", search: { el: "input" } },
  { prop: "createUsername", label: "发起人", align: "center", search: { el: "input" } },
  {
    prop: "meetStartTime",
    label: "开始时间",
    align: "left",
    align: "center",
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "daterange", valueFormat: "YYYY-MM-DD" }
    }
  },
  { prop: "meetDuration", label: "会议时长", align: "left" }
  //{ prop: "operation", label: TableLabelEnum.Operation, fixed: "right" }
];
const proTable = ref();

const initParam = reactive({ meetStatusArr: [2], sortType: 2 });

const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: TMeeting.Meeting) => {
  let newParams = JSON.parse(JSON.stringify(params));
  if (params.meetStartTime && params.meetStartTime.length > 0) {
    const startTime = params.meetStartTime[0];
    const endTime = params.meetStartTime[1];
    newParams.startTime = startTime + " 00:00:00.000";
    newParams.endTime = endTime + " 23:59:59.999";
    newParams.meetStartTime = undefined;
  }
  return getMeetingPage(newParams);
};
</script>
