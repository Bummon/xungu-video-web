<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="分组列表"
      row-key="groupId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增分组</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!--      开关操作-->
      <template #groupStatus="scope">
        <el-switch
          v-model="scope.row.groupStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="GroupManage">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import Drawer from "./Drawer.vue";
import { BaseTerminalGroup } from "@/api/interface/player/baseTerminalGroup";
import { addRow, deleteRows, updateRow, getListByPage, changeStatusById } from "@/api/modules/player/group";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";

const authStore = useAuthStore();
const proTable = ref();

// 表格配置项
const columns: ColumnProps<BaseTerminalGroup.Group>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "groupName", label: "分组名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "terminalName", label: "终端名称", align: "left" },
  { prop: "groupDescr", label: TableLabelEnum.Descr, align: "left" },
  { prop: "terminalNum", label: "终端数量", width: TableWidthEnum.BigIntNum, align: "center" },
  { prop: "groupStatus", label: TableLabelEnum.Status, width: 70, align: "left" },
  { prop: "groupSort", label: TableLabelEnum.Sort, width: TableWidthEnum.Status, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: 150, fixed: "right" },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, align: "left", width: 170 }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ statusType: 1 });

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getListByPage(newParams);
};

/**
 * 返回列表数据进行格式处理
 * @param data
 */
const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<BaseTerminalGroup.Group> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { groupStatus: 0 } : { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

/**
 * 删除行数据
 * @param params
 */
const deleteRow = async (params: BaseTerminalGroup.Group) => {
  await useHandleData(deleteRows, { ids: [params.groupId] }, `删除【${params.groupName}】分组`);
  proTable.value?.getTableList();
};

// 切换状态
const changeStatus = async (params: BaseTerminalGroup.Group) => {
  const newStatus = params.groupStatus === 1 ? 0 : 1;
  const requestData = { groupId: params.groupId, groupStatus: newStatus };
  const message = `切换【${params.groupName}】分组状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};
</script>
