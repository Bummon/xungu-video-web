<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="设备类型列表"
      rowKey="typeId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑 </el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除 </el-button>
      </template>
      <!--      开关操作-->
      <template #typeStatus="scope">
        <el-switch
          v-model="scope.row.typeStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="TerminalTypeManage">
import { ref, reactive } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { addRow, changeStatusById, deleteRows, getListByPage, updateRow } from "@/api/modules/player/terminalType";
import { BaseTerminalType } from "@/api/interface/player/baseTerminalType";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
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

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getListByPage(newParams);
};

// 表格配置项
const columns: ColumnProps<BaseTerminalType.Type>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "typeName", label: "名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "typeIco", label: "类型Ico", align: "left", width: TableWidthEnum.Type },
  { prop: "typeDescr", label: "备注", align: "left" },
  { prop: "typeStatus", label: TableLabelEnum.Status, width: TableWidthEnum.Status },
  { prop: "typeSort", label: TableLabelEnum.Sort, align: "left", width: TableWidthEnum.Status },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: TableWidthEnum.LongTime },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: TableWidthEnum.Handle2 }
];
// 删除行数据
const deleteRow = async (params: BaseTerminalType.Type) => {
  await useHandleData(deleteRows, { ids: [params.typeId] }, `删除【${params.typeName}】类型`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<BaseTerminalType.Type> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { typeStatus: 0 } : { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 切换状态
const changeStatus = async (params: BaseTerminalType.Type) => {
  const newStatus = params.typeStatus === 1 ? 0 : 1;
  const requestData = { typeId: params.typeId, typeStatus: newStatus };
  const message = `切换【${params.typeName}】类型状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};
</script>
