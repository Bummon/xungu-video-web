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
        <el-form-item label="选择公司" prop="orgId" v-if="!drawerProps.isLowLevel">
          <el-tree-select
            v-model="drawerProps.row.orgId"
            :data="orgOptions"
            :props="propsOrg"
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="所属公司" prop="orgId" v-else>
          {{ drawerProps.row.orgName }}
        </el-form-item>
      </el-row>
      <el-row>
        <!--        <el-col :span="12">-->
        <!--          <el-form-item label="父级菜单" prop="parentId">-->
        <!--            <el-tree-select-->
        <!--              v-model="drawerProps.row!.parentId"-->
        <!--              :data="drawerProps.tableData"-->
        <!--              :props="props"-->
        <!--              check-strictly-->
        <!--              :render-after-expand="false"-->
        <!--            />-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
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
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="drawerProps.row!.deptName" placeholder="请填写部门名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门描述" prop="deptDescr">
            <el-input
              v-model.trim="drawerProps.row!.deptDescr"
              placeholder="请填写部门简介"
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
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Drawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, ElNotification } from "element-plus";
import { sysDepartment } from "@/api/interface/system1/sysDepartment";
import { getTreeList } from "@/api/modules/system1/organization";

const rules = reactive({
  orgId: [{ required: true, message: "请选择所属公司" }],
  deptName: [{ required: true, message: "请填写部门名称" }],
  deptSort: [{ required: true, message: "请填写顺序" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  isLowLevel: boolean;
  row: Partial<sysDepartment.Department>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
}

const props = {
  label: "deptName",
  children: "children",
  value: "deptId"
};
const propsOrg = {
  label: "orgName",
  children: "children",
  value: "orgId"
};
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  isLowLevel: false,
  title: "",
  row: {},
  tableData: []
});
// 选择父公司的选项
let orgOptions = ref([]);

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  orgOptions.value = (await getTreeList()).data;
  console.log(params);
  if (params.title == "新增") {
    drawerProps.value = params;
    if (params.row.deptId) {
      drawerProps.value.row.parentId = params.row.deptId;
    } else {
      drawerProps.value.row.parentId = 0;
    }
    drawerProps.value.row.deptName = "";
    drawerProps.value.row.deptId = "";
    drawerProps.value.row.deptSort = null;
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
