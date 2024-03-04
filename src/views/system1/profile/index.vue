<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="配置列表"
      rowKey="profileId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
        <el-button type="danger" :icon="Delete" plain> 删除</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
      <!--      开关操作-->
      <template #profileStatus="scope">
        <el-switch
          v-model="scope.row.profileStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="ProfileManage">
import { reactive, ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { addRow, changeStatusById, deleteRows, getListByPage, updateRow } from "@/api/modules/system1/profile";
import { sysProfile } from "@/api/interface/system1/sysProfile";
import { Delete } from "@element-plus/icons-vue";
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
const columns: ColumnProps<sysProfile.profile>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: 50 },
  { prop: "title", label: "名称", align: "left", width: 230, search: { el: "input" } },
  { prop: "profileKey", label: "字段(Key)", align: "left", width: 180 },
  { prop: "profileValue", label: "值(Value)", align: "left", width: 120 },
  { prop: "profileSort", label: TableLabelEnum.Sort, align: "left" },
  { prop: "profileDescr", label: "备注", align: "left" },
  { prop: "profileStatus", label: TableLabelEnum.Status, width: 70 },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: 170 },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 150 }
];
// 删除行数据
const deleteRow = async (params: sysProfile.profile) => {
  await useHandleData(deleteRows, { ids: [params.profileId] }, `删除【${params.title}】配置`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<sysProfile.profile> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { profileStatus: 0 } : { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 切换状态
const changeStatus = async (params: sysProfile.profile) => {
  const newStatus = params.profileStatus === 1 ? 0 : 1;
  const requestData = { profileId: params.profileId, profileStatus: newStatus };
  const message = `切换【${params.title}】配置状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};
</script>
