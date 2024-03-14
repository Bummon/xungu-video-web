<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="AI配置"
      rowKey="aiId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-has="'system:aiConfig:add'" type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增 </el-button>
        <!--        -->
        <el-button
          v-has="'system:aiConfig:remove'"
          :disabled="!scope.isSelected"
          type="danger"
          icon="Delete"
          plain
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <!-- 扩展 -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!--      开关操作-->
      <template #enabled="scope">
        <el-switch
          v-model="scope.row.enabled"
          :disabled="!AuthUtils.hasPermission('system:aiConfig:edit')"
          inline-prompt
          active-text="启用"
          :active-value="1"
          :inactive-value="0"
          inactive-text="禁用"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-has="'system:aiConfig:edit'" type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)"
          >编辑
        </el-button>
        <el-button v-has="'system:aiConfig:remove'" type="primary" link icon="Delete" @click="deleteAccount(scope.row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <!--<ImportExcel ref="dialogRef" />-->
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { AuthUtils } from "@/utils/auth";
import { sysAiConfig } from "@/api/interface/system/sysAiConfig";
import {
  addAiConfig,
  changeAiConfigStatus,
  deleteAiConfig,
  getAiConfigPage,
  updateAiConfig
} from "@/api/modules/system/aiConfig";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
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

const getTableList = (params: sysAiConfig.AiConfig) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getAiConfigPage(newParams);
};
// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: TableLabelEnum.Index, width: 50 },
  {
    prop: "apiKey",
    label: "SDK AppId",
    align: "left",
    width: TableWidthEnum.BigIntNum
  },
  {
    prop: "secretKey",
    label: "Secret Key",
    align: "left"
  },
  {
    prop: "identifier",
    label: "Identifier",
    align: "left"
  },
  {
    prop: "expireTime",
    label: "过期时长（秒）",
    align: "left"
  },
  {
    prop: "enabled",
    label: TableLabelEnum.Status,
    align: "left",
    width: TableWidthEnum.Status
  },
  {
    prop: "createTime",
    label: "创建时间",
    align: "left",
    width: TableWidthEnum.LongTime
  },
  {
    prop: "modifyTime",
    label: "最后修改时间",
    align: "left",
    width: TableWidthEnum.LongTime
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 320 }
];
// 删除用户信息
const deleteAccount = async (params: sysAiConfig.AiConfig) => {
  await useHandleData(deleteAiConfig, [params.aiId], `删除AppId[${params.apiKey}]的配置信息`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (ids: number[] | bigint[]) => {
  await useHandleData(deleteAiConfig, ids, "删除所选AppId配置信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 切换用户状态
const changeStatus = async (row: sysAiConfig.AiConfig) => {
  const enabled = row.enabled == 1 ? 0 : 1;
  await useHandleData(
    changeAiConfigStatus,
    {
      aiId: row.aiId,
      enabled: enabled
    },
    `切换AppId[${row.apiKey}]的状态`
  );
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addAiConfig : title === "编辑" ? updateAiConfig : undefined,
    getTableList: proTable.value?.getTableList
  };
  console.log("api", params.api);
  drawerRef.value?.acceptParams(params);
};
</script>
