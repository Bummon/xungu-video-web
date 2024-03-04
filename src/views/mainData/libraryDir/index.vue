<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="多媒体文件夹列表"
      row-key="dirId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增文件夹')">新增文件夹</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="CirclePlus" @click="openDrawer('新增', scope.row)">新增</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <Details ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { getTreeMenuList, addRow, updateRow, deleteRows } from "@/api/modules/player/libraryDir";
import { BaseLibraryDir } from "@/api/interface/player/baseLibraryDir";
import Drawer from "./Drawer.vue";
import Details from "./Details.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

const proTable = ref();

// 表格配置项
const columns: ColumnProps<BaseLibraryDir.LibraryDir>[] = [
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "dirName", label: "文件夹名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "libraryCount", label: "文件数量", width: TableWidthEnum.ShortNum },
  { prop: "dirDescr", label: "文件夹描述", align: "left", search: { el: "input" } },
  {
    prop: "dirName",
    label: "查看文件",
    render: scope => {
      return (
        <>
          {
            <el-button type="primary" link onClick={() => toDetail(scope.row)}>
              查看
            </el-button>
          }
        </>
      );
    },
    width: 250
  },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle3, fixed: "right" }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ statusType: 1 });
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getTreeMenuList(newParams);
};

// 删除用户信息
const deleteAccount = async (params: BaseLibraryDir.LibraryDir) => {
  await useHandleData(deleteRows, { ids: [params.dirId] }, `删除【${params.dirName}】`);
  proTable.value?.getTableList();
};
const dialogRef = ref<InstanceType<typeof Details> | null>(null);

const toDetail = (row: Partial<BaseLibraryDir.LibraryDir> = {}) => {
  const params = {
    title: row.dirName ? row.dirName : "总计",
    row: { ...row },
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<BaseLibraryDir.LibraryDir> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : title === "新增文件夹" ? addRow : undefined,
    getTableList: proTable.value?.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};
</script>
