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
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="drawerProps.row!.dictName" @change="change" placeholder="请填写字典名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="字典键值" prop="dictValue">
            <el-input
              v-model="drawerProps.row!.dictValue"
              @change="changeValue"
              placeholder="请填写字典键值"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="字典数据类型" prop="dictValueType">
            <el-input
              v-model="drawerProps.row!.dictValueType"
              @change="changeType"
              placeholder="请填写字典数据类型"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="字典排序" prop="dictSort">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row!.dictSort"
              @change="changeSort"
              placeholder="请填写字典排序"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="dictStatus">
            <el-switch v-model="drawerProps.row!.dictStatus" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否默认" prop="dictDefault">
            <el-switch v-model="drawerProps.row!.dictDefault" :active-value="1" :inactive-value="0" />
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
import { sysDict } from "@/api/interface/system1/sysDict";

const rules = reactive({
  dictName: [{ required: true, message: "请填写字典名称" }],
  dictValue: [{ required: true, message: "请填写字典键值" }],
  dictValueType: [{ required: true, message: "请填写字典数据类型" }],
  dictStatus: [{ required: true, message: "请选择状态" }],
  dictSort: [{ required: true, message: "请填写字典排序" }],
  dictDefault: [{ required: true, message: "请选择是否默认" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysDict.dict>;
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
  console.log(drawerProps.value.row);
  drawerVisible.value = true;
};
let param = reactive({});
const change = (e: any) => {
  param.dictName = e;
};
const changeValue = (e: any) => {
  param.dictValue = e;
};
const changeType = (e: any) => {
  param.dictValueType = e;
};
const changeSort = (e: any) => {
  param.dictSort = e;
};
const changeStatus = (e: any) => {
  param.dictStatus = e;
};
const changeDefault = (e: any) => {
  param.dictDefault = e;
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
      let params = {};
      console.log(drawerProps.value.row.dictId);
      if (drawerProps.value.title == "新增") {
        params = {
          parentId: drawerProps.value.row.parentId,
          dictType: 2,
          dictName: drawerProps.value.row.dictName,
          dictValue: drawerProps.value.row.dictValue,
          dictValueType: drawerProps.value.row.dictValueType,
          dictSort: drawerProps.value.row.dictSort,
          dictDefault: drawerProps.value.row.dictDefault,
          dictStatus: drawerProps.value.row.dictStatus
        };
      } else {
        if (param.dictName == drawerProps.value.row.dictName) {
          params.dictName = drawerProps.value.row.dictName;
        }
        if (param.dictValue == drawerProps.value.row.dictValue) {
          params.dictValue = drawerProps.value.row.dictValue;
        }
        if (param.dictValueType == drawerProps.value.row.dictValueType) {
          params.dictValueType = drawerProps.value.row.dictValueType;
        }
        if (param.dictSort == drawerProps.value.row.dictSort) {
          params.dictSort = drawerProps.value.row.dictSort;
        }
        if (param.dictDefault == drawerProps.value.row.dictDefault) {
          params.dictDefault = drawerProps.value.row.dictDefault;
        }
        if (param.dictStatus == drawerProps.value.row.dictStatus) {
          params.dictStatus = drawerProps.value.row.dictStatus;
        }
        params.dictId = drawerProps.value.row.dictId;
      }
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}字典成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
      param = {};
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
