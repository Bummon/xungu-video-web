<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="终端授权列表"
      row-key="jobId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="clears(scope.row)">重置授权</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="Manage">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { BaseTerminalBind } from "@/api/interface/player/baseTerminalBind";
import { getListByPage, addRow, updateRow, deleteRows, clear } from "@/api/modules/player/terminalBind";
import { useHandleData } from "@/hooks/useHandleData";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

const proTable = ref();

const bindStatus = [
  { label: "未绑定", value: 0, tagType: "info" },
  { label: "已绑定", value: 1, tagType: "" }
];
// 表格配置项
const columns: ColumnProps<BaseTerminalBind.TerminalBind>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "terminalName", label: "设备名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "bindLicense", label: "授权码", align: "left", width: TableWidthEnum.BigIntNum, search: { el: "input" } },
  { prop: "bindSerialsno", label: "序列号", align: "left" },
  { prop: "bindStatus", label: TableLabelEnum.Status, tag: true, enum: bindStatus, width: TableWidthEnum.Status, align: "left" },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: TableWidthEnum.LongTime, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle2, fixed: "right" }
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
const openDrawer = (title: string, row: Partial<BaseTerminalBind.TerminalBind> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { groupStatus: 0 } : { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const clears = async (params: BaseTerminalBind.TerminalBind) => {
  await useHandleData(clear, { ids: [params.bindId] }, `重置【${params.terminalName}】授权`);
  proTable.value?.getTableList();
};
</script>
