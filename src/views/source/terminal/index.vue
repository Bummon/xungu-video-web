<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="设备管理"
      row-key="terminalId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增', {})">新增设备</el-button>
      </template>
      <!--      开关操作-->
      <template #terminalStatus="scope">
        <el-switch
          v-model="scope.row.terminalStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <template #resourceTypeId="scope">
        <el-tag>{{ scope.row.typeName }}</el-tag>
      </template>
      <template #imageUrl="scope">
        <el-image :src="scope.row.imageUrl" fit="contain" :lazy="true" style="height: 4vh"></el-image>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="openDrawer('修改', scope.row)">修改</el-button>
        <el-button
          type="primary"
          link
          icon="EditPen"
          @click="deleteTerminal(scope.row)"
          :disabled="scope.row.terminalStatus !== 0"
          >删除
        </el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <el-dialog v-model="drawerVisible" :close-on-click-modal="false" title="查看附件" :destroy-on-close="true" width="50%">
      <el-table :data="fileList" border style="width: 100%" height="400">
        <el-table-column prop="fileName" label="文件名称"></el-table-column>
        <el-table-column prop="fileId" label="文件编号"></el-table-column>
        <el-table-column prop="fileSize" label="文件大小" align="center">
          <template #default="scope">
            <span v-if="scope.row.fileSize / 1024 / 1024 > 1">{{ (scope.row.fileSize / 1024 / 1024).toFixed(2) }} Mb</span>
            <span v-else>{{ (scope.row.fileSize / 1024).toFixed(2) }} Kb</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileExt" label="文件类型" align="center" width="120">
          <template #default="scope">
            <span>{{ scope.row.fileExt.replace(".", "") }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileUrl" label="下载" align="center" width="120">
          <template #default="scope">
            <el-link :href="scope.row.fileUrl" type="primary" download>下载</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="createUserName" label="创建人" align="center" width="120" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="Mange">
import { ref, reactive } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import {
  TableLabelEnum,
  TableRunningStatusEnums,
  TableSourceTypeOptions,
  TableStatusOptions,
  TableWidthEnum
} from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { MeetSourceType } from "@/api/interface/source";
import { ReqPagePlus, ResPage } from "@/api/interface";
import { TerminalHttp } from "@/api/modules/source/terminal";
import { RoomType } from "@/api/interface/control/MeetRoom";
import { FunctionHttp } from "@/api/modules/source/funciton";
import { TerminalHandle } from "@/views/source/terminal/index";
import { ResourceTypeHttp } from "@/api/modules/source/resourceType";
// 权限集
const authStore = useAuthStore();
// 表格
const proTable = ref();
// drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const drawerVisible = ref(false); // 查看附件的窗口
const fileList = ref([]); // 附件的列表
const statusLabel = ["故障", "在线", "离线"]; //  0 故障 1 在线  2 离线
// 表格配置项
const columns: ColumnProps<MeetSourceType.terminal>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "terminalId", label: "设备ID", align: "left", width: TableWidthEnum.BigIntNum },
  {
    prop: "roomId",
    label: "选择会议室",
    isShow: false,
    align: "left",
    width: TableWidthEnum.Parent,
    enum: async () => {
      return { data: await TerminalHandle.getRoomCascaderList() };
    },
    search: {
      el: "tree-select"
    }
  },
  { prop: "terminalName", label: "设备名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  {
    prop: "resourceTypeId",
    label: "资源类型",
    isFilterEnum: false,
    enum: getResourceType,
    search: {
      el: "select",
      props: { placeholder: "请选择资源类型", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  {
    prop: "functionId",
    label: "功能",
    isShow: false,
    enum: getFunctionOptions,
    search: {
      el: "select",
      props: { placeholder: "请选择功能", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  { prop: "imageUrl", label: "图片", align: "center", width: TableWidthEnum.Parent },
  { prop: "roomName", label: "会议室名称", align: "left", width: TableWidthEnum.Parent },
  { prop: "areaName", label: "位置", align: "left" },
  {
    prop: "files",
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
    prop: "terminalStatus",
    label: "启用",
    width: TableWidthEnum.Status,
    align: "left",
    sortable: true,
    isFilterEnum: false,
    enum: TableStatusOptions,
    search: {
      el: "select",
      props: { placeholder: "请选择启用停用状态", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  {
    prop: "runningStatus",
    label: "运行状态",
    sortable: true,
    width: TableWidthEnum.Type,
    isFilterEnum: false,
    enum: TableRunningStatusEnums,
    search: {
      el: "select",
      props: { placeholder: "请选择运行状态", filterable: true, remote: true, reserveKeyword: true }
    },
    render: scope => {
      return scope.row.terminalStatus ? (
        <>
          <el-tag>{statusLabel[scope.row.runningStatus]}</el-tag>
        </>
      ) : (
        <span>--</span>
      );
    }
  },
  {
    prop: "operation",
    label: TableLabelEnum.Operation,
    width: TableWidthEnum.Handle2,
    fixed: "right"
  }
];
// 初始化的请求参数
let initParam = ref<{
  [key: string]: any;
}>({});

/**
 * 加入筛选方法
 */
function filter(): void {
  proTable.value.searchParam.avc = 1;
  proTable.value.search();
}

// 恢复初始分页 不筛选
function backInit() {
  delete proTable.value.searchParam.avc;
  proTable.value.search();
}

/**
 * @description 获取功能的列表
 *
 */
const getTableList = (params: ReqPagePlus) => {
  return TerminalHttp.getTerminalList(JSON.parse(JSON.stringify(params)));
};

/**
 * 接口返回的数据需要进行清洗成符合ProTable规范的数据结构
 * @param {ResPage<MeetSourceType.functionData[]>} data
 */
function dataCallback(data: ResPage<MeetSourceType.functionData[]>) {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
}

/**
 * 切换状态
 * @param {MeetSourceType.functionData} params 行数据
 */
const changeStatus = async (Row: MeetSourceType.terminal): Promise<boolean> => {
  const newStatus = Row.terminalStatus === 1 ? 0 : 1;
  const requestData = { terminalId: Row.terminalId, terminalStatus: newStatus };
  const message = `切换【${Row.terminalName}】功能的状态`;
  try {
    await useHandleData(TerminalHttp.changeTerminalStatus, requestData, message);
    proTable.value?.getTableList();
    return true;
  } catch (e) {
    return false;
  }
};
/**
 * 打开新增或编辑的弹窗
 * @param title
 * @param {MeetSourceType.functionData} row
 * @param api
 */
const openDrawer = (title: string, row: MeetSourceType.terminal) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? {} : { ...row, modelList: [row.brandId, row.modelId] },
    api: title === "新增" ? TerminalHttp.addTerminalRow : title === "修改" ? TerminalHttp.updateTerminalRow : undefined,
    getTableList: proTable.value!.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};

async function deleteTerminal(row) {
  console.log("删除row", row);
  ElMessageBox.confirm(`确认删除【 ${row.terminalName}】设备? 该操作将不可恢复！`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    title: "注意！",
    type: "warning"
  })
    .then(() => {
      TerminalHttp.deleteTerminalRow([row.terminalId])
        .then(res => {
          console.log("删除成功", res);
          proTable.value?.getTableList();
          ElNotification({
            title: "操作",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
        })
        .catch(() => {
          console.log("删除失败");
        });
    })
    .catch(() => {
      console.log("取消删除");
    });
}

/**
 * 附件详情
 * @param row
 */
const fileDetail = (row: Partial<RoomType.Room> = {}) => {
  drawerVisible.value = true;
  fileList.value = row.files;
};

const funcList = ref([]);

/**
 * 查询功能的选项
 */
function getFunctionOptions() {
  return new Promise((resolve, reject) => {
    let opts = [];
    try {
      FunctionHttp.getFunction().then(res => {
        if (res.data.constructor === Array && res.data.length > 0) {
          res.data.forEach(d => {
            let tmp = { label: null, value: null };
            tmp.label = d.functionName;
            tmp.value = d.functionId;
            opts.push(tmp);
          });
          resolve({ data: opts });
        } else {
          reject({ data: [] });
        }
      });
    } catch (e) {
      reject({ data: [] });
    }
  });
}

/**
 * 查询功能的选项
 */
function getResourceType() {
  return new Promise((resolve, reject) => {
    let opts = [];
    try {
      ResourceTypeHttp.getResourceTypeList().then(res => {
        if (res.data.constructor === Array && res.data.length > 0) {
          res.data.forEach(d => {
            let tmp = { label: null, value: null };
            tmp.label = d.typeName;
            tmp.value = d.typeId;
            opts.push(tmp);
          });
          resolve({ data: opts });
        } else {
          reject({ data: [] });
        }
      });
    } catch (e) {
      reject({ data: [] });
    }
  });
}
</script>
