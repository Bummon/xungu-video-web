<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    width="30%"
    draggable
  >
    <template #header>
      <span style="vertical-align: middle">
        <el-icon :size="22" class="no-inherit">
          <Edit />
        </el-icon>
      </span>
      <span style="padding-left: 5px; vertical-align: middle"> {{ drawerProps.title }}协议 </span>
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
        <el-col :span="24">
          <el-form-item label="协议名称" prop="protocolName">
            <el-input v-model="drawerProps.row.protocolName" placeholder="请填写协议名称" clearable maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="协议编号" prop="protocolCode">
            <el-input v-model.trim="drawerProps.row.protocolCode" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="接口类型" prop="interfaceType">
            <el-select v-model="drawerProps.row.interfaceType" :default-first-option="true">
              <el-option v-for="item in ProtocolOptions.interfaceTypes" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="接口编号" prop="interfaceCode">
            <el-select v-model="drawerProps.row.interfaceCode" :default-first-option="true">
              <el-option v-for="item in ProtocolOptions.interfaceCodes" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="目标IP" prop="ip">
            <el-input v-model="ip" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="端口" prop="port">
            <el-input v-model="port" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="串口波特率" prop="serialBps">
            <el-select v-model="drawerProps.row.serialBps" :default-first-option="true">
              <el-option v-for="item in ProtocolOptions.serialBps" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="串口校验" prop="serialCheck">
            <el-select v-model="drawerProps.row.serialCheck" :default-first-option="true">
              <el-option v-for="item in ProtocolOptions.serialChecks" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="串口停止位" prop="serialStop">
            <el-select v-model="drawerProps.row.serialStop" :default-first-option="true">
              <el-option v-for="item in ProtocolOptions.serialStops" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Drawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { MeetSourceType } from "@/api/interface/source";
import { ProtocolHttp } from "@/api/modules/source/protocol";

const props = {
  expandTrigger: "hover" as const,
  label: "labelName",
  value: "labelId",
  multiple: true
};
const rules = reactive({
  protocolName: [{ required: true, message: "请填写协议名称" }],
  interfaceCode: [{ required: true, message: "请选择接口编号" }],
  interfaceType: [{ required: true, message: "请选择接口类型" }],
  protocolCode: [{ required: true, message: "请选择协议编号" }],
  serialStop: [{ required: true, message: "请选择串口停止位" }],
  serialCheck: [{ required: true, message: "请选择校验方式" }],
  serialBps: [{ required: true, message: "请选择串口波特率" }]
});
// 选项
const ProtocolOptions = ref<MeetSourceType.protocolOptions>({
  interfaceCodes: [],
  interfaceTypes: [],
  serialBps: [],
  serialChecks: [],
  serialStops: []
});
// IP和端口
const ip = ref<string>();
const port = ref<string>();
const select = ref();

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<MeetSourceType.protocol>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  tableData: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  init();
  console.log(params);
  if (params.title == "新增") {
    drawerProps.value = params;
  } else {
    drawerProps.value = params;
    if (drawerProps.value.row.ipPort?.length) {
      ip.value = drawerProps.value.row.ipPort.split(":")[0];
      port.value = drawerProps.value.row.ipPort.split(":")[1];
    }
  }
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);

const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;

    if (loading.value) return;
    if (ip.value && port.value) {
      drawerProps.value.row.ipPort = ip.value + ":" + port.value;
    } else {
      drawerProps.value.row.ipPort = null;
    }

    try {
      loading.value = true;
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  });
};

async function init() {
  // 选项列表
  ProtocolOptions.value = (await ProtocolHttp.getOptions()).data;
}

defineExpose({
  acceptParams
});
</script>
