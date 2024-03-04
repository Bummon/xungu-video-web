<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="员工列表"
      rowKey="empId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增员工</el-button>
        <!--        -->
        <el-button type="danger" icon="Delete" plain @click="batchDelete(scope.selectedListIds)"> 批量删除员工 </el-button>
      </template>
      <!-- 扩展 -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!--      开关操作-->
      <template #empStatus="scope">
        <el-switch
          v-model="scope.row.empStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="employeeProTable">
import { reactive, ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { sysEmployee } from "@/api/interface/system1/sysEmployee";
import { addRow, changeStatusById, deleteRows, getListByPage, updateRow } from "@/api/modules/system1/employee";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";

const authStore = useAuthStore();
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
const columns: ColumnProps<sysEmployee.employee>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  {
    prop: "empName",
    label: "员工姓名",
    search: { el: "input" },
    align: "left",
    width: TableWidthEnum.PersonName
  },
  { prop: "empCode", label: "工号", align: "left", width: TableWidthEnum.BigIntNum },
  {
    prop: "gender",
    label: "性别",
    align: "left",
    width: TableWidthEnum.SingleString,
    render: (scope): string => {
      return scope.row.gender === 0 ? "女" : "男";
    }
  },
  { prop: "phone", label: "手机", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "email", label: "邮箱", align: "left", width: TableWidthEnum.Email },
  { prop: "orgName", label: "组织", align: "left", width: TableWidthEnum.PersonName },
  { prop: "deptName", label: "部门", align: "left", width: TableWidthEnum.PersonName },
  { prop: "jobName", label: "岗位", align: "left", width: TableWidthEnum.PersonName },
  { prop: "roleName", label: "角色", align: "left", width: TableWidthEnum.PersonName },
  { prop: "empStatus", label: TableLabelEnum.Status, align: "center", width: TableWidthEnum.Status },
  // {
  //   prop: "modifyTime",
  //   label: TableLabelEnum.ModifyTime,
  //   align: "left",
  //   width: TableWidthEnum.LongTime
  // },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.handle3, fixed: "right" }
];
// 删除行数据
const deleteRow = async (params: sysEmployee.employee) => {
  await useHandleData(deleteRows, { ids: [params.empId] }, `删除【${params.empName}】员工`);
  proTable.value?.getTableList();
};

// 批量删除行数据
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteRows, { ids: id }, "删除所选员工信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 切换员工状态
const changeStatus = async (row: sysEmployee.employee) => {
  await useHandleData(
    changeStatusById,
    { empId: row.empId, empStatus: row.empStatus == 1 ? 0 : 1 },
    `切换【${row.empName}】员工状态`
  );
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<sysEmployee.employee> = {}) => {
  console.log("点击了", title, "按钮");
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
