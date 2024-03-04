<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="设备台账"
      row-key="terminalId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="downloadFile">导出台账</el-button>
      </template>
      <template #terminalLabel="scope">
        <p class="sliverCard" v-show="scope.row.terminalLabel">
          {{ scope.row.terminalLabel }}
        </p>
      </template>

      <template #resourceTypeId="scope">
        <el-tag>{{ scope.row.typeName }}</el-tag>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="Mange">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { ElMessageBox } from "element-plus";
import { TableSourceTypeOptions, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { MeetSourceType } from "@/api/interface/source";
import { ReqPagePlus, ResPage } from "@/api/interface";
import { TerminalHttp } from "@/api/modules/source/terminal";
import { useDownload } from "@/hooks/useDownload";
// 权限集
const authStore = useAuthStore();
// 表格
const proTable = ref();

const statusLabel = ["故障", "在线", "离线"]; //  0 故障 1 在线  2 离线
// 表格配置项
const columns: ColumnProps<MeetSourceType.terminal>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "terminalId", label: "设备ID", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "terminalName", label: "设备名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "terminalLabel", label: "资产标签", align: "center", minWidth: 220 },
  {
    prop: "resourceTypeId",
    label: "资源类型",
    width: TableWidthEnum.Parent,
    isFilterEnum: false,
    enum: TableSourceTypeOptions,
    search: {
      el: "select",
      props: { placeholder: "请选择资源类型", filterable: true, remote: true, reserveKeyword: true }
    }
  },

  { prop: "roomName", label: "会议室名称", align: "left", width: TableWidthEnum.Parent },
  { prop: "areaName", label: "位置", align: "left", width: TableWidthEnum.Parent },
  { prop: "brandName", label: "品牌名称", align: "left", width: TableWidthEnum.Type },
  { prop: "modelName", label: "设备型号", align: "left", width: TableWidthEnum.Type },
  { prop: "jobName", label: "管理岗位", align: "left", width: TableWidthEnum.Parent }
];
// 初始化的请求参数
let initParam = ref<{ [key: string]: any }>({});

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

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出设备数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(TerminalHttp.exportTerminalLedger, "设备台账", proTable.value?.searchParam)
  );
};
</script>
<style scoped lang="scss">
.sliverCard {
  width: 180px;
  height: 25px;
  padding: 5px 8px;
  margin: 3px auto;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  background: linear-gradient(45deg, #2f2d2b, #9aa39a, #3b3c41);
  border-radius: 2px;
  box-shadow: 2px 2px 2px rgb(0 0 0 / 75%);
}
</style>
