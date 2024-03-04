<template>
  <el-dialog v-model="drawerVisible" :close-on-click-modal="false" title="字典数据" :destroy-on-close="true" width="80%">
    <ProTable
      ref="proTable"
      title="字典列表"
      rowKey="dictId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
        <el-button type="danger" icon="Delete" plain @click="batchDelete(scope.selectedListIds)" :disabled="!scope.isSelected">
          批量删除
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <DialogDetail ref="drawerRef" />
  </el-dialog>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { sysDict } from "@/api/interface/system1/sysDict";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import DialogDetail from "./dialogDetail.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { addRow, deleteRows, getDictList, updateRow } from "@/api/modules/system1/dict";
import { TableLabelEnum } from "@/enums/TableEnum";

interface DrawerProps {
  row: Partial<sysDict.dict>;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
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

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.parentId = drawerProps.value.row.dictId;
  return getDictList(newParams);
};

// 表格配置项
const columns: ColumnProps<sysDict.dict>[] = [
  { type: "selection", fixed: "left", width: 40 },
  { type: "index", label: "No", width: 50 },
  {
    prop: "dictName",
    label: "字典名称",
    search: { el: "input" },
    align: "left",
    width: 310
  },
  {
    prop: "dictValue",
    label: "字典键值",
    align: "left",
    width: 310
  },
  {
    prop: "dictValueType",
    label: "字典数据类型",
    align: "left",
    width: 310
  },
  {
    prop: "dictStatus",
    label: TableLabelEnum.Status,
    fieldNames: { label: "dictLabel", value: "dictStatus" },
    render: scope => {
      return <>{<el-tag type={scope.row.dictStatus ? "success" : "danger"}>{scope.row.dictStatus ? "启用" : "禁用"}</el-tag>}</>;
    },
    align: "left",
    width: 70
  },
  {
    prop: "modifyTime",
    label: "修改时间",
    align: "left",
    width: 170
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 150 }
];
// 删除字典信息
const deleteAccount = async (params: sysDict.dict) => {
  await useHandleData(deleteRows, { ids: [params.dictId] }, `删除【${params.dictName}】字典`);
  proTable.value?.getTableList();
};

// 批量删除字典信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteRows, { ids: id }, "删除所选字典信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof DialogDetail> | null>(null);
const openDrawer = (title: string, row: Partial<sysDict.dict> = {}) => {
  console.log(row);
  row.parentId = drawerProps.value.row.dictId;
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  console.log(params);

  drawerRef.value?.acceptParams(params);
};

defineExpose({
  acceptParams
});
</script>
