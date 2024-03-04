<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="计划清单列表"
      row-key="roomId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增计划清单</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" v-if="scope.row.billStatus == 1" link icon="Edit" @click="openAudit(scope.row)"
          >审核
        </el-button>
        <el-button type="primary" v-if="scope.row.billStatus == 0" link icon="Edit" @click="submitAudit(scope.row)"
          >提交审核
        </el-button>
        <el-button
          type="primary"
          v-if="scope.row.billStatus == 0 || scope.row.billStatus == 1"
          link
          icon="EditPen"
          @click="openDrawer('编辑', scope.row)"
          >编辑
        </el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="RoomManage">
import { reactive, ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import type { Action } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { addRow, auditRow, deleteRows, getListByPage, updateRow } from "@/api/modules/release/playList";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { BaseRoom } from "@/api/interface/player/baseRoom";
import { useHandleData } from "@/hooks/useHandleData";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { PlanMedia } from "@/api/interface/player/playerPlanMedia";

const proTable = ref<ProTableInstance>();

// 表格配置项
const status = [
  {
    label: "草稿",
    value: 0,
    tagType: "info"
  },
  {
    label: "待审核",
    value: 1,
    tagType: "warning"
  },
  {
    label: "已审核",
    value: 2,
    tagType: ""
  },
  {
    label: "已发布",
    value: 3,
    tagType: ""
  },
  {
    label: "已完成",
    value: 4,
    tagType: "success"
  },
  {
    label: "作废",
    value: 5,
    tagType: "danger"
  }
];
// 表格配置项
const columns: ColumnProps<PlanMedia.PlanMediaRowData>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "billTitle", label: "清单名称", align: "left", search: { el: "input" } },
  {
    prop: "billStatus",
    label: "审核状态",
    align: "left",
    tag: true,
    enum: status,
    width: TableWidthEnum.Status
  },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle3, align: "center", fixed: "right" }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ billType: 2 });

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
// 获取分页数据 多加一个参数billType

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
const submitAudit = (row: Partial<PlanMedia.PlanMediaRow> = {}) => {
  ElMessageBox.confirm("是否提交审核?", "提示", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    // 提交审核
    const data = await updateRow({ billId: row.billId, billStatus: 1 });
    console.log(data);
    if (data.code == 200) {
      ElMessage({
        type: "success",
        message: "提交成功"
      });
    } else {
      ElMessage({
        type: "error",
        message: data.msg
      });
    }
    proTable.value?.getTableList();
  });
};
const openAudit = (row: Partial<BaseRoom.Room> = {}) => {
  ElMessageBox.confirm("是否通过审核?", "提示", {
    distinguishCancelAndClose: true,
    confirmButtonText: "通过",
    cancelButtonText: "驳回",
    type: "warning"
  })
    .then(async () => {
      const data = await auditRow({ billId: row.billId, billStatus: 2 });
      console.log(data);
      if (data.code == 200) {
        ElMessage({
          type: "success",
          message: "通过"
        });
      } else {
        ElMessage({
          type: "error",
          message: data.msg
        });
      }
      proTable.value?.getTableList();
    })
    .catch(async (action: Action) => {
      if (action === "cancel") {
        const { data } = await auditRow({ billId: row.billId, billStatus: 0 });
        console.log(data);
        ElMessage({
          type: "warning",
          message: "驳回"
        });
        proTable.value?.getTableList();
      }
    });
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
// 打开Draw 把row行数据传递过去
const openDrawer = (title: string, row: Partial<PlanMedia.PlanMediaRow> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
//删除
const deleteRow = async (params: BaseRoom.Room) => {
  await useHandleData(deleteRows, { ids: [params.billId] }, `删除【${params.billTitle}】清单`);
  proTable.value?.getTableList();
};
</script>
