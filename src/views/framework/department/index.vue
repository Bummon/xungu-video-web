<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="部门列表"
      row-key="deptId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增一级')">新增部门</el-button>
      </template>
      <!--      开关操作-->
      <template #deptStatus="scope">
        <el-switch
          v-model="scope.row.deptStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
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
        <el-button type="primary" link icon="CirclePlus" @click="openDrawer('新增', scope.row)" v-if="scope.row.parentId === 0"
          >新增下级
        </el-button>
        <el-button type="primary" link icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <Dialog ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="Mange">
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { addRow, changeDeptStatus, deleteRows, getTreeList, updateRow } from "@/api/modules/system1/department";
import Drawer from "./Drawer.vue";
import Dialog from "./Dialog.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { sysDepartment } from "@/api/interface/system1/sysDepartment";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";

const authStore = useAuthStore();
const proTable = ref();

// 表格配置项
const columns: ColumnProps<sysDepartment.TreeDepartment>[] = [
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "deptName", label: "部门名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "orgName", label: "所属公司", align: "left", width: TableWidthEnum.Parent },
  { prop: "deptDescr", label: "部门描述", align: "left" },
  { prop: "deptSort", label: TableLabelEnum.Sort, width: TableWidthEnum.Sort, align: "center" },
  { prop: "deptStatus", label: TableLabelEnum.Status, width: TableWidthEnum.Status, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: 320, fixed: "right" }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ statusType: 1 });
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getTreeList(newParams);
};

// 删除用户信息
const deleteAccount = async (params: sysDepartment.Department) => {
  console.log(params);
  await useHandleData(deleteRows, { ids: [params.deptId] }, `删除【${params.deptName}】`);
  proTable.value?.getTableList();
};

// 切换部门状态
const changeStatus = async (params: sysDepartment.Department) => {
  const newStatus = params.deptStatus === 1 ? 0 : 1;
  const requestData = { deptId: params.deptId, deptStatus: newStatus };
  const message = `切换【${params.deptName}】部门状态`;
  await useHandleData(changeDeptStatus, requestData, message);
  proTable.value?.getTableList();
};
// 打开 drawer(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof Dialog> | null>(null);

/**
 * 绑定公司
 * @param row
 */
const bindFirm = (row: Partial<sysDepartment.Department> = {}) => {
  const params = {
    row: { ...row },
    api: updateRow,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<sysDepartment.Department> = {}) => {
  let lowLevel = false;
  // 存在父菜单 且父菜单为0  才是最高级别选项
  if (row?.parentId && row?.parentId !== 0) {
    lowLevel = true;
  }
  if (title === "新增") {
    lowLevel = true;
  }
  const params = {
    title,
    isLowLevel: lowLevel, // 是否是低级选项  低级选项不可选择父公司
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" || title === "新增一级" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};
</script>
