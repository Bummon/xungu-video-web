<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" width="90%" :title="`${drawerProps.title}配置`">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="配置列表"
        row-key="configId"
        :indent="30"
        :columns="columns"
        :request-api="getTableList"
        :init-param="initParam"
        :pagination="true"
        :data-callback="dataCallback"
      >
        <!-- 菜单图标 -->
        <template #icon="scope">
          <el-icon :size="18">
            <component :is="scope.row.meta.icon"></component>
          </el-icon>
        </template>
        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </ProTable>
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
    </template>
    <Drawer ref="drawerRef" />
  </el-dialog>
</template>

<script setup lang="ts" name="ConfigManage">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import Drawer from "./Drawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { BaseTerminalConfig } from "@/api/interface/player/baseTerminalConfig";
import { addRow, deleteRows, getListByPage, updateRow } from "@/api/modules/player/terminalConfig";
import { status } from "@/api/modules/player/terminalConfig";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

const drawerVisible = ref(false);
const proTable = ref();

// 表格配置项
const columns: ColumnProps<BaseTerminalConfig.Config>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "configValue", label: "值（Value）", align: "left", width: 350 },
  { prop: "configSort", label: TableLabelEnum.Sort, align: "left", width: 100 },
  { prop: "configDescr", label: TableLabelEnum.Descr, align: "left" },
  {
    prop: "configStatus",
    label: TableLabelEnum.Status,
    width: 70,
    tag: true,
    enum: status,
    align: "left"
  },
  { prop: "operation", label: TableLabelEnum.Operation, width: 150, fixed: "right" },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, align: "left", width: 170 }
];

interface DrawerProps {
  title: string;
  terminalId: number;
}

const drawerProps = ref<DrawerProps>({
  title: "",
  terminalId: 0
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log("prop", params);
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ appId: drawerProps.value.terminalId });

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.terminalId = drawerProps.value.terminalId;
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
const openDrawer = (title: string, row: Partial<BaseTerminalConfig.Config> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, terminalId: drawerProps.value.terminalId },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

/**
 * 删除行数据
 * @param params
 */
const deleteRow = async (params: BaseTerminalConfig.Config) => {
  await useHandleData(deleteRows, { ids: [params.configId] }, `删除【${params.configDescr}】参数`);
  proTable.value?.getTableList();
};

defineExpose({
  acceptParams
});
</script>
