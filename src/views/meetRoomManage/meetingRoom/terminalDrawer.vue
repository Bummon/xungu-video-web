<template>
  <div class="dialog-container">
    <el-dialog
      v-model="drawerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :show-close="true"
      :title="title"
      :modal="false"
      draggable
    >
      <ProTable
        ref="proTable"
        title="设备管理"
        row-key="terminalId"
        :indent="20"
        :columns="columns"
        :request-api="getTableList"
        :init-param="initParam"
        :pagination="true"
        :data-callback="dataCallback"
        class="proTable"
      >
        <!-- 表格 header 按钮 -->
        <!--        <template #tableHeader>-->
        <!--          <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增', {})">新增设备</el-button>-->
        <!--        </template>-->
        <!--      开关操作-->
        <template #terminalStatus="scope">
          <el-switch
            v-model="scope.row.terminalStatus"
            :active-value="1"
            :inactive-value="0"
            :beforeChange="changeStatus.bind(this, scope.row)"
          ></el-switch>
        </template>
        <template #resourceTypeId="scope">
          <el-tag>{{ scope.row.typeName }}</el-tag>
        </template>
        <template #imageUrl="scope">
          <el-image :src="scope.row.imageUrl" fit="contain" :lazy="true" style="height: 4vh"></el-image>
        </template>
      </ProTable>
      <template #footer>
        <el-button type="primary" @click="drawerVisible = false"> 关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="terminal">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import {
  TableLabelEnum,
  TableRunningStatusEnums,
  TableSourceTypeOptions,
  TableStatusOptions,
  TableWidthEnum
} from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { MeetSourceType } from "@/api/interface/source";
import { ReqPagePlus, ResPage } from "@/api/interface";
// 权限集
const authStore = useAuthStore();
// 表格
const proTable = ref();

const statusLabel = ["故障", "在线", "离线"]; //  0 故障 1 在线  2 离线
interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<MeetSourceType.terminal>;
}

const drawerVisible = ref(false);
const drawerProps: Ref<DrawerProps> = ref<DrawerProps>({
  isView: false,
  row: {}
});
const title = ref("");
// 表格配置项
const columns: ColumnProps<MeetSourceType.terminal>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "terminalName", label: "设备名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "brandName", label: "品牌", align: "left", width: TableWidthEnum.Parent },
  { prop: "modelName", label: "型号", align: "left", width: TableWidthEnum.Parent },
  {
    prop: "resourceTypeId",
    label: "资源类型",
    isFilterEnum: false,
    enum: TableSourceTypeOptions,
    search: {
      el: "select",
      props: { placeholder: "请选择资源类型", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  {
    prop: "terminalStatus",
    label: "启用",
    width: TableWidthEnum.Status,
    align: "left",
    sortable: true,
    isFilterEnum: false,
    enum: TableStatusOptions,
    search: {
      el: "select",
      props: { placeholder: "请选择启用停用状态", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  {
    prop: "runningStatus",
    label: "运行状态",
    sortable: true,
    isFilterEnum: false,
    enum: TableRunningStatusEnums,
    search: {
      el: "select",
      props: { placeholder: "请选择运行状态", filterable: true, remote: true, reserveKeyword: true }
    },
    render: scope => {
      return <el-tag>{statusLabel[scope.row.runningStatus]}</el-tag>;
    }
  }
];
// 初始化的请求参数
let initParam = ref<{ [key: string]: any }>({});

/**
 * 加入筛选方法
 */
function filter(): void {
  proTable.value.searchParam.avc = 1;
  proTable.value.search();
}

// 恢复初始分页 不筛选
function backInit() {
  delete proTable.value.searchParam.avc;
  proTable.value.search();
}

import { TerminalHttp } from "@/api/modules/source/terminal";

/**
 * @description 获取功能的列表
 *
 */
const getTableList = (params: ReqPagePlus) => {
  return TerminalHttp.getTerminalList(JSON.parse(JSON.stringify(params)));
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
const changeStatus = async (Row: MeetSourceType.terminal): Promise<boolean> => {
  const newStatus = Row.runningStatus === 1 ? 0 : 1;
  const requestData = { terminalId: Row.terminalId, terminalStatus: newStatus };
  const message = `切换【${Row.terminalName}】功能的状态`;
  try {
    await useHandleData(TerminalHttp.changeTerminalStatus, requestData, message);
    proTable.value?.getTableList();
    return true;
  } catch (e) {
    return false;
  }
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  initParam.value = { roomId: params.row.roomId };
  title.value = params.row.roomName;
  drawerProps.value = params;
  drawerVisible.value = true;
};
defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
.dialog-container {
  :deep(.el-dialog) {
    width: 70vw;
    height: 90vh;
    margin-top: 5vh;
    margin-bottom: 0;
    overflow-y: scroll;
    .el-dialog__header {
      height: 5vh;
    }
    .el-dialog__body {
      height: 80vh;
      padding: 0;
      overflow-y: scroll;
      .table-main {
        height: 70vh;
        overflow-y: scroll;
      }
    }
    .el-dialog__footer {
      height: 5vh;
    }
  }
}
</style>
