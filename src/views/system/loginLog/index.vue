<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="登录日志"
      rowKey="logId"
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
      <template #isSuccess="scope">
        <el-tag v-if="scope.row.isSuccess" type="success">成功</el-tag>
        <el-tag v-if="!scope.row.isSuccess" type="danger">失败</el-tag>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-has="'system:loginLog:remove'" type="primary" link icon="Delete" @click="deleteAccount(scope.row)">
          删除
        </el-button>
        <p v-if="scope.row.defaultType === 1" style="font-style: italic; color: #9f9e9e">系统默认，不可修改</p>
      </template>
    </ProTable>
    <!--<ImportExcel ref="dialogRef" />-->
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { sysLoginLog } from "@/api/interface/system/sysLoginLog";
import { deleteLoginLog, getLoginLogPage } from "@/api/modules/system/loginLog";

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

const getTableList = (params: sysLoginLog.LoginLog) => {
  let newParams = JSON.parse(JSON.stringify(params));
  if (params.loginTime && params.loginTime.length > 0) {
    const startTime = params.loginTime[0];
    const endTime = params.loginTime[1];
    newParams.startTime = startTime + " 00:00:00.000";
    newParams.endTime = endTime + " 23:59:59.999";
    newParams.loginTime = undefined;
  }
  return getLoginLogPage(newParams);
};
// 表格配置项
const columns: ColumnProps<sysLoginLog.LoginLog>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: TableLabelEnum.Index, width: 50 },
  {
    prop: "loginUsername",
    label: "用户名",
    search: { el: "input" },
    align: "left"
  },
  {
    prop: "ip",
    label: "IP",
    align: "left"
  },
  {
    prop: "responseMsg",
    label: "请求结果",
    align: "left",
    width: 350
  },
  {
    prop: "isSuccess",
    label: "请求状态",
    align: "left"
  },
  {
    prop: "loginTime",
    label: "登录时间",
    align: "left",
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "daterange", valueFormat: "YYYY-MM-DD" }
    }
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 330 }
];
// 删除用户信息
const deleteAccount = async (params: sysLoginLog.LoginLog) => {
  await useHandleData(deleteLoginLog, [params.logId], `删除用户【${params.loginUsername}】的登录日志`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (ids: number[] | bigint[]) => {
  await useHandleData(deleteLoginLog, ids, "删除所选用户登录日志");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};
</script>
