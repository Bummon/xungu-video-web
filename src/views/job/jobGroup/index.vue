<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="执行器列表"
      row-key="id"
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
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <el-dialog v-model="centerDialogVisible" title="注册节点" width="20%" align-center>
      <div v-for="(it, index) in siteOptions" :key="index">
        <span>{{ index + 1 }}、</span><span>{{ it }}</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="SiteManage">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { addRow, deleteRows, updateRow, getListByGroup } from "@/api/modules/job/jobGroup";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { BaseSite } from "@/api/interface/player/baseSite";
import Drawer from "./Drawer.vue";

const proTable = ref();

// 表格配置项
const columns: ColumnProps<BaseSite.Site>[] = [
  { type: "index", label: "序号", width: 150 },
  { prop: "appname", label: "AppName", align: "left", search: { el: "input" } },
  { prop: "title", label: "名称", search: { el: "input" } },
  {
    prop: "addressType",
    label: "注册方式",
    width: 300,
    render: scope => {
      if (scope.row.addressType == 0) {
        return "自动注册";
      }
      if (scope.row.addressType == 1) {
        return "手动录入";
      }
    }
  },
  {
    prop: "addressList",
    label: "OnLine 机器地址",
    render: scope => {
      return (
        <>
          {
            <el-button type="primary" link onClick={() => toDetail(scope.row)}>
              查看
            </el-button>
          }
        </>
      );
    }
  },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getListByGroup(newParams);
};

/**
 * 返回列表数据进行格式处理
 * @param data
 */
const dataCallback = (data: any) => {
  return {
    list: data,
    // total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
let siteOptions = ref<any>([]);
let centerDialogVisible = ref(false);
const toDetail = row => {
  siteOptions.value = row.addressList?.split(",");
  centerDialogVisible.value = true;
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<BaseSite.Site> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { addressType: 0 } : { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
/**
 * 删除行数据
 * @param params
 */
const deleteRow = async (params: BaseSite.Site) => {
  let formData = new FormData();
  formData.append("id", params.id);
  await useHandleData(deleteRows, formData, `删除【${params.title}】执行器`);
  proTable.value?.getTableList();
};
</script>
