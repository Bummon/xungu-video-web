<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="巡检计划"
      row-key="typeId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增巡检计划</el-button>
      </template>
      <!--      开关操作-->
      <template #inspectionStatus="scope">
        <el-switch
          v-model="scope.row.inspectionStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>

      <template #typeIds="scope">
        <div class="" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-start">
          <el-tag v-if="scope.row.typeIds.includes(SourceTypeEnums.Matrix.id)" style="margin: 1px 2px">
            {{ SourceTypeEnums.Matrix.name }}
          </el-tag>
          <el-tag v-if="scope.row.typeIds.includes(SourceTypeEnums.AudioControl.id)" style="margin: 1px 2px">
            {{ SourceTypeEnums.AudioControl.name }}
          </el-tag>
          <el-tag v-if="scope.row.typeIds.includes(SourceTypeEnums.VideoTerminal.id)" style="margin: 1px 2px">
            {{ SourceTypeEnums.VideoTerminal.name }}
          </el-tag>
          <el-tag v-if="scope.row.typeIds.includes(SourceTypeEnums.VideoCamera.id)" style="margin: 1px 2px">
            {{ SourceTypeEnums.VideoCamera.name }}
          </el-tag>
          <el-tag v-if="scope.row.typeIds.includes(SourceTypeEnums.Power.id)" style="margin: 1px 2px">
            {{ SourceTypeEnums.Power.name }}
          </el-tag>
          <el-tag v-if="scope.row.typeIds.includes(SourceTypeEnums.RecordingHost.id)" style="margin: 1px 2px">
            {{ SourceTypeEnums.RecordingHost.name }}
          </el-tag>
        </div>
      </template>
      <template #executionType="scope">
        <el-tag v-if="scope.row.executionType === 1">立即执行</el-tag>
        <el-tag v-if="scope.row.executionType === 2">周期执行</el-tag>
      </template>
      <!-- 操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link icon="EditPen" @click="openDrawer('修改', scope.row)">修改</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="Mange">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
import { TableLabelEnum, TableStatusOptions, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { ReqPage, ResPage } from "@/api/interface";
import { InspectionHttp } from "@/api/modules/inspection";
import { InspectionType } from "@/api/interface/inspection";
import { SourceTypeEnums } from "@/enums/sourceTypeEnums";
// 权限集
const authStore = useAuthStore();
// 表格
const proTable = ref();
// drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);

// 表格配置项
const columns: ColumnProps<InspectionType.inspection>[] = [
  // { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "inspectionId", label: "巡检ID", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "inspectionName", label: "巡检计划", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "executionType", label: "巡检频次", align: "center", width: TableWidthEnum.Type },
  { prop: "typeIds", label: "巡检资源类型", align: "center" },
  { prop: "createTime", label: "新增日期", align: "left", width: TableWidthEnum.LongTime },
  { prop: "startTime", label: "开始时间", align: "left", width: TableWidthEnum.LongTime },
  { prop: "endTime", label: "结束时间", align: "left", width: TableWidthEnum.LongTime },
  { prop: "createUserName", label: "创建人", width: TableWidthEnum.PersonName, align: "center" },
  { prop: "inspectionStatus", label: "启用", width: TableWidthEnum.Status, enum: TableStatusOptions, search: { el: "select" } },
  {
    prop: "operation",
    label: TableLabelEnum.Operation,
    width: TableWidthEnum.Handle3,
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
  // return data; // 静态数据
  // 接口数据
  return InspectionHttp.getInspectionList(JSON.parse(JSON.stringify(params)));
};

/**
 * 接口返回的数据需要进行清洗成符合ProTable规范的数据结构
 * @param {ResPage<MeetSourceType.functionData[]>} data
 */
function dataCallback(data: ResPage<InspectionType.inspection[]>) {
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
const changeStatus = async (params: InspectionType.inspection): Promise<boolean> => {
  const newStatus = params.inspectionStatus === 1 ? 0 : 1;
  const requestData = { inspectionId: params.inspectionId, inspectionStatus: newStatus };
  const message = `切换【${params.inspectionName}】功能的状态`;
  try {
    await useHandleData(InspectionHttp.changeInspectionStatus, requestData, message);
    proTable.value?.getTableList();
    return true;
  } catch (e) {
    return false;
  }
};
/**
 * 删除计划
 * @param row
 */
const deleteRow = async (row: InspectionType.inspection) => {
  try {
    await XGConfirmBox(InspectionHttp.deleteInspectionRow, { ids: [row.inspectionId] }, "确定删除该计划？");
    proTable.value.getTableList();
  } catch (e) {
    console.log(e);
  }
};
/**
 * 打开新增或编辑的弹窗
 * @param title
 * @param {InspectionType.inspection} row
 * @param api
 */
const openDrawer = (title: string, row: Partial<InspectionType.inspection> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? InspectionHttp.addInspectionRow : title === "修改" ? InspectionHttp.updateInspectionRow : undefined,
    getTableList: proTable.value!.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};
</script>
