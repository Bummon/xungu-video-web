<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="操作日志列表"
      row-key="jobId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <template #operationType="scope">
        <span style="color: #0d9076" v-if="scope.row.operationType === 0">{{ LevelArray[scope.row.operationType] }}</span>
        <span style="color: #debc33" v-if="scope.row.operationType === 1">{{ LevelArray[scope.row.operationType] }}</span>
        <span style="color: #c35a09" v-if="scope.row.operationType === 2">{{ LevelArray[scope.row.operationType] }}</span>
        <span style="color: #d9103b" v-if="scope.row.operationType === 3">{{ LevelArray[scope.row.operationType] }}</span>
      </template>

      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="Manage">
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { sysLog } from "@/api/interface/system1/sysLog";
import { deleteRows, getListByPage } from "@/api/modules/system1/log";
import { TableWidthEnum } from "@/enums/TableEnum";

const proTable = ref();
// 操作等级
const LevelEnum = [
  { label: "高级", value: 3 },
  { label: "中级", value: 2 },
  { label: "普通", value: 1 },
  { label: "低级", value: 0 }
];
const LevelArray = ["低", "普通", "中", "高"];
// 表格配置项
const columns: ColumnProps<sysLog.log>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: 50 },
  { prop: "logId", label: "操作编号", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "title", label: "方法操作名称", align: "left", search: { el: "input" } },
  { prop: "logIp", label: "发起区域", align: "left", width: TableWidthEnum.Email, search: { el: "input" } },
  { prop: "userName", label: "操作用户", align: "left", width: TableWidthEnum.Name },
  {
    prop: "operationType",
    label: "影响等级",
    align: "center",
    width: TableWidthEnum.Status,
    enum: LevelEnum,
    search: { el: "select" }
  },
  // { prop: "requestParam", label: "请求参数", align: "left", width: 120 },
  // { prop: "requestUrl", label: "请求路径", align: "left", width: 120 },
  // { prop: "context", label: "返回的参数和值", align: "left" },
  // { prop: "operation", label: TableLabelEnum.Operation, width: 150, fixed: "right" },
  { prop: "modifyTime", label: "操作时间", align: "left", width: TableWidthEnum.LongTime }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getListByPage(newParams);
};

const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const deleteRow = async (params: sysLog.log) => {
  await useHandleData(deleteRows, { ids: [params.logId] }, `删除【${params.title}】日志`);
  proTable.value?.getTableList();
};
</script>
