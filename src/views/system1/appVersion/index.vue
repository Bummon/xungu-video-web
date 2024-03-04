<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="版本列表"
      row-key="versionId"
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
      <template #versionStatus="scope">
        <el-switch
          v-model="scope.row.versionStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>

      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button
          type="primary"
          link
          icon="Platform"
          @click="openRangeDrawer('选择', scope.row.terminalId?.toString(), scope.row.versionId.toString())"
          >设备
        </el-button>
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <!--    <TerminalDrawer ref="terminalDrawerRef" />-->
    <Range ref="rangeDrawerRef" />
  </div>
</template>

<script setup lang="ts" name="VersionManage">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import Drawer from "./Drawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { sysAppVersion } from "@/api/interface/system1/sysAppVersion";
import { addRow, changeStatusById, deleteRows, getListByPage, updateRow } from "@/api/modules/system1/version";
import Range from "@/views/system/appVersion/appVersionRange/Drawer.vue";
import { addRangeRow } from "@/api/modules/system1/versionRange";
import { TableLabelEnum } from "@/enums/TableEnum";

const proTable = ref();

// 表格配置项
const columns: ColumnProps<sysAppVersion.appVersion>[] = [
  { type: "selection", fixed: "left", width: 40 },
  { type: "index", label: "No", width: 50, align: "left" },
  { prop: "title", label: "标题", align: "left", search: { el: "input" }, width: 250 },
  { prop: "versionNum", label: "版本号", align: "left", search: { el: "input" }, width: 250 },
  {
    prop: "isMust",
    label: "必要更新",
    align: "left",
    render: scope => {
      if (scope.row.isMust == 0) {
        return "否";
      } else {
        return "是";
      }
    },
    width: 100
  },
  { prop: "versionDescr", label: TableLabelEnum.Descr, align: "left" },
  { prop: "versionStatus", label: TableLabelEnum.Status, width: 70, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: 250, fixed: "right" },
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
const openDrawer = (title: string, row: Partial<sysAppVersion.appVersion> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 切换状态
const changeStatus = async (params: sysAppVersion.appVersion) => {
  const newStatus = params.versionStatus === 1 ? 0 : 1;
  const requestData = { versionId: params.versionId, versionStatus: newStatus };
  const message = `切换【${params.title}】版本状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};

/**
 * 删除行数据
 * @param params
 */
const deleteRow = async (params: sysAppVersion.appVersion) => {
  await useHandleData(deleteRows, { ids: [params.versionId] }, `删除【${params.title}】版本`);
  proTable.value?.getTableList();
};

// 打开 drawer(设备)
// const terminalDrawerRef = ref<InstanceType<typeof TerminalDrawer> | null>(null);
// const openTerminalDrawer = () => {
//   console.log("1");
// };
const rangeDrawerRef = ref<InstanceType<typeof Range> | null>(null);
const openRangeDrawer = (title: string, terminalId: string, versionId: number) => {
  let ids: Array<string> = [];
  if (terminalId != undefined) {
    ids = terminalId.split(",");
  }
  const params = {
    title: title,
    ids: ids,
    versionId: versionId,
    api: addRangeRow
  };
  rangeDrawerRef.value?.acceptParams(params);
};
</script>
