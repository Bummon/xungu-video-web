<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="功能管理"
      row-key="functionId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增功能</el-button>
      </template>
      <!--      开关操作-->
      <template #functionStatus="scope">
        <el-switch
          v-model="scope.row.functionStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('修改', scope.row)">修改</el-button>
        <el-button type="primary" link icon="EditPen" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="Mange">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Brush, Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
import { TableLabelEnum, TableStatusOptions, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { MeetSourceType } from "@/api/interface/source";
import { BaseDiyLayout } from "@/api/interface/player/baseDiyLayout";
import { changeStatusById } from "@/api/modules/player/diyLayout";
import { ReqPage, ResPage, ResultData } from "@/api/interface";
import { FunctionHttp } from "@/api/modules/source/funciton";
// 权限集
const authStore = useAuthStore();
// 表格
const proTable = ref();
// drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);

// 表格配置项
const columns: ColumnProps<MeetSourceType.functionData>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "functionId", label: "功能ID", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "functionName", label: "功能名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "functionDescr", label: "备注", align: "left" },
  {
    prop: "functionStatus",
    label: "启用",
    width: TableWidthEnum.Status,
    isFilterEnum: false,
    enum: TableStatusOptions,
    search: {
      el: "select",
      props: { placeholder: "请选择启用停用状态", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  { prop: "createTime", label: "新增日期", align: "left", width: TableWidthEnum.LongTime },
  {
    prop: "operation",
    label: TableLabelEnum.Operation,
    width: TableWidthEnum.Handle2,
    fixed: "right"
  }
];
// 初始化的请求参数
const initParam = reactive({});
import data from "./data.json";

/**
 * @description 获取功能的列表
 *
 */
const getTableList = (params: ReqPage) => {
  return FunctionHttp.getListByPage(JSON.parse(JSON.stringify(params)));
};

/**
 * 接口返回的数据需要进行清洗成符合ProTable规范的数据结构
 * @param {ResPage<MeetSourceType.functionData[]>} data
 */
function dataCallback(data: ResPage<MeetSourceType.functionData[]>) {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
}

/**
 * 切换状态
 * @param {MeetSourceType.functionData} params 行数据
 */
const changeStatus = async (Row: MeetSourceType.functionData): Promise<boolean> => {
  const newStatus = Row.functionStatus === 1 ? 0 : 1;
  const requestData = { functionId: Row.functionId, functionStatus: newStatus };
  const message = `切换【${Row.functionName}】功能的状态`;
  try {
    await useHandleData(FunctionHttp.changeFunctionStatus, requestData, message);
    proTable.value?.getTableList();
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 删除
 * @param row
 */
async function deleteRow(row) {
  await XGConfirmBox(
    FunctionHttp.deleteFunction,
    { ids: [row.functionId] },
    "删除后不可恢复，并与关联数据解除绑定，确认删除吗？"
  );
  proTable.value?.getTableList();
}

/**
 * 打开新增或编辑的弹窗
 * @param title
 * @param {MeetSourceType.functionData} row
 * @param api
 */
const openDrawer = (title: string, row: Partial<MeetSourceType.functionData> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? FunctionHttp.addRow : title === "修改" ? FunctionHttp.updateRow : undefined,
    getTableList: proTable.value!.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};
</script>
