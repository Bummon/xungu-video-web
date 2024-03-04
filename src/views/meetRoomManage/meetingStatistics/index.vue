<script setup lang="tsx">
import { reactive } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { TableWidthEnum } from "@/enums/TableEnum";
import { AreaType } from "@/api/interface/control/area";
import { ReqPagePlus } from "@/api/interface";
import { AreaHttp } from "@/api/modules/control/area";
import BySourceType from "@/views/meetRoomManage/meetingStatistics/components/bySourceType.vue";
import ByRoomType from "@/views/meetRoomManage/meetingStatistics/components/byRoomType.vue";
import ByOrder from "@/views/meetRoomManage/meetingStatistics/components/byOrder.vue";
import ByUsage from "@/views/meetRoomManage/meetingStatistics/components/byUsage.vue";
import { RoomHttp } from "@/api/modules/control/meetRoom";

const initParam = reactive({ parentId: 1 });
const getTableList = (params: ReqPagePlus) => {
  return RoomHttp.getCountRoomsByArea();
};
// 表格配置项
const columns: ColumnProps<AreaType.area>[] = [
  { type: "index", label: "No", width: TableWidthEnum.Index },

  {
    prop: "secondaryRegionName",
    label: "二级区域名称",
    align: "left",
    width: TableWidthEnum.Name
  },
  {
    prop: "parentPrimaryRegionName",
    label: "所属一级区域",
    align: "left",
    width: TableWidthEnum.Parent
  },
  { prop: "roomNumber", label: "会议室数量" }
];
</script>

<template>
  <el-tabs type="border-card" class="table-box">
    <el-tab-pane label="按区域" class="tab-pane">
      <ProTable
        ref="proTable"
        rowKey="areaId"
        title="区域列表"
        highlight-current-row
        :columns="columns"
        :request-api="getTableList"
        :init-param="initParam"
        :pagination="false"
      >
      </ProTable>
    </el-tab-pane>
    <el-tab-pane label="按资源类型">
      <BySourceType></BySourceType>
    </el-tab-pane>
    <el-tab-pane label="按会议室类型">
      <ByRoomType></ByRoomType>
    </el-tab-pane>
    <el-tab-pane label="按工单">
      <ByOrder></ByOrder>
    </el-tab-pane>
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><calendar /></el-icon>
          <span>按使用率</span>
        </span>
      </template>
      <ByUsage></ByUsage>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">
.custom-tabs-label {
  width: 80px;
  padding: 0 20px;
}
</style>
