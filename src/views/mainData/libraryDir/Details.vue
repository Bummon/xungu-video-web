<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :title="`${drawerProps.title}`"
    :destroy-on-close="true"
    :before-close="beforeClose"
    width="70%"
  >
    <ProTable
      ref="proTable"
      title="文件列表"
      rowKey="libId"
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
        <!-- <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button> -->
        <el-button type="primary" link icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
  </el-dialog>
  <Import ref="drawerRef" />
</template>

<script setup lang="tsx" name="detail">
import { reactive, ref } from "vue";
import { sysDict } from "@/api/interface/system1/sysDict";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import Import from "./import.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { addRows, deleteRows, getListByPage, updateRow } from "@/api/modules/player/baseLibrary";
import { TableLabelEnum } from "@/enums/TableEnum";
import { BaseLibraryDir } from "@/api/interface/player/baseLibraryDir";

interface DrawerProps {
  title: string;
  row: Partial<BaseLibraryDir.LibraryDir>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
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
const beforeClose = () => {
  console.log(drawerProps.value);
  drawerProps.value.getTableList!();
  drawerVisible.value = false;
};
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.dirId = drawerProps.value.row.dirId;
  return getListByPage(newParams);
};

/**
 * @description 文件夹里面的文件列表
 */
const columns: ColumnProps<BaseLibraryDir.LibraryDir>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "编号", width: 150 },
  // {
  //   prop: "libName",
  //   label: "名称"
  // },
  {
    prop: "libFilename",
    label: "文件名称",
    search: { el: "input" }
  },
  {
    prop: "libFilesize",
    label: "文件大小(kb)",
    render: scope => {
      return (scope.row.libFilesize / 1024).toFixed(1);
    }
  },
  {
    prop: "libType",
    label: "文件格式",
    render: scope => {
      if (scope.row.libType == 1) {
        return "视频";
      }
      if (scope.row.libType == 2) {
        return "图片";
      }
      if (scope.row.libType == 3) {
        return "PPT";
      }
      if (scope.row.libType != 1 && scope.row.libType != 2 && scope.row.libType != 3) {
        return "未知";
      }
    }
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 330 }
];
/**
 * 删除文件信息
 * @param params
 */
const deleteAccount = async (params: sysDict.dict) => {
  await useHandleData(deleteRows, { ids: [params.libId] }, `删除【${params.libFilename}】文件`);
  proTable.value?.getTableList();
};

// 批量删除文件信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteRows, { ids: id }, "删除所选文件信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof DialogDetail> | null>(null);
const openDrawer = (title: string, row: Partial<sysDict.dict> = {}) => {
  row.dirId = drawerProps.value.row.dirId;
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRows : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

defineExpose({
  acceptParams
});
</script>
