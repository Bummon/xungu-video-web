<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      row-key="typeId"
      title="会议室类型列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新建会议室类型</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link icon="View" @click="openDrawer('查看', scope.row)"> 查看</el-button>
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteAccount(scope.row)"> 删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" :updatePage="refreshPage" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { XGConfirmBox } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "@/views/meetRoomManage/meetingRoomtype/Drawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { TableWidthEnum, TableLabelEnum } from "@/enums/TableEnum";

// 类型
import { ReqPage } from "@/api/interface";
import { RoomTypeType } from "@/api/interface/control/MeetRoomType";
import { MeetRoomTypeHttp } from "@/api/modules/control/meetRoomType";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});

const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

/**
 * 获取表格数据
 * @param params
 */
const getTableList = (params: ReqPage) => {
  return MeetRoomTypeHttp.getListByPage(JSON.parse(JSON.stringify(params)));
};

// 表格配置项
const columns: ColumnProps<RoomTypeType.RoomType>[] = [
  { type: "index", label: "No", width: TableWidthEnum.Index },
  {
    prop: "typeId",
    label: "类型ID",
    width: TableWidthEnum.BigIntNum
  },
  {
    prop: "typeName",
    label: "会议室类型名称",
    search: { el: "input" },
    width: TableWidthEnum.Name
  },
  {
    prop: "typeDescr",
    label: "说明"
  },
  {
    prop: "createTime",
    label: "新增日期",
    width: TableWidthEnum.LongTime
  },
  { prop: "operation", label: "操作", fixed: "right", width: TableWidthEnum.Handle3 }
];

// 删除会议室类型
const deleteAccount = async (row: RoomTypeType.RoomType) => {
  await XGConfirmBox(MeetRoomTypeHttp.deleteRoomType, { ids: [row.typeId] }, `删除后不可恢复，确认删除吗？`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<RoomTypeType.RoomType> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? MeetRoomTypeHttp.addRow : title === "编辑" ? MeetRoomTypeHttp.updateRow : undefined
  };
  drawerRef.value?.acceptParams(params);
};

/**
 * 刷新页面
 */
function refreshPage() {
  proTable.value.getTableList();
}
</script>
