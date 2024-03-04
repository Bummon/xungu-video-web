<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="告警类型列表"
      rowKey="typeId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <div class="" v-if="!['无法开启', '无法连接', '无法关闭'].includes(scope.row.typeName)">
          <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link icon="EditPen" @click="deleteType(scope.row)">删除</el-button>
        </div>
        <div class="" v-else>内置类型，不可修改</div>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="AlarmTypeManage">
import { ref, reactive } from "vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { AlarmHttp } from "@/api/modules/work/alarm";
import { ReqPagePlus } from "@/api/interface";
import { WorkOrder } from "@/api/interface/work";
import { RoomType } from "@/api/interface/control/MeetRoom";
import { RoomHttp } from "@/api/modules/control/meetRoom";
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

const initParam = reactive({ statusType: 1 });

const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: ReqPagePlus) => {
  return AlarmHttp.getAlarmList(params);
};

// 表格配置项
const columns: ColumnProps<WorkOrder.alarmType>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "typeId", label: "告警类型ID", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "typeName", label: "告警类型", align: "left", search: { el: "input" } },
  { prop: "alarmLevel", label: "告警等级", align: "left" },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: TableWidthEnum.LongTime },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: TableWidthEnum.Handle2 }
];

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<WorkOrder.alarmType> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? AlarmHttp.addAlarmRow : title === "编辑" ? AlarmHttp.updateAlarmRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除告警类型
const deleteType = async row => {
  await XGConfirmBox(AlarmHttp.deleteAlarm, { ids: [row.typeId] }, `确定删除此告警类型？`);
  proTable.value?.getTableList();
};
</script>
