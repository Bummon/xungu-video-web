<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="设备管理"
      row-key="equipmentId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-has="'base:equipment:add'" type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增 </el-button>
        <el-button v-has="'system:loginLog:remove'" type="danger" icon="Delete" plain @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>
      <!-- 扩展 -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 菜单图标 -->
      <template #icon>
        <el-icon :size="18">
          <component :is="'Avatar'"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button v-has="'base:equipment:edit'" type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)"
          >编辑
        </el-button>
        <el-button v-has="'base:equipment:remove'" type="primary" link icon="Delete" @click="deleteRow(scope.row)">
          删除
        </el-button>
        <p v-if="scope.row.defaultType === 1" style="font-style: italic; color: #9f9e9e">系统默认，不可修改</p>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import Drawer from "./Drawer.vue";
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { useAppStore } from "@/stores/modules/appStore";
import { sysRole } from "@/api/interface/system/sysRole";
import { addEquipment, deleteEquipment, getEquipmentPage, updateEquipment } from "@/api/modules/base/equipment";
import { TEquipment } from "@/api/interface/base/tEquipment";

// 表格配置项
const columns: ColumnProps<sysRole.Role>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: 50 },
  { prop: "equipmentCode", label: "设备ID", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "equipmentName", label: "设备名称", align: "left", width: TableWidthEnum.Name },
  { prop: "ip", label: "IP", width: TableWidthEnum.Name, align: "center" },
  { prop: "remark", label: "描述说明", align: "left" },
  { prop: "createUsername", label: "创建人", width: TableWidthEnum.PersonName, align: "left" },
  { prop: "createTime", label: "创建时间", width: TableWidthEnum.LongTime, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle3, fixed: "right" }
];

const authStore = useAuthStore();
const appStore = useAppStore();
const proTable = ref();

const initParam = reactive({ statusType: 1 });

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
const openDrawer = (title: any, row: Partial<TEquipment.Equipment> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addEquipment : title === "编辑" ? updateEquipment : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const dialogVisible = ref(false);
const loading = ref(false);

//删除角色
const deleteRow = async (params: TEquipment.Equipment) => {
  await useHandleData(deleteEquipment, [params.equipmentId], `删除设备【${params.eqipmentName}】`);
  proTable.value?.getTableList();
};

// 批量删除
const batchDelete = async (ids: number[] | bigint[]) => {
  console.log(ids);
  await useHandleData(deleteEquipment, ids, "删除所选设备");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};
const getTableList = params => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getEquipmentPage(newParams);
};
</script>
