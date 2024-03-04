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
          <el-form-item label="父级菜单" prop="parentId">
            <el-tree-select
              v-model="drawerProps.row!.parentId"
              :data="drawerProps.treeFilterData"
              :props="props"
              check-strictly
              :render-after-expand="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="区域名称" prop="areaName">
            <el-input v-model="drawerProps.row!.areaName" placeholder="请填写区域名称" clearable></el-input>
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
import { sysArea } from "@/api/interface/system1/sysArea";

const rules = reactive({
  areaName: [{ required: true, message: "请填写区域名称" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysArea.area>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
  treeFilterData: [];
  initParam: Partial<sysArea.area>;
}

const props = {
  label: "areaName",
  children: "children",
  value: "areaId"
};
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  tableData: [],
  treeFilterData: [],
  initParam: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log(params);
  if (params.title == "新增") {
    if (params.row.areaId) {
      console.log(11);

      drawerProps.value = params;
      // drawerProps.value.row.parentId = params.row.areaId;
      drawerProps.value.row.areaName = "";
    } else {
      console.log(22);
      drawerProps.value.row.parentId = params.initParam.parentId;
      drawerProps.value.treeFilterData = params.treeFilterData;
      drawerProps.value.tableData = params.tableData;
      drawerProps.value.api = params.api;
      drawerProps.value.title = params.title;
      console.log(drawerProps.value.row, params.initParam);
    }
  } else {
    drawerProps.value = params;
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
    try {
      loading.value = true;
      if (drawerProps.value.title == "新增") {
        drawerProps.value.row.areaSort = 0;
      }
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}区域成功！` });
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
