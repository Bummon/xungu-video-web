<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="组件列表"
      row-key="componentId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!--      开关操作-->
      <template #componentStatus="scope">
        <el-switch
          v-model="scope.row.componentStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="Brush">设计</el-button>
        <el-button type="primary" link icon="Setting" @click="openAttrDrawer(scope.row.componentName, scope.row.componentId)"
          >属性
        </el-button>
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <Index ref="attrDrawerRef" />
  </div>
</template>

<script setup lang="ts" name="ComponentManage">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import Drawer from "./Drawer.vue";
import Index from "@/views/mainData/component/componentAttr/index.vue";
import { BaseComponent } from "@/api/interface/player/baseComponent";
import { addRow, changeStatusById, deleteRows, getListByPage, updateRow } from "@/api/modules/player/component";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";

const authStore = useAuthStore();

const proTable = ref();

// 表格配置项
const columns: ColumnProps<BaseComponent.Component>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index, align: "left" },
  { prop: "componentName", label: "组件名称", width: TableWidthEnum.Name, align: "left", search: { el: "input" } },
  { prop: "componentKey", label: "关联key", width: TableWidthEnum.BigIntNum, align: "left" },
  { prop: "componentDescr", label: TableLabelEnum.Descr, align: "left" },
  { prop: "componentType", label: TableLabelEnum.Type, width: TableWidthEnum.SingleString, align: "left" },
  { prop: "componentSort", label: TableLabelEnum.Sort, width: TableWidthEnum.Status, align: "left" },
  { prop: "componentStatus", label: TableLabelEnum.Status, width: TableWidthEnum.Status, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle4, fixed: "right" },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: TableWidthEnum.LongTime, align: "left" }
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
const openDrawer = (title: string, row: Partial<BaseComponent.Component> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { componentStatus: 0 } : { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

/**
 * 删除行数据
 * @param params
 */
const deleteRow = async (params: BaseComponent.Component) => {
  await useHandleData(deleteRows, { ids: [params.componentId] }, `删除【${params.componentName}】组件`);
  proTable.value?.getTableList();
};

// 切换状态
const changeStatus = async (params: BaseComponent.Component) => {
  const newStatus = params.componentStatus === 1 ? 0 : 1;
  const requestData = { componentId: params.componentId, componentStatus: newStatus };
  const message = `切换【${params.componentName}】组件状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};

const attrDrawerRef = ref<InstanceType<typeof Index> | null>(null);
const openAttrDrawer = (title: string, componentId: number) => {
  const params = {
    title,
    componentId
  };
  attrDrawerRef.value?.acceptParams(params);
};
</script>
