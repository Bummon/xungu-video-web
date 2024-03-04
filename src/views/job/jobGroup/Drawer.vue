<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" width="30%" :title="`${drawerProps.title}执行器`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="AppName" prop="appname">
        <el-input v-model="drawerProps.row!.appname" placeholder="AppName" clearable></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="title">
        <el-input v-model="drawerProps.row!.title" placeholder="请填写名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="注册方式" prop="addressType">
        <el-radio-group v-model="drawerProps.row!.addressType">
          <el-radio :label="0">自动注册</el-radio>
          <el-radio :label="1">手动录入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="机器地址" prop="addressList">
        <el-input
          type="textarea"
          :disabled="drawerProps.row!.addressType == 0"
          :rows="4"
          v-model="drawerProps.row!.addressList"
          placeholder="请输入执行器地址列表，多地址用逗号隔开"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SiteDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { BaseSite } from "@/api/interface/player/baseSite";

const rules = reactive({
  appname: [{ required: true, message: "请填写appname", trigger: "blur" }],
  title: [{ required: true, message: "请填写名称", trigger: "blur" }],
  addressType: [{ required: true, message: "请选择注册方式", trigger: "change" }],
  addressList: [{ required: true, message: "请输入机器地址", trigger: "blur" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<BaseSite.Site>;
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
      ElMessage.success({ message: `${drawerProps.value.title}执行器成功！` });
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
