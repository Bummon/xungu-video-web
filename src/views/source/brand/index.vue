<template>
  <div class="main-box">
    <TreeFilter title="品牌列表" :data="BrandData" @change="changeTreeFilter" id="brandId" label="brandName" />
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="型号列表"
        highlight-current-row
        :columns="columns"
        :request-api="getTableList"
        :init-param="treeFilterValues"
        :data-callback="dataCallBack"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" icon="Pointer" @click="openDialog">品牌管理</el-button>
          <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增型号</el-button>
        </template>
        <template #functionName="scope">
          <div class="flex flex-wrap gap-2 my-2" v-if="scope.row.functionName">
            <el-tag
              v-for="item in scope.row.functionName.split(',')"
              :key="item"
              class="mx-1"
              effect="dark"
              round
              style="margin-right: 2px"
            >
              {{ item }}
            </el-tag>
          </div>
          <div class="" v-else>
            <el-tag class="mx-1" effect="light" round> 未添加功能</el-tag>
          </div>
        </template>
        <!--        切换启用停用-->
        <template #modelStatus="scope">
          <el-switch
            v-model="scope.row.modelStatus"
            :active-value="1"
            :inactive-value="0"
            :beforeChange="changeStatus.bind(this, scope.row)"
          ></el-switch>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <div class="" v-if="ALLOW_PRESET || scope.row.preset !== 1">
            <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
            <el-button type="primary" link icon="EditPen" @click="deleteDrawer(scope.row)">删除</el-button>
          </div>
          <div class="" v-else>内置属性，不可修改</div>
        </template>
      </ProTable>
      <BrandManage ref="brandManage" :updateBrandData="InitData" />
      <ModelDrawer ref="modelDrawer" />
    </div>
  </div>
</template>
<script setup lang="ts" name="useSelectFilter">
// 工具
import { onMounted, ref, Ref } from "vue";
import { ElMessage } from "element-plus";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
// 组件
import ProTable from "@/components/ProTable/index.vue";
import BrandManage from "@/views/source/brand/brandManage.vue";
import ModelDrawer from "@/views/source/brand/components/modelDrawer.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
// 类型
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { TableLabelEnum, TableSourceTypeOptions, TableStatusOptions, TableWidthEnum } from "@/enums/TableEnum";
// 业务
import { BrandHttp } from "@/api/modules/source/brand";
import { MeetSourceType } from "@/api/interface/source";
import { ResPage, ReqPage, ResultData } from "@/api/interface";
import { BrandHandle } from "@/views/source/brand/index";
import { ALLOW_PRESET } from "@/config/index";
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();
const brandManage = ref();
// 单选
const radio = ref("");

/**
 * 品牌列表
 */
const BrandData = ref<MeetSourceType.brand[]>();

/**
 * @description 获取型号的列表
 *
 */
function getTableList(params: MeetSourceType.ReqModelList) {
  return BrandHttp.getModelList(params);
}

function dataCallBack(data: ResPage<MeetSourceType.model[]>) {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
}

// 表格配置项
const columns: ColumnProps[] = [
  { type: "index", label: "#", width: TableWidthEnum.Index },
  { prop: "modelId", label: "型号ID", width: TableWidthEnum.BigIntNum },
  { prop: "modelName", label: "型号名称", width: TableWidthEnum.Name },
  { prop: "brandName", label: "所属品牌", width: TableWidthEnum.Parent },
  { prop: "protocolName", label: "控制协议", width: TableWidthEnum.Parent },
  { prop: "functionName", label: "关联功能" },
  {
    prop: "modelStatus",
    label: "启用",
    width: TableWidthEnum.Status,
    isFilterEnum: false,
    enum: TableStatusOptions,
    search: {
      el: "select",
      props: { placeholder: "请选择启用停用状态", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle2, fixed: "right" }
];

// 树的默认参数
const treeFilterValues = ref({ pageNum: 1, pageSize: 10 });
const changeTreeFilter = (val: bigint) => {
  proTable.value!.pageable.pageNum = 1;
  treeFilterValues.value.brandId = val;
};
/**
 * 切换状态
 * @param { MeetSourceType.brand } params 行数据
 */
const changeStatus = async (Row: MeetSourceType.model): Promise<boolean> => {
  const newStatus = Row.modelStatus === 1 ? 0 : 1;
  const requestData = { modelId: Row.modelId, modelStatus: newStatus };
  const message = `切换【${Row.modelName}】状态`;
  try {
    await useHandleData(BrandHttp.changeModelStatus, requestData, message);
    proTable.value?.getTableList();
    return true;
  } catch (e) {
    return false;
  }
};
/**
 * @description 品牌管理
 */
const openDialog = () => {
  const params = {
    getTableList: proTable.value?.getTableList
  };
  brandManage.value.acceptParams(params);
};

const deleteDrawer = async row => {
  let res = await XGConfirmBox(BrandHttp.deleteModel, [row.modelId], "确认删除该型号，此操作不可恢复");
  console.log(res);
  proTable.value?.getTableList();
};

/**
 * 关闭窗口时 刷新ProTable
 */
function updateProTable() {
  getTableList: proTable.value?.getTableList();
}

/**
 * @description 型号的新增与修改弹窗
 */
const modelDrawer = ref<InstanceType<typeof ModelDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<MeetSourceType.model> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? BrandHttp.addModel : title === "编辑" ? BrandHttp.updateModel : undefined,
    getTableList: proTable.value?.getTableList
  };
  modelDrawer.value?.acceptParams(params);
};

async function InitData() {
  // 获取品牌
  BrandData.value = await BrandHandle.getBrandList();
  console.log("初始化品牌数据完成");
}

InitData();
</script>
