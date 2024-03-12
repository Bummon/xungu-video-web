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
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input
              v-model="drawerProps.row!.equipmentName"
              placeholder="请填写设备名称"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备ID" prop="equipmentCode">
            <el-input
              v-model="drawerProps.row!.equipmentCode"
              placeholder="请填写设备ID"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="IP" prop="ip">
            <el-input v-model="drawerProps.row!.ip" placeholder="请填写设备IP" clearable :validate-event="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="remark">
            <el-input
              v-model.trim="drawerProps.row!.remark"
              placeholder="请填写描述"
              clearable
              :rows="2"
              type="textarea"
            ></el-input>
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
import { sysRole } from "@/api/interface/system/sysRole";

const appStore = useAppStore();
const rules = reactive({
  equipmentCode: [{ trigger: "blur", required: true, message: "请填写设备ID" }],
  equipmentName: [{ trigger: "blur", required: true, message: "请填写设备名称" }],
  ip: [{ trigger: "blur", required: true, message: "请填写设备IP" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysRole.Role>;
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
      ElMessage.success({ message: `${drawerProps.value.title}设备成功！` });
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
