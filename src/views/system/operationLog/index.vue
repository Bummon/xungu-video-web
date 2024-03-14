<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="操作日志"
      rowKey="operId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <!--        -->
        <el-button
          v-has="'system:loginLog:remove'"
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
      <template #type="scope">
        <el-tag v-if="scope.row.type === 1" type="success">新增</el-tag>
        <el-tag v-else-if="scope.row.type === 2" type="warning">修改</el-tag>
        <el-tag v-else-if="scope.row.type === 3" type="danger">删除</el-tag>
      </template>
      <template #isSuccess="scope">
        <el-tag v-if="scope.row.isSuccess" type="success">成功</el-tag>
        <el-tag v-else type="danger">失败</el-tag>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-has="'system:operationLog:query'" type="primary" link icon="View" @click="openDrawer('查看', scope.row)"
          >查看
        </el-button>
        <el-button v-has="'system:loginLog:remove'" type="primary" link icon="Delete" @click="deleteAccount(scope.row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <!--<ImportExcel ref="dialogRef" />-->
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { deleteOperationLog, getOperationLogPage } from "@/api/modules/system/operationLog";
import { sysOperationLog } from "@/api/interface/system/sysOperationLog";
import Drawer from "@/views/system/operationLog/Drawer.vue";
import { addUser, updateUser } from "@/api/modules/system/user";
import { operationType } from "@/utils/serviceDict";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

const initParam = reactive({});

const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: sysOperationLog.OperationLogQuery) => {
  let newParams = JSON.parse(JSON.stringify(params));
  if (params.createTime && params.createTime.length > 0) {
    const startTime = params.createTime[0];
    const endTime = params.createTime[1];
    newParams.startTime = startTime + " 00:00:00.000";
    newParams.endTime = endTime + " 23:59:59.999";
    newParams.createTime = undefined;
  }
  return getOperationLogPage(newParams);
};
// 表格配置项
const columns: ColumnProps<sysOperationLog.OperationLog>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: TableLabelEnum.Index, width: 50 },
  {
    prop: "moduleName",
    label: "模块",
    align: "left",
    width: 180
  },
  {
    prop: "operationName",
    label: "操作内容",
    align: "left"
  },
  {
    prop: "createUsername",
    label: "用户",
    align: "left",
    width: TableWidthEnum.PersonName
  },
  {
    prop: "ip",
    label: "IP",
    align: "left",
    width: TableWidthEnum.PersonName
  },
  {
    prop: "type",
    label: "类型",
    align: "left",
    width: TableWidthEnum.PersonName,
    search: {
      el: "select"
    },
    enum: operationType
  },
  {
    prop: "isSuccess",
    label: "请求状态",
    align: "left",
    width: TableWidthEnum.PersonName
  },
  {
    prop: "createTime",
    label: "操作时间",
    align: "left",
    width: TableWidthEnum.LongTime,
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "daterange", valueFormat: "YYYY-MM-DD" }
    }
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 330 }
];
// 删除用户信息
const deleteAccount = async (params: sysOperationLog.OperationLog) => {
  await useHandleData(deleteOperationLog, [params.operId], `删除用户【${params.createUsername}】的操作日志`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (ids: number[] | bigint[]) => {
  console.log(ids);
  await useHandleData(deleteOperationLog, ids, "删除所选用户操作日志");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(查看)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<sysOperationLog.OperationLog> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? updateUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  console.log();
  drawerRef.value?.acceptParams(params);
};
</script>
