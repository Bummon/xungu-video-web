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
        <el-col :span="12">
          <el-form-item label="父级菜单" prop="parentId">
            <el-tree-select
              v-model="drawerProps.row!.parentId"
              :data="drawerProps.tableData"
              :props="props"
              check-strictly
              :render-after-expand="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="orgSort">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row!.orgSort"
              placeholder="请填写顺序"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="公司名称" prop="orgName">
            <el-input v-model="drawerProps.row!.orgName" placeholder="请填写公司名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="公司简介" prop="orgDescr">
            <el-input
              style="width: 100%"
              :min="0"
              :rows="2"
              type="textarea"
              v-model.trim="drawerProps.row!.orgDescr"
              placeholder="请填写公司相关描述"
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

<script setup lang="ts" name="Drawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { SysOrganization } from "@/api/interface/system1/sysOrganization";

const rules = reactive({
  orgName: [{ required: true, message: "请填写公司名称" }],
  orgSort: [{ required: true, message: "请填写顺序" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<SysOrganization.organization>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
}

const props = {
  label: "orgName",
  children: "children",
  value: "orgId"
};
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  tableData: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log(params);
  if (params.title == "新增") {
    drawerProps.value = params;
    if (params.row.orgId) {
      drawerProps.value.row.parentId = params.row.orgId;
    } else {
      drawerProps.value.row.parentId = 0;
    }
    drawerProps.value.row.orgName = "";
    drawerProps.value.row.orgId = "";
    drawerProps.value.row.orgSort = null;
    drawerProps.value.row.orgDescr = "";
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
        drawerProps.value.row.orgType = 1;
      }
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}公司成功！` });
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
