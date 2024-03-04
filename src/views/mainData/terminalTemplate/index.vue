<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="模板列表"
      row-key="templateId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!--      开关操作-->
      <template #templateStatus="scope">
        <el-switch
          v-model="scope.row.templateStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
        <el-tag class="mx-1" size="large">{{ scope.row.templateStatus == 0 ? "禁用" : "启用" }}</el-tag>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="TemplateManage">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import {
  addRow,
  changeStatusById,
  deleteRows,
  getListByPage,
  templateStatus,
  updateRow
} from "@/api/modules/player/terminalTemplate";
import { BaseTerminalTemplate } from "@/api/interface/player/baseTerminalTemplate";
import Drawer from "./Drawer.vue";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

const proTable = ref();

// 表格配置项
const columns: ColumnProps<BaseTerminalTemplate.Template>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "templateContext", label: "名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "templateKey", label: "关联Key", align: "left", width: TableWidthEnum.Type, search: { el: "input" } },
  { prop: "templateValue", label: "当前数据", align: "left", width: TableWidthEnum.Name },
  { prop: "templateDataType", label: "数据类型", align: "left", width: TableWidthEnum.Type },
  { prop: "templateDescr", label: TableLabelEnum.Descr, align: "left" },
  { prop: "templateSort", label: TableLabelEnum.Sort, align: "left", width: TableWidthEnum.Status },
  {
    prop: "templateStatus",
    label: TableLabelEnum.Status,
    width: TableWidthEnum.Status,
    align: "left"
  },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: TableWidthEnum.LongTime, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle2, fixed: "right" }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ statusType: 1 });

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

// 删除行数据
const deleteRow = async (params: BaseTerminalTemplate.Template) => {
  await useHandleData(deleteRows, { ids: [params.templateId] }, `删除【${params.templateContext}】配置`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<BaseTerminalTemplate.Template> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 切换状态
const changeStatus = async (params: BaseTerminalTemplate.Template) => {
  const newStatus = params.templateStatus === 1 ? 0 : 1;
  const requestData = { templateId: params.templateId, templateStatus: newStatus };
  const message = `切换【${params.templateContext}】模板状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};
</script>
