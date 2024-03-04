<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    title="一级区域管理"
    :destroy-on-close="true"
    :modal="false"
    @close="updateProTable"
  >
    <ProTable
      ref="proTable"
      title="一级区域列表"
      rowKey="areaId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
      highlight-current-row
      style="min-height: 50vh"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增一级区域</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link icon="EditPen" @click="deleteArea(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <Drawer ref="addDrawerRef" :update-data="refreshPage"></Drawer>
    <el-dialog v-model="fileDrawerVisible" :close-on-click-modal="false" title="查看附件" :destroy-on-close="true" width="50%">
      <el-table :data="fileList" border style="width: 100%" height="400">
        <el-table-column prop="fileName" label="文件名称" />
        <el-table-column prop="fileId" label="文件编号"></el-table-column>
        <el-table-column prop="fileUrl" label="下载" align="center">
          <template #default="scope">
            <el-link
              :href="scope.row.fileUrl"
              type="primary"
              download
              target="_blank"
              v-if="Math.floor(scope.row.fileSize / 10000) / 100 > 0"
              >下载
            </el-link>
            <span v-else>空文件</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileSize" label="文件大小" align="center">
          <template #default="scope">
            <span>{{ Math.floor(scope.row.fileSize / 10000) / 100 }} Mb</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" align="center" />
      </el-table>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="tsx" name="BrandManage">
// 类型注入
import { reactive, ref } from "vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
// 业务注入
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { AreaType } from "@/api/interface/control/area";
import { AreaHttp } from "@/api/modules/control/area";
import Drawer from "@/views/meetRoomManage/meetingArea/components/Drawer.vue";
import { RoomType } from "@/api/interface/control/MeetRoom";

// 接收父组件传过来的命令
const drawerVisible = ref(false);
const fileDrawerVisible = ref(false);
const acceptParams = () => {
  console.log("firstAreaDrawer 收到命令了 ");
  drawerVisible.value = true;
};

/**
 * 关闭前  调用父组件更新
 */
function updateProTable() {
  console.log("关闭弹窗触发更新数据的回调");
  // 借用父组件的方法 更新品牌数据
  props.updateFirstAreaData();
}

const proTable = ref<ProTableInstance>();

const initParam = reactive({});

/**
 * 查询数据  不分页
 * @param params
 */
const getTableList = () => {
  return AreaHttp.getAreaList({ parentId: 0 });
};
const fileList = ref([]);
// 表格配置项
const columns: ColumnProps<AreaType.area>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  {
    prop: "areaId",
    label: "区域ID",
    align: "left",
    width: TableWidthEnum.BigIntNum
  },
  {
    prop: "areaName",
    label: "区域名称",
    align: "left",
    width: TableWidthEnum.Name
  },
  {
    prop: "attachment",
    label: "附件",
    width: TableWidthEnum.Status,
    align: "center",
    render: scope => {
      return (
        <>
          {
            <el-button type="primary" link onClick={() => fileDetail(scope.row)}>
              查看
            </el-button>
          }
        </>
      );
    }
  },
  {
    prop: "areaDescr",
    label: "备注",
    align: "left"
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: TableWidthEnum.Handle2 }
];

const props = defineProps({
  updateFirstAreaData: {
    type: Function,
    default: () => {
      console.log("触发默认的方法");
    }
  }
});
/**
 * 打开新增 或者编辑的窗口
 */
const addDrawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<AreaType.area> = {}) => {
  const params = {
    title,
    isFirst: true,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? AreaHttp.addRow : title === "编辑" ? AreaHttp.updateRow : undefined
  };
  addDrawerRef.value?.acceptParams(params);
};

/**
 * 删除区域
 * @param row
 */
async function deleteArea(row: AreaType.area) {
  await XGConfirmBox(AreaHttp.deleteRows, [row.areaId], "确认删除该区域");
  proTable.value?.getTableList();
}

/**
 * 刷新页面数据
 */
function refreshPage() {
  proTable.value?.getTableList();
}

// 查看附件
const fileDetail = (row: Partial<RoomType.Room> = {}) => {
  fileDrawerVisible.value = true;
  fileList.value = row.files;
};
defineExpose({
  acceptParams
});
</script>
