<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="设备命令管理"
      row-key="commandId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增命令</el-button>
        <el-button type="danger" icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>

      <template #modelIds="scope">
        <el-tag v-for="item in scope.row.modelNames" :key="item">{{ item }}</el-tag>
      </template>
      <!-- 操作 -->
      <template #operation="scope">
        <!--        允许修改 和 不等于1 条件 二选一就可以修改 删除-->
        <div class="" v-if="ALLOW_PRESET || scope.row.preset !== 1">
          <el-button type="primary" link icon="EditPen" @click="openDrawer('修改', scope.row)">修改</el-button>
          <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
        </div>
        <div class="" v-else>内置属性，不可修改</div>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" :updateTable="updateTable" />
  </div>
</template>

<script setup lang="ts" name="Mange">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { ReqPage, ResPage } from "@/api/interface";
import { MeetSourceType } from "@/api/interface/source";
import { CommandHttp } from "@/api/modules/source/command";
import { ALLOW_PRESET } from "@/config";
// 权限集
const authStore = useAuthStore();
// 表格
const proTable = ref();
// drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);

// 表格配置项
const columns: ColumnProps<MeetSourceType.resourceType>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "commandId", label: "命令ID", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "commandName", label: "命令名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "commandFormat", label: "命令格式", align: "left", width: TableWidthEnum.Status },
  { prop: "commandContext", label: "命令内容", align: "left" },
  { prop: "modelIds", label: "型号", align: "left" },
  {
    prop: "operation",
    label: TableLabelEnum.Operation,
    width: TableWidthEnum.Handle2,
    fixed: "right"
  }
];
// 初始化的请求参数
const initParam = reactive({});

/**
 * @description 获取功能的列表
 *
 */
const getTableList = (params: ReqPage) => {
  return CommandHttp.getCommandList(JSON.parse(JSON.stringify(params)));
};

/**
 * 接口返回的数据需要进行清洗成符合ProTable规范的数据结构
 * @param {ResPage<MeetSourceType.command[]>} data
 */
function dataCallback(data: ResPage<MeetSourceType.command[]>) {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
}

/**
 * 删除 命令
 * @param row
 */
async function deleteRow(row) {
  await XGConfirmBox(CommandHttp.deleteCommand, { ids: [row.commandId] }, "删除该命令");
  proTable.value?.getTableList();
}

/**
 * 批量删除命令信息
 * @param id
 */
const batchDelete = async (ids: string[]) => {
  await useHandleData(CommandHttp.deleteCommand, { ids }, "删除所选命令信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

/**
 * 打开新增或编辑的弹窗
 * @param title
 * @param {MeetSourceType.resourceType} row
 * @param api
 */
const openDrawer = (title: string, row: Partial<MeetSourceType.command> = {}) => {
  if (row.modelList) {
  }
  let modelList = [];
  row.modelIds?.forEach(item => {
    let tmp = [item.brandId, item.modelId];
    modelList.push(tmp);
  });
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? {} : { ...row, modelList: modelList },
    api: title === "新增" ? CommandHttp.addCommandRow : title === "修改" ? CommandHttp.updateCommandRow : undefined,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};

function updateTable() {
  proTable.value.pageable.pageSize = 10;
  proTable.value?.getTableList();
}
</script>
