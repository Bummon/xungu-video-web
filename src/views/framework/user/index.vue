<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      rowKey="userId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 扩展 -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!--      开关操作-->
      <template #userStatus="scope">
        <el-tag class="mx-1" size="large" v-if="scope.row.roomStatus === 0" type="danger" effect="plain"> 已禁用 </el-tag>
        <el-tag class="mx-1" size="large" v-else type="" effect="plain"> 启用中</el-tag>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import Drawer from "./Drawer.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import {
  addRow,
  BatchAddUser,
  changeUserStatus,
  deleteRows,
  exportUserInfo,
  getUserList,
  importTemplate,
  resetUserPassWord,
  updateRow
} from "@/api/modules/system1/user";
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
  return getUserList(newParams);
};
// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: 50 },
  {
    prop: "nickName",
    label: "员工姓名",
    search: { el: "input" },

    align: "left"
  },
  { prop: "userAccount", label: "账户", align: "left" },
  { prop: "userStatus", label: TableLabelEnum.Status, align: "center", width: TableWidthEnum.Status },

  {
    prop: "createTime",
    label: "创建时间",
    align: "left",
    width: TableWidthEnum.LongTime
  },
  {
    prop: "modifyTime",
    label: "修改时间",
    align: "left",
    width: TableWidthEnum.LongTime
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 330 }
];
// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteRows, { ids: [params.userId] }, `删除【${params.nickName}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteRows, { ids: id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  await useHandleData(resetUserPassWord, { id: params.userId }, `重置【${params.nickName}】用户密码`);
  proTable.value?.getTableList();
};

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
  await useHandleData(
    changeUserStatus,
    { userId: row.userId, userStatus: row.userStatus == 1 ? 0 : 1 },
    `切换【${row.nickName}】用户状态`
  );
  proTable.value?.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: importTemplate,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
