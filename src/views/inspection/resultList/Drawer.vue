<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="true"
    width="80%"
    draggable
  >
    <template #header>
      <el-button @click="drawerVisible = false">返回</el-button>
    </template>
    <ProTable
      ref="proTable"
      title="异常设备"
      row-key="typeId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
    >
      <!-- 操作 -->
      <template #operation="scope">
        <el-link type="primary">{{ scope.row.typeId }}</el-link>
      </template>
    </ProTable>
  </el-dialog>
</template>

<script setup lang="tsx" name="Drawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";

import ProTable from "@/components/ProTable/index.vue";
import { TableWidthEnum } from "@/enums/TableEnum";
import { ReqPage } from "@/api/interface";

import { TaskDetailHttp } from "@/api/modules/inspectionResult/detail";

interface DrawerProps {
  taskId: number | bigint;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  taskId: 0
});
const initParam = ref({});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  initParam.value = { taskId: params.taskId };
  drawerProps.value.taskId = params.taskId;
  drawerVisible.value = true;
};
// 初始化请求参数

// 获取数据
const getTableList = (params: ReqPage) => {
  // 接口数据
  return TaskDetailHttp.getTaskDetailList(JSON.parse(JSON.stringify(params)));
};
const columns = [
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "terminalName", label: "设备名称", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "alarmName", label: "告警类型", align: "left", width: TableWidthEnum.Status },
  { prop: "alarmLevel", label: "告警等级", align: "left", width: TableWidthEnum.Status },
  { prop: "typeName", label: "资源类型", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "roomName", label: "会议室", align: "left", width: TableWidthEnum.LongTime },
  { prop: "areaName", label: "位置", align: "left" },
  {
    prop: "orderId",
    label: "关联工单",
    width: TableWidthEnum.Handle2
  }
];

defineExpose({
  acceptParams
});
</script>
