<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="会议列表"
      row-key="meetId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button
          v-has="'meeting:list:remove'"
          :disabled="!scope.isSelected"
          type="danger"
          icon="Delete"
          plain
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
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
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button v-has="'meeting:list:remove'" type="primary" link icon="Delete" @click="deleteRow(scope.row)">
          删除
        </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { deleteMeeting, getMeetingPage } from "@/api/modules/meeting/tMeeting";
import { TMeeting } from "@/api/interface/meeting/tMeeting";

// 表格配置项
const columns: ColumnProps<TMeeting.Meeting>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
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
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right" }
];

const proTable = ref();

const initParam = reactive({ statusType: 1 });

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

const loading = ref(false);

//删除会议
const deleteRow = async (params: TMeeting.Meeting) => {
  await useHandleData(deleteMeeting, [params.meetId], `删除会议【${params.meetName}】`);
  proTable.value?.getTableList();
};

// 批量删除
const batchDelete = async (ids: number[] | bigint[]) => {
  console.log(ids);
  await useHandleData(deleteMeeting, ids, "删除所选会议");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};
</script>
