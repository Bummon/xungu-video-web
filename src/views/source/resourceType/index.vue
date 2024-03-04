<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="资源类型管理"
      row-key="typeId"
      :indent="30"
      :columns="columns"
      :request-api="ResourceTypeHttp.getListByPage"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增资源类型</el-button>
      </template>
      <!--      开关操作-->
      <template #typeStatus="scope">
        <el-switch
          v-model="scope.row.typeStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
          :disabled="sourceTypeIdEnum.includes(scope.row.typeId)"
        ></el-switch>
      </template>

      <!-- 操作 -->
      <template #operation="scope">
        <el-text type="info" tag="i" v-if="sourceTypeIdEnum.includes(scope.row.typeId)">内置类型，不可修改</el-text>
        <div class="" v-else>
          <el-button type="primary" link icon="EditPen" @click="openDrawer('修改', scope.row)">修改</el-button>
          <el-button type="primary" link icon="Delete" @click="deleteDrawer(scope.row)">删除</el-button>
        </div>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="Mange">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
import { TableLabelEnum, TableSourceTypeOptions, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { ReqPage, ResPage } from "@/api/interface";
import { MeetSourceType } from "@/api/interface/source";
import { ResourceTypeHttp } from "@/api/modules/source/resourceType";
import { sourceTypeIdEnum } from "@/enums/sourceTypeEnums";
// 权限集
const authStore = useAuthStore();
// 表格
const proTable = ref();
// drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);

// 表格配置项
const columns: ColumnProps<MeetSourceType.resourceType>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "typeId", label: "资源ID", align: "left", width: TableWidthEnum.BigIntNum },
  {
    prop: "typeName",
    label: "资源类型",
    align: "left",
    width: TableWidthEnum.Name,
    render: scope => {
      return (
        <span
          style={
            sourceTypeIdEnum.includes(scope.row.typeId) ? { fontWeight: "normal", fontStyle: "italic" } : { fontStyle: "normal" }
          }
        >
          {scope.row.typeName}
        </span>
      );
    }
  },
  { prop: "typeDescr", label: "说明", align: "left" },
  { prop: "createTime", label: "新增日期", align: "left", width: TableWidthEnum.LongTime },
  {
    prop: "typeStatus",
    label: "启用",
    width: TableWidthEnum.Status
  },
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
  // return data; // 静态数据
  // 接口数据
  return ResourceTypeHttp.getListByPage(JSON.parse(JSON.stringify(params)));
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
 * @param {MeetSourceType.resourceType} row
 * @param api
 */
const openDrawer = (title: string, row: Partial<MeetSourceType.resourceType> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? ResourceTypeHttp.addRow : title === "修改" ? ResourceTypeHttp.updateRow : undefined,
    getTableList: proTable.value!.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};
const deleteDrawer = async row => {
  let res = await XGConfirmBox(ResourceTypeHttp.deleteRows, [row.typeId], "确认删除该类型，此操作不可恢复");
  console.log(res);
  proTable.value?.getTableList();
};
</script>
