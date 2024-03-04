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
        <el-col :span="24" v-if="drawerProps.row!.templateKey !== 'layout'">
          <el-form-item label="值" prop="templateKey">
            <el-input v-model="drawerProps.row!.configValue" placeholder="请填写值" clearable :validate-event="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-else>
          <el-form-item label="值" prop="configValue">
            <el-select v-model="drawerProps.row!.configValue" placeholder="请选择布局" style="width: 100%">
              <el-option v-for="item in layoutOptions" :key="item.layoutId" :label="item.layoutTitle" :value="item.layoutId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="configSort">
            <el-input-number
              v-model="drawerProps.row!.configSort"
              :step="1"
              :min="1"
              controls-position="right"
              :step-strictly="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="configStatus">
            <el-switch v-model="drawerProps.row!.configStatus" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="configDescr">
            <el-input
              type="textarea"
              :rows="4"
              v-model="drawerProps.row!.configDescr"
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

<script setup lang="ts" name="ConfigDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { BaseTerminalConfig } from "@/api/interface/player/baseTerminalConfig";
import { BaseDiyLayout } from "@/api/interface/player/baseDiyLayout";
import { getList } from "@/api/modules/player/diyLayout";

const rules = reactive({
  configSort: [{ required: true, message: "请填写顺序" }],
  configStatus: [{ required: true, message: "请选择状态" }]
});

//下拉框所有的值
let layoutOptions = ref<BaseDiyLayout.Option[]>([]);
getList().then(res => {
  layoutOptions.value = res.data as BaseDiyLayout.Option[];
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<BaseTerminalConfig.Config>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  title: "",
  isView: true,
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
