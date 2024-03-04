<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      row-key="roomId"
      title="会议室列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
    >
      <!--      会议室类型 -->
      <template #roomTypeId="scope">
        <span>{{ scope.row.roomTypeName }}</span>
      </template>
      <template #runningStatus="scope">
        <el-tag type="danger" v-if="scope.row.runningStatus === 0" effect="dark"> 故障</el-tag>
        <el-tag type="" v-if="scope.row.runningStatus === 1" effect="dark">在线</el-tag>
        <el-tag type="info" v-if="scope.row.runningStatus === 2" effect="dark">离线</el-tag>
      </template>
      <template #areaId="scope">
        <span>{{ scope.row.areaName }}</span>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive, onMounted } from "vue";

import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps, SearchRenderScope } from "@/components/ProTable/interface";
import { RoomHttp } from "@/api/modules/control/meetRoom";
import { TableWidthEnum, TableLabelEnum } from "@/enums/TableEnum";

// 类型
import { ReqPage } from "@/api/interface";
import { RoomType } from "@/api/interface/control/MeetRoom";
import { MeetRoomTypeHttp } from "@/api/modules/control/meetRoomType";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});

/**
 * 获取表格数据
 * @param params
 */
const getTableList = () => {
  return RoomHttp.getCountRoomsByWorkOrder();
};

// 表格配置项
const columns: ColumnProps<RoomType.Room>[] = [
  { type: "index", label: "No", width: TableWidthEnum.Index },
  {
    prop: "roomId",
    label: "会议室ID",
    width: TableWidthEnum.BigIntNum
  },
  {
    prop: "roomName",
    label: "会议室名称",
    width: TableWidthEnum.Name
  },
  {
    prop: "number",
    label: "未完成工单数量",
    width: TableWidthEnum.Parent
  }
];
</script>
