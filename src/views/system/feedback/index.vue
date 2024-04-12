<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="意见反馈"
      rowKey="feedbackId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button
          v-has="'business:feedback:remove'"
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
import { deleteOperationLog } from "@/api/modules/system/operationLog";
import { sysOperationLog } from "@/api/interface/system/sysOperationLog";
import Drawer from "@/views/system/feedback/Drawer.vue";
import { addUser, updateUser } from "@/api/modules/system/user";
import { deleteFeedback, getFeedbackPage } from "@/api/modules/system/feedback";
import { TFeedback } from "@/api/interface/system/tFeedback";

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

const getTableList = (params: TFeedback.FeedBack) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getFeedbackPage(newParams);
};
// 表格配置项
const columns: ColumnProps<TFeedback.FeedBack>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: TableLabelEnum.Index, width: 50 },
  {
    prop: "feedbackId",
    label: "ID",
    align: "left",
    width: 250
  },
  {
    prop: "feedbackName",
    label: "反馈标题",
    align: "left",
    search: {
      el: "input"
    }
  },
  {
    prop: "createUsername",
    label: "创建人",
    align: "left",
    width: TableWidthEnum.PersonName,
    search: {
      el: "input"
    }
  },
  {
    prop: "createTime",
    label: "创建时间",
    align: "left",
    width: TableWidthEnum.LongTime
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 330 }
];
// 删除用户信息
const deleteAccount = async (params: TFeedback.FeedBack) => {
  await useHandleData(deleteOperationLog, [params.feedbackId], `删除反馈【${params.feedbackName}】`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (ids: number[] | bigint[]) => {
  console.log(ids);
  await useHandleData(deleteFeedback, ids, "删除所选用户操作日志");
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
