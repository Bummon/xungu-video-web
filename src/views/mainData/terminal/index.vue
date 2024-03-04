<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="终端列表"
      row-key="terminalId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增终端</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="Setting" @click="openConfigDrawer(scope.row.terminalName, scope.row.terminalId)"
          >配置
        </el-button>
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑 </el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <Index ref="configDrawerRef" />
  </div>
</template>

<script setup lang="ts" name="TerminalManage">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import Drawer from "./Drawer.vue";
import { BaseTerminal } from "@/api/interface/player/baseTerminal";
import { addRow, deleteRows, updateRow, getListByPage, status } from "@/api/modules/player/terminal";
import Index from "./terminalConfig/index.vue";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

const proTable = ref();

// 表格配置项
const columns: ColumnProps<BaseTerminal.Terminal>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "terminalName", label: "终端名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "terminalCode", label: "终端编码", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "typeName", label: TableLabelEnum.Type, align: "left", width: TableWidthEnum.Type },
  { prop: "groupName", label: "所属分组", align: "left", width: TableWidthEnum.PersonName },
  { prop: "roomName", label: "场所", align: "left", width: TableWidthEnum.PersonName },
  { prop: "siteName", label: "位置", align: "left", width: TableWidthEnum.PersonName },
  { prop: "terminalDescr", label: TableLabelEnum.Descr, align: "left" },
  { prop: "terminalSort", label: TableLabelEnum.Sort, align: "left", width: TableWidthEnum.Status },
  { prop: "terminalStatus", label: TableLabelEnum.Status, tag: true, enum: status, width: TableWidthEnum.Status },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: TableWidthEnum.LongTime },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle3, fixed: "right" }
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
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<BaseTerminal.Terminal> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { terminalStatus: 0 } : { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
const deleteRow = async (params: BaseTerminal.Terminal) => {
  await useHandleData(deleteRows, { ids: [params.terminalId] }, `删除【${params.terminalName}】终端`);
  proTable.value?.getTableList();
};

const configDrawerRef = ref<InstanceType<typeof Index> | null>(null);
const openConfigDrawer = (title: string, terminalId: number) => {
  const params = {
    title,
    terminalId
  };
  configDrawerRef.value?.acceptParams(params);
};
</script>
