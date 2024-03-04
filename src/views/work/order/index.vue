<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="工单列表"
      row-key="orderId"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <template #alarmTypeId="scope">
        <span>{{ scope.row.alarmTypeName }}</span>
      </template>
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="getTableAll" v-show="username === 'Admin'">所有工单 </el-button>
        <el-button type="primary" icon="CirclePlus" @click="getTableSelf" v-show="username === 'Admin'">我创建的工单 </el-button>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增工单</el-button>
      </template>
      <!--   所在会议室   -->
      <template #roomId="scope">
        <span>{{ scope.row.roomName }}</span>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button
          type="primary"
          link
          icon="EditPen"
          @click="openDrawer('编辑', scope.row)"
          v-if="scope.row.orderStatus == 0 && scope.row.createUserName === username"
          >编辑
        </el-button>
        <el-button
          type="primary"
          link
          icon="UserFilled"
          @click="changeStatus('开始维修', scope.row)"
          v-if="scope.row.orderStatus == 0 && username != 'Admin'"
          >开始维修
        </el-button>
        <el-button
          type="primary"
          link
          icon="CircleCheck"
          v-if="scope.row.orderStatus == 1 && scope.row.receiveUserName === username"
          @click="openFinishDrawer('完成', scope.row)"
          >完成
        </el-button>
        <el-button
          type="primary"
          link
          icon="CircleClose"
          @click="changeStatus('关闭', scope.row)"
          v-if="scope.row.orderStatus != 3 && (scope.row.createUserName === username || username === 'Admin')"
          >关闭
        </el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <FinishDrawer ref="finishDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="Order">
import { ref, reactive, computed } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { TableAlarmLevelOptions, TableLabelEnum, TableSourceTypeOptions, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { MeetSourceType } from "@/api/interface/source";
import { ReqPage, ReqPagePlus, ResPage, ResultData } from "@/api/interface";
// 权限集
const authStore = useAuthStore();
const userStore = useUserStore();
const username = userStore.userInfo.name;
// 表格
const proTable = ref();
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const finishDrawerRef = ref<InstanceType<typeof FinishDrawer> | null>(null);

// 初始化的请求参数
let initParam = reactive({});
import { OrderHttp } from "@/api/modules/work/order";
import { WorkOrder } from "@/api/interface/work";
import { useUserStore } from "@/stores/modules/user";
import { status } from "@/api/modules/work/order";
import { HandleData } from "@/hooks/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import FinishDrawer from "@/views/work/order/FinishDrawer.vue";
import { AlarmHttp } from "@/api/modules/work/alarm";
import { TerminalHandle } from "@/views/source/terminal/index";

const getTableAll = () => {
  delete proTable.value.searchParam.createUserName;
  console.log(initParam, "init");
  proTable.value.search();
};

const getTableSelf = () => {
  proTable.value.searchParam.createUserName = username;
  console.log(initParam, "init");
  proTable.value.search();
};

/**
 * @description 获取功能的列表
 *
 */
const getTableList = (params: ReqPagePlus) => {
  return OrderHttp.getOrderList(JSON.parse(JSON.stringify(params)));
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

// 表格配置项
let columns = ref<ColumnProps<WorkOrder.order>[]>([
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: TableWidthEnum.Index },
  { prop: "orderCode", label: "工单号", align: "left", width: TableWidthEnum.BigIntNum, search: { el: "input" } },
  {
    prop: "terminalName",
    label: "设备名称",
    align: "left",
    width: TableWidthEnum.Parent,

    render: scope => {
      return <span>{scope.row.terminalName || "设备已删除"}</span>;
    }
  },
  {
    prop: "alarmTypeId",
    label: "告警类型",
    align: "left",
    width: TableWidthEnum.Type,
    isFilterEnum: false,
    enum: getAlarmTypeOptions,
    search: {
      el: "select",
      props: { placeholder: "请选择告警类型", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  {
    prop: "alarmLevel",
    label: "告警等级",
    align: "left",
    width: TableWidthEnum.ShortNum,
    isFilterEnum: false,
    enum: TableAlarmLevelOptions,
    search: {
      el: "select",
      props: { placeholder: "请选择告警等级", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  {
    prop: "roomId",
    label: "所在会议室",
    align: "left",
    width: TableWidthEnum.BigIntNum,
    enum: async () => {
      return { data: await TerminalHandle.getRoomCascaderList() };
    },
    search: {
      el: "tree-select"
    }
  },
  { prop: "createUserName", label: "报修人", align: "left", width: TableWidthEnum.PersonName },
  { prop: "createTime", label: "提交时间", align: "left", width: TableWidthEnum.LongTime },
  { prop: "jobName", label: "管理岗位", width: TableWidthEnum.LongTime, align: "left" },
  {
    prop: "orderStatus",
    label: "状态",
    align: "left",
    width: TableWidthEnum.Status,
    tag: true,
    enum: status,
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "operation",
    label: TableLabelEnum.Operation,
    fixed: "right"
  }
]);
/**
 * 切换状态
 * @param {MeetSourceType.functionData} params 行数据
 */
const changeStatus = async (title: string, Row: WorkOrder.order): Promise<boolean> => {
  const newStatus = title === "开始维修" ? 1 : 3;
  const requestData = { orderId: Row.orderId, orderStatus: newStatus };
  const message =
    title === "开始维修"
      ? `工单号【${Row.orderCode}】<br/> 确认开始维修吗？`
      : `工单号【${Row.orderCode}】<br/> 关闭后不可恢复，确认关闭吗？`;
  try {
    await handleData(OrderHttp.changeOrderStatus, requestData, message, title);
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
const openDrawer = (title: string, row: Partial<WorkOrder.order> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { orderFrom: 1 } : { ...row, terminalList: [row.roomId, row.terminalId] },
    api: title === "新增" ? OrderHttp.addOrderRow : title === "编辑" ? OrderHttp.updateOrderRow : undefined,
    getTableList: proTable.value!.getTableList,
    tableData: proTable.value.tableData
  };
  drawerRef.value?.acceptParams(params);
};

const handleData = (
  api: (params: any) => Promise<any>,
  params: any = {},
  message: string,
  title: string,
  confirmType: HandleData.MessageType = "warning"
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`${message}`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: confirmType,
      draggable: true,
      dangerouslyUseHTMLString: true
    }).then(async () => {
      const res = await api(params);
      if (!res) return reject(false);
      ElMessage({
        type: "success",
        message: `${title}成功!`
      });
      resolve(true);
    });
  });
};

const openFinishDrawer = (title: string, row: Partial<WorkOrder.order> = {}) => {
  const params = {
    title,
    row: { ...row },
    api: OrderHttp.finishOrderRow,
    getTableList: proTable.value!.getTableList,
    tableData: proTable.value.tableData
  };
  finishDrawerRef.value?.acceptParams(params);
};

/**
 * 查询告警类型的选项卡   模拟成 promise 对象
 */
function getAlarmTypeOptions() {
  return new Promise((resolve, reject) => {
    let opts = [];
    try {
      AlarmHttp.getAlarm().then(res => {
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
