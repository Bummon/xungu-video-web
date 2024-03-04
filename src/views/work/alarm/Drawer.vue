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
        <el-col :span="24">
          <el-form-item label="名称" prop="typeName">
            <el-input v-model="drawerProps.row!.typeName" placeholder="请填写名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="告警等级" prop="alarmLevel">
            <el-select v-model="drawerProps.row!.alarmLevel" placeholder="请选择" size="default">
              <el-option v-for="item in alarmLevelOptions" :key="item.key" :label="item.label" :value="item.key">
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="触发条件" prop="type">
            <el-select v-model="drawerProps.row.type" placeholder="请选择" size="default">
              <el-option v-for="item in triggerOptions" :key="item.key" :label="item.label" :value="item.key">
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="drawerProps.row.type === 2">
        <el-col :span="24">
          <el-form-item label="时序电源" prop="conditions">
            当电压高于
            <div style="display: inline-block; vertical-align: middle">
              <!-- 使用插槽包裹 el-input-number -->
              <el-input-number :min="0" :max="300" :controls="false" v-model.trim.number="drawerProps.row.conditions">
                <!-- 自定义插槽内容 -->
                <template #append>
                  <span></span>
                </template>
              </el-input-number>
            </div>
            伏时触发告警。
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="drawerProps.row.type === 3">
        <el-col :span="24">
          <el-form-item label="录播主机" prop="conditions">
            当 <span style="margin: 0 2px; color: #0d9076">录播主机</span> 磁盘存储达到总存储的
            <div style="display: inline-block; vertical-align: middle">
              <!-- 使用插槽包裹 el-input-number -->
              <el-input-number :min="0" :max="100" :controls="false" v-model.trim.number="drawerProps.row.conditions">
                <!-- 自定义插槽内容 -->
                <template #append>
                  <span></span>
                </template>
              </el-input-number>
            </div>
            % 时触发告警。
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

<script setup lang="ts" name="AlarmTypeDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { BaseTerminalType } from "@/api/interface/player/baseTerminalType";
import { WorkOrder } from "@/api/interface/work";

const rules = reactive({
  typeName: [{ required: true, message: "请填写名称" }],
  alarmLevel: [{ required: true, message: "请选择告警等级" }],
  type: [{ required: true, message: "请选择触发条件" }],
  conditions: [{ type: Number, message: "请选择告警等" }]
});
const triggerOptions = [
  {
    key: 1,
    label: "手动创建"
  },
  {
    key: 2,
    label: "时序电源"
  },
  {
    key: 3,
    label: "录播主机"
  }
];

interface Option {
  label: string;
  key: string;
}

const alarmLevelOptions = ref<Option[]>([
  { label: "提示", key: "提示" },
  { label: "一般", key: "一般" },
  { label: "重要", key: "重要" },
  { label: "紧急", key: "紧急" }
]);

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<WorkOrder.alarmType>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);

const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    if (loading.value) return;
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
defineExpose({
  acceptParams
});
</script>
