<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="异常日志"
      rowKey="exceptionId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <!--        -->
        <el-button
          v-has="'system:exceptionLog:remove'"
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
        <el-button v-has="'system:exceptionLog:query'" type="primary" link icon="View" @click="openDrawer('查看', scope.row)"
          >查看
        </el-button>
        <el-button v-has="'system:exceptionLog:remove'" type="primary" link icon="Delete" @click="deleteAccount(scope.row)">
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
import { sysOperationLog } from "@/api/interface/system/sysOperationLog";
import Drawer from "./Drawer.vue";
import { addUser, updateUser } from "@/api/modules/system/user";
import { deleteExceptionLog, getExceptionLogPage } from "@/api/modules/system/exceptionLog";
import { SysExceptionLog } from "@/api/interface/system/sysExceptionLog";

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

const getTableList = (params: sysOperationLog.OperationLog) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getExceptionLogPage(newParams);
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
    width: TableWidthEnum.PersonName
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
    width: TableWidthEnum.LongTime
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 330 }
];
// 删除用户信息
const deleteAccount = async (params: SysExceptionLog.ExceptionLog) => {
  await useHandleData(deleteExceptionLog, [params.exceptionId], `删除异常日志`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (ids: number[] | bigint[]) => {
  console.log(ids);
  await useHandleData(deleteExceptionLog, ids, "删除所选异常日志");
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
