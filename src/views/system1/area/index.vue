<template>
  <div class="main-box">
    <TreeFilter
      label="areaName"
      title="区域列表"
      :data="treeFilterData"
      :default-value="initParam.parentId"
      @change="changeTreeFilter"
    />
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="区域列表"
        row-key="areaId"
        :indent="30"
        :columns="columns"
        :request-api="getTableList"
        :init-param="initParam"
        :pagination="true"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增区域</el-button>
        </template>
        <!--      开关操作-->
        <template #areaStatus="scope">
          <el-switch
            v-model="scope.row.areaStatus"
            :active-value="1"
            :inactive-value="0"
            :beforeChange="changeStatus.bind(this, scope.row)"
          ></el-switch>
        </template>
        <!-- 菜单图标 -->
        <template #icon="scope">
          <el-icon :size="18">
            <component :is="scope.row.meta.icon"></component>
          </el-icon>
        </template>
        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button v-if="scope.row.parentId != 0" type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"
            >编辑
          </el-button>
          <el-button type="primary" link :icon="CirclePlus" @click="openDrawer('新增', scope.row)">新增</el-button>
          <el-button v-if="scope.row.parentId != 0" type="primary" link :icon="Delete" @click="deleteAccount(scope.row)"
            >删除
          </el-button>
        </template>
      </ProTable>
      <Drawer ref="drawerRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="Mange">
import { onMounted, reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { addRow, changeAreaStatus, deleteRows, getListByPage, getTreeList, updateRow } from "@/api/modules/system1/area";
import Drawer from "./Drawer.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { sysArea } from "@/api/interface/system1/sysArea";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

onMounted(() => {
  getTreeFilter();
});

const proTable = ref();
// 表格配置项
const columns: ColumnProps<sysArea.TreeArea>[] = [
  { type: "selection", fixed: "left", width: 40 },
  { type: "index", label: "No", width: 50 },
  { prop: "areaName", label: "区域名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "areaStatus", label: TableLabelEnum.Status, width: 70 },
  { prop: "areaSort", label: TableLabelEnum.Sort, align: "left" },
  { prop: "helpCode", label: "助记码", width: 300, align: "left", search: { el: "input" } },
  { prop: "operation", label: TableLabelEnum.Operation, width: 150, fixed: "right" }
];

const treeFilterData = ref<any>([]);
const getTreeFilter = async () => {
  const { data } = await getTreeList({
    parentId: 0
  });
  treeFilterData.value = data;
  // initParam.parentId = treeFilterData.value[0].areaId;
  console.log(initParam.parentId);
};
// 树形筛选切换
const changeTreeFilter = (val: string) => {
  proTable.value!.pageable.pageNum = 1;
  console.log(val);
  initParam.parentId = val;
};
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
  parentId: 0,
  statusType: 1
});
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getListByPage(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
// 删除区域信息
const deleteAccount = async (params: sysArea.area) => {
  console.log(params);
  await useHandleData(deleteRows, { ids: [params.areaId] }, `删除【${params.areaName}】`);
  proTable.value?.getTableList();
};

// 切换区域状态
const changeStatus = async (params: sysArea.area) => {
  const newStatus = params.areaStatus === 1 ? 0 : 1;
  const requestData = { areaId: params.areaId, areaStatus: newStatus };
  const message = `切换【${params.areaName}】区域状态`;
  await useHandleData(changeAreaStatus, requestData, message);
  proTable.value?.getTableList();
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<sysArea.area> = {}) => {
  console.log("title", title);
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    initParam: initParam,
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList,
    tableData: proTable.value.tableData,
    treeFilterData: treeFilterData.value
  };
  drawerRef.value?.acceptParams(params);
};
</script>
