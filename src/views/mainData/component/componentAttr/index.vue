<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" width="90%" :title="`${drawerProps.title}属性`">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="属性列表"
        row-key="attrId"
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
        <template #attrStatus="scope">
          <el-switch
            v-model="scope.row.attrStatus"
            :active-value="1"
            :inactive-value="0"
            :beforeChange="changeStatus.bind(this, scope.row)"
          ></el-switch>
        </template>

        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </ProTable>
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
    </template>
    <Drawer ref="drawerRef" />
  </el-dialog>
</template>

<script setup lang="ts" name="AttrManage">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import Drawer from "./Drawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { BaseComponentAttr } from "@/api/interface/player/baseComponentAttr";
import { addRow, changeStatusById, deleteRows, getListByPage, updateRow } from "@/api/modules/player/componentAttr";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";

const drawerVisible = ref(false);
const proTable = ref();

// 表格配置项
const columns: ColumnProps<BaseComponentAttr.ComponentAttr>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "attrName", label: "属性名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "attrKey", label: "属性Key", align: "left", width: 230 },
  { prop: "attrDataType", label: "值类型", align: "left", width: 230 },
  { prop: "attrValue", label: "属性值", align: "left", width: 230 },
  { prop: "attrSort", label: TableLabelEnum.Sort, align: "left", width: 100 },
  { prop: "attrDescr", label: TableLabelEnum.Descr, align: "left" },
  { prop: "attrStatus", label: TableLabelEnum.Status, width: TableWidthEnum.Status, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: 150, fixed: "right" },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: 170, align: "left" }
];

interface DrawerProps {
  title: string;
  componentId: number;
}

const drawerProps = ref<DrawerProps>({
  title: "",
  componentId: 0
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ componentId: drawerProps.value.componentId, statusType: 1 });

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.componentId = drawerProps.value.componentId;
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
const openDrawer = (title: string, row: Partial<BaseComponentAttr.ComponentAttr> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row:
      title === "新增"
        ? { attrStatus: 0, componentId: drawerProps.value.componentId }
        : { ...row, componentId: drawerProps.value.componentId },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 切换状态
const changeStatus = async (params: BaseComponentAttr.ComponentAttr) => {
  const newStatus = params.attrStatus === 1 ? 0 : 1;
  const requestData = { attrId: params.attrId, attrStatus: newStatus };
  const message = `切换【${params.attrName}】属性状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};

/**
 * 删除行数据
 * @param params
 */
const deleteRow = async (params: BaseComponentAttr.ComponentAttr) => {
  await useHandleData(deleteRows, { ids: [params.attrId] }, `删除【${params.attrName}】属性`);
  proTable.value?.getTableList();
};

defineExpose({
  acceptParams
});
</script>
