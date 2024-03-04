<template>
  <div class="main-box">
    <TreeFilter title="一级区域" :data="firstAreaData" @change="changeTreeFilter" id="areaId" label="areaName" />
    <div class="table-box">
      <ProTable
        ref="proTable"
        rowKey="areaId"
        title="区域列表"
        highlight-current-row
        :columns="columns"
        :request-api="getTableList"
        :init-param="treeFilterValues"
        :data-callback="dataCallback"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" icon="MapLocation" @click="openFirstAreaManage">一级区域管理</el-button>
          <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增二级区域</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link icon="View" @click="openDrawer('查看', scope.row)"> 查看</el-button>
          <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑</el-button>
          <el-button type="primary" link icon="EditPen" @click="deleteArea(scope.row)"> 删除</el-button>
        </template>
      </ProTable>
    </div>
    <Drawer ref="drawerRef" :update-data="refreshPage" />
    <FirstAreaDrawer ref="firstAreaDrawerRef" :updateFirstAreaData="Init"></FirstAreaDrawer>
    <el-dialog v-model="drawerVisible" :close-on-click-modal="false" title="查看附件" :destroy-on-close="true" width="50%">
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
  </div>
</template>

<script setup lang="tsx" name="areaManage">
import { ref, reactive } from "vue";
import { useHandleData, XGConfirmBox } from "@/hooks/useHandleData";

import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { AreaHttp } from "@/api/modules/control/area";
import { TableWidthEnum, TableLabelEnum } from "@/enums/TableEnum";
import { AreaHandle } from "@/views/meetRoomManage/meetingArea/components";

import { ReqPagePlus, ResPage } from "@/api/interface";
import { AreaType } from "@/api/interface/control/area";
/* 引入组件 */
import TreeFilter from "@/components/TreeFilter/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "@/views/meetRoomManage/meetingArea/components/Drawer.vue";
import FirstAreaDrawer from "@/views/meetRoomManage/meetingArea/components/firstAreaDrawer.vue";
import { RoomType } from "@/api/interface/control/MeetRoom";

const proTable = ref<ProTableInstance>();
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const firstAreaDrawerRef = ref<InstanceType<typeof FirstAreaDrawer> | null>(null);
// 一级区域的列表
let firstAreaData = ref([]);
// 获取数据
const getTableList = (params: ReqPagePlus) => {
  return AreaHttp.getAreaListByPage(params);
};
/**
 * 因为分页组件的原因 dataCallBack不能使用异步 ！！！！！！！！！
 * @param res
 */
const dataCallback = (res: ResPage<AreaType.area[]>) => {
  let data: AreaType.area[] = [];

  res.data.forEach(item => {
    if (item.parentId !== 0) {
      data.push(item);
    }
  });

  let total = 0;
  // 总条数的计算方法  判断是否传了parentId  传了就是部分  不传就是全部
  if (typeof treeFilterValues.value.parentId === "number") {
    total = res.total;
  } else {
    total = res.total - firstAreaData.value?.length || 0; // 没传 就减掉一级区域的长度
  }
  return {
    list: data,
    total: total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
// 树的默认参数
const treeFilterValues = ref<ReqPagePlus>({
  pageNum: 1,
  pageSize: 10,
  parentId: 1
});
/**
 * 切换一级区域的时候 把 一级区域的id 给 二级区域列表查询的 parentId 条件
 */
const changeTreeFilter = (val: bigint) => {
  proTable.value!.pageable.pageNum = 1;
  console.log(val);
  if (val === "" || !val) {
    val = 1;
  }
  treeFilterValues.value.parentId = val;
};
// 打开 drawer(新增、查看、编辑)
let fileList = ref<any>([]);
const drawerVisible = ref(false);
// 查看附件
const fileDetail = (row: Partial<RoomType.Room> = {}) => {
  drawerVisible.value = true;
  fileList.value = row.files;
};
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
    label: "二级区域名称",
    align: "left",
    width: TableWidthEnum.Parent,
    search: { el: "input" }
  },
  { prop: "areaDescr", label: "备注" },
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
  { prop: "createTime", label: "创建时间", width: TableWidthEnum.LongTime },
  { prop: "operation", label: "操作", fixed: "right", width: TableWidthEnum.Handle3 }
];

const openDrawer = (title: string, row: Partial<AreaType.area> = {}) => {
  const params = {
    title,
    isFirst: false, // 是否是新增一级区域
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? AreaHttp.addRow : title === "编辑" ? AreaHttp.updateRow : undefined
  };
  drawerRef.value?.acceptParams(params);
};

/**
 * 删除二级区域
 */
async function deleteArea(row) {
  await XGConfirmBox(AreaHttp.deleteRows, [row.areaId], "删除后不可恢复，确认删除？");
  proTable.value.getTableList();
}

/**
 * 打开一级区域管理的页面
 */
function openFirstAreaManage() {
  firstAreaDrawerRef.value?.acceptParams();
}

/**
 * 初始化页面
 * @constructor 初始化页面
 */
async function Init() {
  firstAreaData.value = await AreaHandle.getFirstArea();
}

Init();

/**
 * 刷新页面数据
 */
function refreshPage() {
  proTable.value?.getTableList();
}
</script>
