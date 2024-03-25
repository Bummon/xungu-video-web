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
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="drawerProps.row!.deptName" placeholder="请填写部门名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="deptSort">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row!.deptSort"
              placeholder="请填写顺序"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="负责人" prop="deptLeader">
            <el-input v-model="drawerProps.row!.deptLeader" placeholder="请填写部门负责人" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="联系方式" prop="deptPhone">
            <el-input v-model="drawerProps.row!.deptPhone" placeholder="请填写负责人联系方式" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门描述" prop="remark">
            <el-input
              v-model.trim="drawerProps.row!.remark"
              placeholder="请填写部门简介"
              clearable
              :rows="2"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-col> </el-row
      ><el-row>
        <el-col :span="24">
          <el-form-item label="状态" prop="remark">
            <el-switch
              v-model="drawerProps.row!.enabled"
              inline-prompt
              active-text="启用"
              :active-value="1"
              inactive-text="禁用"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Drawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, ElNotification } from "element-plus";
import { sysDepartment } from "@/api/interface/system1/sysDepartment";
import { getTreeList } from "@/api/modules/system1/organization";
import { sysDept } from "@/api/interface/base/sysDept";

const rules = reactive({
  deptName: [{ required: true, message: "请填写部门名称" }],
  deptSort: [{ required: true, message: "请填写顺序" }],
  deptLeader: [{ required: true, message: "请填写部门负责人" }],
  deptPhone: [
    {
      required: true,
      trigger: "blur",
      message: "请输入正确的手机号",
      pattern: /^((13|14|15|16|17|18)[0-9]{1}\d{8})|((166|199|198)[0-9]{1}\d{7})$/
    },
    { trigger: "blur" }
  ]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysDept.Dept>;
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
const acceptParams = async (params: DrawerProps) => {
  console.log(params);
  if (params.title == "新增") {
    drawerProps.value = params;
    if (params.row.deptId) {
      drawerProps.value.row.parentId = params.row.deptId;
    } else {
      drawerProps.value.row.parentId = 0;
    }
    drawerProps.value.row.deptName = "";
    drawerProps.value.row.deptId = null;
    drawerProps.value.row.deptSort = null;
    drawerProps.value.row.deptLeader = null;
    drawerProps.value.row.deptPhone = null;
  } else {
    drawerProps.value = params;
  }
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);

const handleSubmit = (ruleFormRef: FormInstance | undefined) => {
  ruleFormRef.validate(async valid => {
    if (!valid) return;
    if (loading.value) return;
    try {
      loading.value = true;
      if (drawerProps.value.title == "新增" || "新增一级") {
        drawerProps.value.row.deptType = 0;
        drawerProps.value.row.deptStatus = 1;
      }
      if (drawerProps.value.title === "新增一级") {
        drawerProps.value.row.parentId = 0;
      }
      await drawerProps.value.api!(drawerProps.value.row);
      ElNotification.success(`${drawerProps.value.title}部门成功！`);
      drawerProps.value.getTableList();
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
