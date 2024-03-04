<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="设备协议管理"
      row-key="protocolId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增协议</el-button>
        <!--        <el-button type="danger" icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">-->
        <!--          批量删除-->
        <!--        </el-button>-->
      </template>

      <!-- 操作 -->
      <template #operation="scope">
        <div class="" v-if="ALLOW_PRESET || scope.row.preset !== 1">
          <el-button type="primary" link icon="EditPen" @click="openDrawer('修改', scope.row)">修改</el-button>
          <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
        </div>
        <div class="" v-else>内置属性，不可修改</div>
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
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { ReqPage, ResPage } from "@/api/interface";
import { MeetSourceType } from "@/api/interface/source";
import { ProtocolHttp } from "@/api/modules/source/protocol";
import { ALLOW_PRESET } from "@/config";
// 权限集
const authStore = useAuthStore();
// 表格
const proTable = ref();
// drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);

// 表格配置项
const columns: ColumnProps<MeetSourceType.protocol>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "protocolId", label: "协议ID", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "protocolName", label: "协议名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "protocolCode", label: "协议编号", align: "left", width: TableWidthEnum.Status },
  { prop: "interfaceType", label: "接口类别", align: "left", width: TableWidthEnum.Status },
  { prop: "interfaceCode", label: "接口编号", align: "left", width: TableWidthEnum.Status },
  { prop: "ipPort", label: "目标IP", align: "left", search: { el: "input" } },
  { prop: "serialBps", label: "串口波特率", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "serialCheck", label: "串口校验", align: "left", width: TableWidthEnum.Status },
  { prop: "serialStop", label: "串口停止位", align: "left", width: TableWidthEnum.BigIntNum },
  {
    prop: "operation",
    label: TableLabelEnum.Operation,
    width: TableWidthEnum.Handle2,
    fixed: "right"
  }
];
// 初始化的请求参数
const initParam = reactive({});

/**
 * @description 获取功能的列表
 *
 */
const getTableList = (params: ReqPage) => {
  return ProtocolHttp.getProtocolList(JSON.parse(JSON.stringify(params)));
};

/**
 * 接口返回的数据需要进行清洗成符合ProTable规范的数据结构
 * @param {ResPage<MeetSourceType.functionData[]>} data
 */
function dataCallback(data: ResPage<MeetSourceType.protocol[]>) {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
}

/**
 * 批量删除信息
 * @param id
 */
const batchDelete = async (id: string[]) => {
  await useHandleData(ProtocolHttp.deleteProtocol, { ids: id }, "删除所选命令信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

/**
 * 单独删除
 * @param row
 */
async function deleteRow(row) {
  await XGConfirmBox(ProtocolHttp.deleteProtocol, { ids: [row.protocolId] }, "删除后不可恢复，确认删除？");
  proTable.value?.getTableList();
}

/**
 * 打开新增或编辑的弹窗
 * @param title
 * @param {MeetSourceType.resourceType} row
 * @param api
 */
const openDrawer = (title: string, row: Partial<MeetSourceType.command> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? {} : { ...row },
    api: title === "新增" ? ProtocolHttp.addProtocolRow : title === "修改" ? ProtocolHttp.updateProtocolRow : undefined,
    getTableList: proTable.value!.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};
</script>
