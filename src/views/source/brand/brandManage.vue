<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    title="品牌管理"
    :destroy-on-close="true"
    @close="updateProTable"
  >
    <ProTable
      ref="proTable"
      title="品牌列表"
      rowKey="brandId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      :pagination="true"
      highlight-current-row
      style="min-height: 50vh"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增品牌</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteDrawer(scope.row)">删除</el-button>
      </template>
      <template #brandStatus="scope">
        <el-switch
          v-model="scope.row.brandStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
    </ProTable>
    <!--    <DialogDetail ref="drawerRef" />-->
    <BrandDrawer ref="brandDrawer"></BrandDrawer>
  </el-dialog>
</template>

<script setup lang="tsx" name="BrandManage">
// 类型注入
import { reactive, ref } from "vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import { ReqPage } from "@/api/interface";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";

// 业务注入
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { MeetSourceType } from "@/api/interface/source";
import { BrandHttp } from "@/api/modules/source/brand";

import BrandDrawer from "@/views/source/brand/components/brandDrawer.vue";
import { ResourceTypeHttp } from "@/api/modules/source/resourceType";
import { sourceTypeIdEnum } from "@/enums/sourceTypeEnums";
// 接收父组件传过来的命令
const drawerVisible = ref(false);

interface DrawerProps {
  getTableList: () => void;
}

const drawerProps = ref({
  getTableList: () => {
    console.log("未传");
  }
});
const acceptParams = (params: DrawerProps) => {
  drawerProps.value.getTableList = params.getTableList;
  drawerVisible.value = true;
};

/**
 * 关闭前  调用父组件更新
 */
function updateProTable() {
  console.log("关闭弹窗触发更新数据的回调");
  // 借用父组件的方法 更新品牌数据
  props.updateBrandData();
}

const proTable = ref<ProTableInstance>();

const initParam = reactive({});

const getTableList = (params: ReqPage) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return BrandHttp.getBrandList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
/**
 * 切换状态
 * @param { MeetSourceType.brand } params 行数据
 */
const changeStatus = async (Row: MeetSourceType.brand): Promise<boolean> => {
  const newStatus = Row.brandStatus === 1 ? 0 : 1;
  const requestData = { brandId: Row.brandId, brandStatus: newStatus };
  const message = `切换【${Row.brandName}】品牌的状态`;
  try {
    await useHandleData(BrandHttp.changeBrandStatus, requestData, message);
    proTable.value?.getTableList();
    return true;
  } catch (e) {
    return false;
  }
};
// 表格配置项
const columns: ColumnProps<MeetSourceType.brand>[] = [
  { type: "selection", fixed: "left", width: 40 },
  { type: "index", label: "No", width: 50 },
  {
    prop: "brandId",
    label: "品牌ID",
    align: "left",
    width: TableWidthEnum.BigIntNum
  },
  {
    prop: "brandName",
    label: "品牌名称",
    align: "left"
  },
  {
    prop: "brandStatus",
    label: TableLabelEnum.Status,
    align: "left",
    width: TableWidthEnum.Status
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: TableWidthEnum.Handle2 }
];

// 打开 drawer(新增、查看、编辑)
const brandDrawer = ref<InstanceType<typeof BrandDrawer>>();
/**
 * 新增或编辑品牌
 * @param title
 * @param row
 */
const openDrawer = (title: string, row: Partial<MeetSourceType.brand> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? BrandHttp.addBrandRow : title === "编辑" ? BrandHttp.updateBrandRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  brandDrawer.value?.acceptParams(params);
};
const deleteDrawer = async row => {
  let res = await XGConfirmBox(BrandHttp.deleteRows, [row.brandId], "确认删除该品牌，此操作不可恢复");
  console.log(res);
  proTable.value?.getTableList();
};
const props = defineProps({
  updateBrandData: {
    type: Function,
    default: () => {
      console.log("触发默认的方法");
    }
  }
});

defineExpose({
  acceptParams
});
</script>
