<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="menuId"
      :indent="30"
      :columns="columns"
      :request-api="getTreeMenuList"
      :init-param="initParam"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增菜单</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #menuIcon="scope">
        <el-icon :size="18">
          <component :is="scope.row.menuIcon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="CirclePlus" @click="openDrawer('新增', scope.row)">新增</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
      <!--      开关操作-->
      <template #menuStatus="scope">
        <el-switch
          v-model="scope.row.menuStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuManage">
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { addRow, changeStatusById, deleteRows, getTreeMenuList, updateRow } from "@/api/modules/system1/menu";
import { SysMenu } from "@/api/interface/system1/sysMenu";
import Drawer from "./Drawer.vue";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

const proTable = ref();

// 表格配置项
const columns: ColumnProps<SysMenu.TreeMenu>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: TableLabelEnum.Index, width: TableWidthEnum.Index },
  { prop: "menuName", label: "名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "appName", label: "绑定应用", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "menuParam", label: "权限标识", align: "left", width: 180 },
  { prop: "menuPath", label: "路由路径", align: "left", search: { el: "input" } },
  { prop: "menuSort", label: TableLabelEnum.Sort, align: "left", width: TableWidthEnum.Status },
  { prop: "menuStatus", label: TableLabelEnum.Status, width: TableWidthEnum.Status },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: TableWidthEnum.LongTime },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: TableWidthEnum.Handle3 }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ statusType: 1 });

// 删除用户信息
const deleteAccount = async (params: SysMenu.Menu) => {
  await useHandleData(deleteRows, { ids: [params.menuId] }, `删除【${params.menuName}】`);
  proTable.value?.getTableList();
};

// 切换状态
const changeStatus = async (params: SysMenu.Menu) => {
  const newStatus = params.menuStatus === 1 ? 0 : 1;
  const requestData = { menuId: params.menuId, menuStatus: newStatus };
  const message = `切换【${params.menuName}】配置状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<SysMenu.Menu> = {}) => {
  // row.appId = JSON.parse(row.appId);
  // console.log(row.appId);
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList,
    tableData: proTable.value.tableData
  };
  console.log("传值之前", row, params);
  drawerRef.value?.acceptParams(params);
};
</script>
