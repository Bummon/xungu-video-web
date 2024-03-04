<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="岗位列表"
      row-key="jobId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增岗位</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!--      开关操作-->
      <template #jobStatus="scope">
        <el-switch
          v-model="scope.row.jobStatus"
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
    <Drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="Manage">
import { reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
import Drawer from "./Drawer.vue";
import { sysJob } from "@/api/interface/system1/sysJob";
import { addRow, changeStatusById, deleteRows, getListByPage, updateRow } from "@/api/modules/system1/job";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";

const authStore = useAuthStore();
const proTable = ref();

// 表格配置项
const columns: ColumnProps<sysJob.job>[] = [
  { type: "index", label: "No", width: 50 },
  { prop: "jobName", label: "岗位名称", align: "left", width: 200, search: { el: "input" } },
  { prop: "jobDescr", label: "岗位描述", align: "left" },
  { prop: "jobSort", label: "排位顺序", align: "center", width: TableWidthEnum.Sort },
  { prop: "jobStatus", label: TableLabelEnum.Status, align: "left", width: TableWidthEnum.Status },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 160 }
  // { prop: "modifyTime", label: TableLabelEnum.ModifyTime, align: "left", width: 170 }
];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ statusType: 1 });

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
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
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<sysJob.job> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { groupStatus: 0 } : { ...row },
    api: title === "新增" ? addRow : title === "编辑" ? updateRow : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
const deleteRow = async (params: sysJob.job) => {
  await XGConfirmBox(deleteRows, { ids: [params.jobId] });
  proTable.value.getTableList();
  // 原先框架中封装的方法 不能catch到错误后的信息码msg  暂时手动创建一个提示框 防止出问题
  // ElMessageBox.confirm(`确认删除?`, "温馨提示", {
  //   confirmButtonText: "确定",
  //   cancelButtonText: "取消",
  //   type: "warning",
  //   draggable: true
  // }).then(async () => {
  //   try {
  //     let res = await deleteRows({ ids: [params.jobId] });
  //     if (res.code && res.code === 200) {
  //       ElNotification({
  //         title: "操作",
  //         message: `删除成功!`,
  //         type: "success",
  //         duration: 2000
  //       });
  //       proTable.value.getTableList();
  //     }
  //   } catch (e) {
  //     let msg = "操作失败";
  //     if (e.msg && e.msg === "被绑定数据不能删除") {
  //       msg = `有其他数据绑定该岗位下，
  //       无法删除该岗位`;
  //     }
  //     ElNotification.error(msg);
  //   }
  // });
};

// 切换状态
const changeStatus = async (params: sysJob.job) => {
  const newStatus = params.jobStatus === 1 ? 0 : 1;
  const requestData = { jobId: params.jobId, jobStatus: newStatus };
  const message = `切换【${params.jobName}】岗位状态`;
  await useHandleData(changeStatusById, requestData, message);
  proTable.value?.getTableList();
};
</script>
