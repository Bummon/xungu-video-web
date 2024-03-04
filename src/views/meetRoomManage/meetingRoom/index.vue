<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      row-key="roomId"
      title="会议室列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新建会议室</el-button>
      </template>
      <template #roomStatus="scope">
        <el-switch
          v-model="scope.row.roomStatus"
          :active-value="1"
          :inactive-value="0"
          :before-change="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <!--      会议室类型 -->
      <template #roomTypeId="scope">
        <span>{{ scope.row.roomTypeName }}</span>
      </template>
      <template #runningStatus="scope">
        <el-tag type="danger" v-if="scope.row.runningStatus === 0" effect="dark"> 故障</el-tag>
        <el-tag type="" v-if="scope.row.runningStatus === 1" effect="dark">在线</el-tag>
        <el-tag type="info" v-if="scope.row.runningStatus === 2" effect="dark">离线</el-tag>
      </template>
      <template #areaId="scope">
        <span>{{ scope.row.areaName }}</span>
      </template>

      <!--      <template #imageUrl="scope">-->
      <!--        <el-image :src="scope.row.imageUrl" />-->
      <!--      </template>-->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="View" @click="openDrawer('查看', scope.row)"> 查看</el-button>
        <el-button type="primary" link icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑</el-button>
        <el-button type="primary" link icon="Connection" @click="openDrawer('场景', scope.row)" v-if="appkey === 'control'"
          >场景控制</el-button
        >
        <el-button type="primary" link icon="Delete" @click="deleteAccount(scope.row)" v-if="scope.row.roomStatus === 0">
          删除
        </el-button>
      </template>
    </ProTable>
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
    <Drawer ref="drawerRef" :updatePage="refreshPage" />
    <ImportExcel ref="dialogRef" />
    <TerminalDrawer ref="terminalRef"></TerminalDrawer>
    <SceneDrawer ref="sceneDrawer"></SceneDrawer>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive, onMounted } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import Drawer from "@/views/meetRoomManage/meetingRoom/Drawer.vue";
import { ProTableInstance, ColumnProps, SearchRenderScope } from "@/components/ProTable/interface";
import { RoomHttp } from "@/api/modules/control/meetRoom";
import { TableWidthEnum, TableLabelEnum } from "@/enums/TableEnum";
// 组件
import TerminalDrawer from "@/views/meetRoomManage/meetingRoom/terminalDrawer.vue";
import SceneDrawer from "@/views/meetRoomManage/meetingRoom/sceneDrawer.vue";
// 类型
import { ReqPage } from "@/api/interface";
import { RoomType } from "@/api/interface/control/MeetRoom";
import { MeetRoomTypeHttp } from "@/api/modules/control/meetRoomType";
import { MeetingRoomHandle } from "@/views/meetRoomManage/meetingRoom/index";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const appkey = localStorage.getItem("xungu-app");
console.log("appkey", appkey);
// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
// 打开设备列表
const terminalRef = ref<InstanceType<typeof TerminalDrawer> | null>(null);
// 打开场景控制
const sceneDrawer = ref<InstanceType<typeof SceneDrawer> | null>(null);

const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

/**
 * 获取表格数据
 * @param params
 */
const getTableList = (params: ReqPage) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return RoomHttp.getListByPage(newParams);
};

// 删除会议室信息
const deleteAccount = async (params: RoomType.Room) => {
  await useHandleData(RoomHttp.deleteRows, { ids: [params.roomId] }, `删除【${params.roomName}】会议室`);
  proTable.value?.getTableList();
};

/**
 * 切换状态
 * @param {RoomType.Room} row 行数据
 * @return {Promise<boolean>} elementUI要求布尔值
 */
const changeStatus = async (row: RoomType.Room): Promise<boolean> => {
  const message = `切换【${row.roomName}】的状态`;
  return await useHandleData(
    RoomHttp.changeRoomStatus,
    { roomId: row.roomId, roomStatus: row.roomStatus == 1 ? 0 : 1 },
    message
  ).then(() => proTable.value?.getTableList());
};
// 打开 drawer(新增、查看、编辑)
let fileList = ref<any>([]);
const drawerVisible = ref(false);

/**
 * 附件详情
 * @param row
 */
const fileDetail = (row: Partial<RoomType.Room> = {}) => {
  drawerVisible.value = true;
  fileList.value = row.files;
};

const openDrawer = (title: string, row: Partial<RoomType.Room> = {}) => {
  if (title === "场景") {
    sceneDrawer.value.acceptParams({
      row: row
    });
    return;
  }
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? RoomHttp.addRow : title === "编辑" ? RoomHttp.updateRow : undefined
  };
  drawerRef.value?.acceptParams(params);
};
/**
 * 打开新增或编辑的弹窗
 * @param {MeetSourceType.functionData} row
 */
const openTerminal = (row: RoomType.Room) => {
  const params = {
    row: row
  };
  terminalRef.value?.acceptParams(params);
};

/**
 * 查询会议室类型的选项卡   模拟成 promise 对象
 */
async function getMeetRoomTypeOptions() {
  return new Promise(async (resolve, reject) => {
    try {
      let opts = [];
      let res = await MeetRoomTypeHttp.getList();
      if (res.data.constructor === Array && res.data.length > 0) {
        res.data.forEach(d => {
          let tmp = { label: null, value: null };
          tmp.label = d.typeName;
          tmp.value = d.typeId;
          opts.push(tmp);
        });
        resolve({ data: opts });
      }
      resolve({ data: [] });
    } catch (e) {
      reject({ data: [] });
    }
  });
}

/**
 * 刷新页面
 */
function refreshPage() {
  proTable.value.getTableList();
}

// 表格配置项
const columns: ColumnProps<RoomType.Room>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  {
    prop: "roomId",
    label: "会议室ID",
    width: TableWidthEnum.BigIntNum
  },
  {
    prop: "roomName",
    label: "会议室名称",
    search: { el: "input" },
    width: TableWidthEnum.Name
  },

  // {
  //   prop: "imageUrl",
  //   label: "图片",
  //   width: TableWidthEnum.Status,
  //   align: "center"
  // },
  {
    prop: "roomTypeId",
    label: "会议室类型",
    enum: getMeetRoomTypeOptions,
    isFilterEnum: false,
    width: TableWidthEnum.Parent,
    search: {
      el: "select",
      props: { placeholder: "请选择会议室类型", filterable: true, remote: true, reserveKeyword: true },
      span: 1
    }
  },
  {
    prop: "areaId",
    label: "所在区域",
    isFilterEnum: false,
    enum: async () => {
      let data = await MeetingRoomHandle.getAreaCascaderList();
      return { data: data };
    },
    search: {
      el: "tree-select",
      span: 1
    }
  },
  { prop: "capacity", label: "容纳人数", width: TableWidthEnum.ShortNum },
  {
    prop: "roomStatus",
    label: TableLabelEnum.Open,
    width: TableWidthEnum.Status,
    align: "center"
  },
  {
    prop: "runningStatus",
    label: "运行状态",
    width: TableWidthEnum.Status,
    align: "center"
  },
  {
    prop: "terminal",
    label: "设备",
    width: TableWidthEnum.Status,
    align: "center",
    render: scope => {
      return (
        <>
          {
            <el-button type="primary" link onClick={() => openTerminal(scope.row)}>
              查看
            </el-button>
          }
        </>
      );
    }
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
  { prop: "operation", label: "操作", fixed: "right", width: TableWidthEnum.Handle4 }
];
</script>
