<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    width="40%"
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
          <el-form-item label="名称" prop="title">
            <el-input v-model="drawerProps.row!.title" placeholder="请填写名称" clearable :validate-event="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="字段(Key)" prop="profileKey">
            <el-input
              v-model="drawerProps.row!.profileKey"
              placeholder="请填写字段Key"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="默认值" prop="defaultValue">
            <el-input v-model="drawerProps.row!.defaultValue" placeholder="请填写默认值" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="值(Value)" prop="profileValue">
            <el-input v-model="drawerProps.row!.profileValue" placeholder="请填写配置值" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="profileSort">
            <el-input-number
              v-model="drawerProps.row!.profileSort"
              :step="1"
              :min="1"
              controls-position="right"
              :step-strictly="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="profileStatus">
            <el-switch v-model="drawerProps.row!.profileStatus" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="profileDescr">
            <el-input
              type="textarea"
              :rows="4"
              v-model="drawerProps.row!.profileDescr"
              placeholder="请填写备注"
              clearable
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

<script setup lang="ts" name="ProfileDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { sysProfile } from "@/api/interface/system1/sysProfile";

const rules = reactive({
  title: [{ required: true, message: "请填写名称" }],
  profileSort: [{ required: true, message: "请填写顺序" }],
  profileStatus: [{ required: true, message: "请选择状态" }],
  defaultValue: [{ required: true, message: "请填写默认值" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysProfile.profile>;
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
      ElMessage.success({ message: `${drawerProps.value.title}配置成功！` });
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
