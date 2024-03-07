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
      label-width="110px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="SDK AppId" prop="apiKey">
            <el-input v-model="drawerProps.row!.apiKey" placeholder="请填写SDK AppId" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="Secret Key" prop="secretKey">
            <el-input v-model="drawerProps.row!.secretKey" placeholder="请填写Secret Key" clearable></el-input>
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
import { useAppStore } from "@/stores/modules/appStore";
import { sysAiConfig } from "@/api/interface/system/sysAiConfig";

const appStore = useAppStore();
const rules = reactive({
  apiKey: [{ required: true, trigger: "blur", message: "请填写SDK AppId" }, { trigger: "blur" }],
  secretKey: [{ required: true, trigger: "blur", message: "请填写Secret Key" }, { trigger: "blur" }],
  enabled: [{ required: true, message: "请选择状态" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysAiConfig.AiConfig>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

interface Option {
  label: string;
  key: number;
}
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
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
      console.log(drawerProps);
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}SDK AppId成功！` });
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
