<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="公司列表"
      row-key="orgId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增一级公司</el-button>
      </template>
      <!--      开关操作-->
      <template #orgStatus="scope">
        <el-switch
          v-model="scope.row.orgStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeOrgStatus.bind(this, scope.row)"
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
        <el-button type="primary" link icon="CirclePlus" @click="openDrawer('新增', scope.row)">新增子公司</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
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
import { addRow, deleteRows, getTreeList, OrganizationHttp, updateRow } from "@/api/modules/system1/organization";
import Drawer from "./Drawer.vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
import { SysOrganization } from "@/api/interface/system1/sysOrganization";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

const proTable = ref();

// 表格配置项
const columns: ColumnProps<SysOrganization.Treeorganization>[] = [
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "orgName", label: "公司名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "orgDescr", label: "公司描述", align: "left" },
  { prop: "orgSort", label: "排位顺序", align: "center", width: TableWidthEnum.Status },
  { prop: "orgStatus", label: TableLabelEnum.Status, width: TableWidthEnum.Status, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: 300, fixed: "right" }
];
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ statusType: 1 });
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getTreeList(newParams);
};

// 删除公司信息
const deleteAccount = async (params: SysOrganization.organization) => {
  console.log(params);
  await useHandleData(deleteRows, { ids: [params.orgId] }, `删除【${params.orgName}】`);
  proTable.value?.getTableList();
};

/**
 * 切换状态
 * @param params
 */
const changeOrgStatus = async params => {
  const newStatus = params.orgStatus === 1 ? 0 : 1;
  const requestData = { orgId: params.orgId, orgStatus: newStatus };
  await XGConfirmBox(OrganizationHttp.changeOrganizationStatus, requestData, `切换【${params.orgName}】状态`, "切换成功！");
  proTable.value?.getTableList();
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<SysOrganization.organization> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};
</script>
