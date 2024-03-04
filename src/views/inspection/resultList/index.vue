<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="巡检结果"
      row-key="typeId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="Connection" @click="openDrawer('查看', scope.row)" v-if="scope.row.faultNumber > 0"
          >查看
        </el-button>
        <el-tag v-else>无</el-tag>
      </template>
      <template #executionType="scope">
        <el-tag v-if="scope.row.executionType === 1" type="">立即执行</el-tag>
        <el-tag v-if="scope.row.executionType === 2" type="">周期执行</el-tag>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="resultList">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { ReqPage, ResPage } from "@/api/interface";
import { MeetSourceType } from "@/api/interface/source";
import { ResourceTypeHttp } from "@/api/modules/source/resourceType";
import { InspectionResultHttp } from "@/api/modules/inspectionResult";
import { InspectionResultType } from "@/api/interface/inspectionResult";
// 权限集
const authStore = useAuthStore();
// 表格
const proTable = ref();
// drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);

// 表格配置项
const columns: ColumnProps<InspectionResultType.inspectionResult>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "taskId", label: "任务编号", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "inspectionName", label: "计划名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "createTime", label: "执行时间", align: "left" },
  { prop: "executionType", label: "巡检频次", align: "center", width: TableWidthEnum.Type },
  { prop: "startTime", label: "开始日期", align: "left", width: TableWidthEnum.LongTime },
  { prop: "endTime", label: "终止日期", align: "left", width: TableWidthEnum.LongTime },
  { prop: "number", label: "设备数量", align: "center", width: TableWidthEnum.Status },
  { prop: "faultNumber", label: "异常", align: "center", width: TableWidthEnum.Status },
  {
    prop: "operation",
    label: "异常设备",
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
  return InspectionResultHttp.getInspectionResultList(JSON.parse(JSON.stringify(params)));
};

/**
 * 接口返回的数据需要进行清洗成符合ProTable规范的数据结构
 * @param {ResPage<MeetSourceType.functionData[]>} data
 */
function dataCallback(data: ResPage<MeetSourceType.resourceType[]>) {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
}

/**
 * 切换状态
 * @param {MeetSourceType.functionData}
 */
const changeStatus = async (params: MeetSourceType.resourceType): Promise<boolean> => {
  const newStatus = params.typeStatus === 1 ? 0 : 1;
  const requestData = { typeId: params.typeId, typeStatus: newStatus };
  const message = `切换【${params.typeName}】功能的状态`;
  try {
    await useHandleData(ResourceTypeHttp.changeResourceTypeStatus, requestData, message);
    proTable.value?.getTableList();
    return true;
  } catch (e) {
    return false;
  }
};
/**
 * 打开新增或编辑的弹窗
 * @param title
 * @param {InspectionResultType.inspectionResult} row
 * @param api
 */
const openDrawer = (title: string, row: Partial<InspectionResultType.inspectionResult> = {}) => {
  const params = {
    taskId: row.taskId
  };
  drawerRef.value?.acceptParams(params);
};
</script>
