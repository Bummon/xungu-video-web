<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="应用列表"
      row-key="appId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增应用</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单图标 -->
      <template #appType="scope">
        <p v-if="scope.row.appType === 1">移动应用</p>
        <p v-if="scope.row.appType === 0">PC应用</p>
      </template>
      <!--      开关操作-->
      <template #appStatus="scope">
        <el-switch
          v-model="scope.row.appStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
          :disabled="scope.row.appKey === 'admin'"
        ></el-switch>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button
          type="primary"
          link
          icon="Setting"
          @click="openParamDrawer(scope.row.appName, scope.row.appId)"
          v-if="scope.row.appKey !== 'admin'"
          >配置
        </el-button>
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)" v-if="scope.row.appKey !== 'admin'"
          >编辑
        </el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)" v-if="scope.row.appKey !== 'admin'">
          删除
        </el-button>
        <p v-if="scope.row.appKey === 'admin'" style="font-style: italic; color: #727272">不可修改</p>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <Index ref="paramDrawerRef" />
  </div>
</template>

<script setup lang="ts" name="AppManage">
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import Drawer from "./Drawer.vue";
import { sysApp } from "@/api/interface/system1/sysApp";
import { addRow, changeStatusById, deleteRows, getListByPage, updateRow } from "@/api/modules/system1/app";
import Index from "./appParam/index.vue";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

const proTable = ref();

// 表格配置项
const columns: ColumnProps<sysApp.app>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "appName", label: "应用名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "appKey", label: "关联key", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "appDescr", label: TableLabelEnum.Descr, align: "left" },
  { prop: "appSort", label: TableLabelEnum.Sort, width: TableWidthEnum.Status, align: "left" },
  { prop: "appStatus", label: TableLabelEnum.Status, width: TableWidthEnum.Status, align: "center" },
  { prop: "appType", label: "应用类型", width: TableWidthEnum.Status, align: "left" },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, align: "left", width: TableWidthEnum.LongTime },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle3, fixed: "right" }
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
const openDrawer = (title: string, row: Partial<sysApp.app> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { appStatus: 0 } : { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

/**
 * 删除行数据
 * @param params
 */
const deleteRow = async (params: sysApp.app) => {
  await useHandleData(deleteRows, { ids: [params.appId] }, `删除【${params.appName}】应用`);
  proTable.value?.getTableList();
};

/**
 * @description 切换应用的状态 el-switch
 * @param {sysApp.app} 行数据(必传)
 * @return {Promise<boolean>} el-switch只接受boolean返回值
 */
const changeStatus = async (params: sysApp.app) => {
  const newStatus = params.appStatus === 1 ? 0 : 1;
  const requestData = { appId: params.appId, appStatus: newStatus };
  const message = `切换【${params.appName}】应用状态`;
  await useHandleData(changeStatusById, requestData, message);
  await proTable.value?.getTableList();
};

const paramDrawerRef = ref<InstanceType<typeof Index> | null>(null);
const openParamDrawer = (title: string, appId: bigint) => {
  const params = {
    title,
    appId
  };
  paramDrawerRef.value?.acceptParams(params);
};
</script>
