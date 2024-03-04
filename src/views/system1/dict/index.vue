<template>
  <div class="table-box">
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
        <el-button type="primary" link icon="CirclePlus" @click="toDetail(scope.row)">新增字典数据</el-button>
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
      <!--      开关操作-->
      <template #dictStatus="scope">
        <el-switch
          v-model="scope.row.dictStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
        <el-tag class="mx-1" size="large">{{ scope.row.dictStatus == 0 ? "禁用" : "启用" }}</el-tag>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <DictData ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { sysDict } from "@/api/interface/system1/sysDict";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import DictData from "./dictData.vue";
import Drawer from "./Drawer.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { addRow, changeStatusById, deleteRows, getDictList, updateRow } from "@/api/modules/system1/dict";
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
// const router = useRouter();
// const toDetail = row => {
//   router.push(`/system/brand/dictData`);
// };
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.parentId = 0;
  return getDictList(newParams);
};

// 表格配置项
const columns: ColumnProps<sysDict.dict>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  {
    prop: "dictName",
    label: "字典名称",
    width: TableWidthEnum.Name,
    align: "left",
    search: { el: "input" }
  },
  {
    prop: "dictCode",
    label: "关联Key",
    align: "left",
    width: TableWidthEnum.BigIntNum,
    search: { el: "input" }
  },
  {
    prop: "dictDescr",
    label: "描述",
    align: "left"
  },
  {
    prop: "dictSort",
    label: TableLabelEnum.Sort,
    align: "left",
    width: TableWidthEnum.Status
  },
  {
    prop: "dictStatus",
    label: TableLabelEnum.Status,
    width: TableWidthEnum.Status,
    align: "left"
  },
  {
    prop: "modifyTime",
    label: TableLabelEnum.ModifyTime,
    align: "left",
    width: TableWidthEnum.LongTime
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: TableWidthEnum.Handle3 }
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
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<sysDict.dict> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
const dialogRef = ref<InstanceType<typeof DictData> | null>(null);
const toDetail = (row: Partial<sysDict.dict> = {}) => {
  const params = {
    row: { ...row }
  };
  dialogRef.value?.acceptParams(params);
};

// 切换状态
const changeStatus = async (params: sysDict.dict) => {
  const newStatus = params.dictStatus === 1 ? 0 : 1;
  const requestData = { dictId: params.dictId, dictStatus: newStatus };
  const message = `切换【${params.dictName}】字典状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};
</script>
