<template>
  <div id="order-dialog">
    <el-dialog
      v-model="drawerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :show-close="false"
      width="50%"
      top="5vh"
      draggable
    >
      <template #header>
        <span style="vertical-align: middle">
          <el-icon :size="28" class="no-inherit">
            <Edit />
          </el-icon>
        </span>
        <span style="vertical-align: middle"> {{ drawerProps.title }} </span>
      </template>
      <el-form
        ref="ruleFormRef"
        label-width="100px"
        label-suffix=" :"
        :rules="rules"
        :disabled="drawerProps.isView"
        :model="drawerProps.row"
        :hide-required-asterisk="drawerProps.isView"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="terminalId" class="form_item">
              <el-cascader
                v-model="drawerProps.row.terminalList"
                :options="terminalListOptions"
                :props="props"
                clearable
                @change="changeTerminal"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="资源类型" prop="typeName">
              <el-input v-model="drawerProps.row!.typeName" placeholder="请填写资源类型" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置" prop="areaName">
              <el-input v-model="drawerProps.row!.areaName" placeholder="请填写位置名称" clearable disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理岗位" prop="jobName">
              <el-input v-model="drawerProps.row!.jobName" placeholder="请填写岗位名称" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员" prop="empName">
              <el-input v-model="drawerProps.row!.empName" placeholder="请填写员工名称" clearable disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="告警类型" prop="alarmTypeId">
              <el-select v-model="drawerProps.row!.alarmTypeId" placeholder="请选择" size="default" @change="changeAlarmType">
                <el-option
                  v-for="item in alarmTypeOptions"
                  :key="item.alarmTypeId"
                  :label="item.typeName"
                  :value="item.alarmTypeId"
                >
                  {{ item.typeName }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警等级" prop="alarmLevel">
              <el-input v-model="drawerProps.row!.alarmLevel" placeholder="请填写告警等级" clearable disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-col :span="24">
              <el-form-item label="说明" prop="orderDescr">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="drawerProps.row!.orderDescr"
                  placeholder="请填写说明"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片" prop="imageUrl">
              <OrderUploadImgs v-model:file-list="fileList" width="135px" height="135px" :file-size="5">
                <template #empty>
                  <el-icon>
                    <Picture />
                  </el-icon>
                  <span>请上传照片</span>
                </template>
                <template #tip> 图片大小不能超过 5M</template>
              </OrderUploadImgs>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-card v-show="drawerProps.isView">
        <template #header>
          <span>操作记录</span>
        </template>
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.createTime" placement="top">
            {{ activity.logDescr }}
          </el-timeline-item>
        </el-timeline>
        <el-form
          ref="imgFormRef"
          label-width="100px"
          label-suffix=" :"
          :disabled="drawerProps.isView"
          :model="drawerProps.row"
          :hide-required-asterisk="drawerProps.isView"
        >
          <el-row>
            <el-col :span="24">
              <OrderUploadImgs v-model:file-list="finishFileList" width="135px" height="135px" :file-size="5"></OrderUploadImgs>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Drawer">
import { ref, reactive, computed, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { OrderHandle } from "@/views/work/order/index";

import { WorkOrder } from "@/api/interface/work";
import OrderUploadImgs from "@/components/Upload/orderImgs.vue";
import { DataType } from "@/api/modules/data";
import { TerminalHttp } from "@/api/modules/source/terminal";

let validTerminal = (rule, value, callback) => {
  if (drawerProps.value.row.terminalList == undefined) {
    callback(new Error("请选择设备"));
  } else {
    callback();
  }
};

const rules = reactive({
  alarmLevel: [{ required: true, message: "请选择告警等级" }],
  alarmTypeId: [{ required: true, message: "请选择告警类型" }],
  terminalId: [{ required: true, validator: validTerminal, trigger: "blur", type: "array", message: "请选择设备" }],
  roomId: [{ required: true, message: "请选择会议室" }]
});
const props = {
  expandTrigger: "hover" as const
};
const fileList = ref<any>([]);
const finishFileList = ref<any>([]);
const activities = ref<WorkOrder.operationLog[]>([]);
const terminalListOptions = ref<DataType.Cascade[] | []>([]);
const alarmTypeOptions = ref<WorkOrder.alarmTypeOptions>([]);

interface Option {
  label: string;
  key: string;
}

interface DrawerProps {
  title: string;
  isView: boolean;
  modelList: bigint[] | number[];
  row: Partial<WorkOrder.order>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  modelList: [],
  tableData: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log("打开弹窗时传入的参数", params);
  if (params.title == "新增") {
    drawerProps.value = params;
    drawerProps.value.row.files = [];
    drawerProps.value.row.finishFiles = [];
  } else {
    drawerProps.value = params;
    fileList.value = [];
    if (drawerProps.value.row.files.length > 0) {
      drawerProps.value.row.files.forEach(it => {
        fileList.value.push({ name: it.fileName, url: it.fileUrl, ext: it.fileExt, size: it.fileSize });
      });
    }
    finishFileList.value = [];
    if (drawerProps.value.row.finishFiles.length > 0) {
      drawerProps.value.row.finishFiles.forEach(i => {
        finishFileList.value.push({ name: i.fileName, url: i.fileUrl, ext: i.fileExt, size: i.fileSize });
      });
    }
  }
  init();
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
let flag = ref(false);
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    if (flag.value) return;
    try {
      if (fileList.value != null) {
        drawerProps.value.row.files = [];
        fileList.value!.forEach(item => {
          drawerProps.value.row.files.push({
            fileExt: item.ext,
            fileName: item.name,
            fileSize: item.size,
            fileUrl: item.url
          });
        });
      }
      drawerProps.value.row.terminalId = drawerProps.value.row.terminalList.slice(-1)[0];
      flag.value = true;
      console.log("开始执行");
      await drawerProps.value.api!(drawerProps.value.row);
      console.log("执行成功");
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      flag.value = false;
    }
  });
};

async function init() {
  alarmTypeOptions.value = [];
  terminalListOptions.value = await OrderHandle.getTerminalList();
  let list = await OrderHandle.getAlarmType();
  list.forEach(item => {
    alarmTypeOptions.value.push({ alarmTypeId: item.typeId, typeName: item.typeName, alarmLevel: item.alarmLevel });
  });
  activities.value = [];
  if (drawerProps.value.title === "查看") {
    activities.value = await OrderHandle.getOrderLog(drawerProps.value.row!.orderId);
  }
}

async function changeTerminal(val) {
  let list = (await TerminalHttp.getTerminal({})).data;
  if (val != "" && val != null) {
    let terminalId = val.slice(-1)[0];
    let obj = list.find(item => item.terminalId === terminalId);
    drawerProps.value.row!.typeName = obj.typeName;
    drawerProps.value.row!.areaName = obj.areaName;
    drawerProps.value.row!.jobName = obj.jobName;
    drawerProps.value.row!.empName = obj.empName;
  } else {
    drawerProps.value.row!.typeName = "";
    drawerProps.value.row!.areaName = "";
    drawerProps.value.row!.jobName = "";
    drawerProps.value.row!.empName = "";
  }
}

async function changeAlarmType(val) {
  if (val != "" && val != null) {
    let obj = alarmTypeOptions.value.find(item => item.alarmTypeId === val);
    drawerProps.value.row!.alarmLevel = obj.alarmLevel;
  } else {
    drawerProps.value.row!.alarmLevel = "";
  }
}

// init();
defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
#order-dialog {
  :deep(.el-dialog) {
    .el-dialog__body {
      height: 70vh;
      overflow-y: scroll;
    }
  }
}
</style>
