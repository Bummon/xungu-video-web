<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="组织机构"
      row-key="deptId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button v-has="'base:dept:add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增一级')">新增 </el-button>
      </template>
      <!--      开关操作-->
      <template #enabled="scope">
        <el-switch
          v-model="scope.row.enabled"
          inline-prompt
          :disabled="!AuthUtils.hasPermission('base:dept:edit')"
          active-text="启用"
          :active-value="1"
          :inactive-value="0"
          inactive-text="禁用"
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
        <el-button v-has="'base:dept:edit'" type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)"
          >编辑
        </el-button>
        <el-button v-has="'base:dept:add'" type="primary" link icon="CirclePlus" @click="openDrawer('新增', scope.row)"
          >新增下级
        </el-button>
        <el-button v-has="'base:dept:remove'" type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除 </el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="Mange">
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { changeDeptStatus } from "@/api/modules/system1/department";
import Drawer from "./Drawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { sysDepartment } from "@/api/interface/system1/sysDepartment";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { addDept, deleteDept, getDeptTree, updateDept } from "@/api/modules/base/dept";
import { sysDept } from "@/api/interface/base/sysDept";
import { AuthUtils } from "@/utils/auth";

const authStore = useAuthStore();
const proTable = ref();

// 表格配置项
const columns: ColumnProps<sysDept.DeptTree>[] = [
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "deptName", label: "名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "deptSort", label: TableLabelEnum.Sort, width: TableWidthEnum.Sort, align: "center" },
  { prop: "deptLeader", label: "负责人", align: "left", width: TableWidthEnum.PersonName },
  { prop: "deptPhone", label: "联系方式", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "enabled", label: TableLabelEnum.Status, align: "center", width: TableWidthEnum.Status },
  { prop: "remark", label: "备注", align: "left" },
  { prop: "createTime", label: "创建时间", align: "left", width: TableWidthEnum.LongTime },
  { prop: "modifyTime", label: "最后修改时间", align: "left", width: TableWidthEnum.LongTime },
  { prop: "operation", label: TableLabelEnum.Operation, width: 320, fixed: "right" }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getDeptTree(newParams);
};

// 删除部门
const deleteRow = async (params: sysDepartment.Department) => {
  console.log(params);
  await useHandleData(deleteDept, [params.deptId], `删除【${params.deptName}】`);
  proTable.value?.getTableList();
};

// 切换部门状态
const changeStatus = async (params: sysDepartment.Department) => {
  const newStatus = params.enabled === 1 ? 0 : 1;
  const requestData = { deptId: params.deptId, enabled: newStatus };
  const message = `切换【${params.deptName}】部门状态`;
  await useHandleData(changeDeptStatus, requestData, message);
  proTable.value?.getTableList();
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
    api: title === "新增" || title === "新增一级" ? addDept : title === "编辑" ? updateDept : undefined,
    getTableList: proTable.value?.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};
</script>
