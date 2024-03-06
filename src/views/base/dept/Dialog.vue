<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" width="30%" title="绑定部门">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :model="drawerProps.row">
      <el-form-item label="选择公司" prop="orgId">
        <el-tree-select
          v-model="drawerProps.row!.orgId"
          :data="orgOptions"
          :props="props"
          :default-expanded-keys="[orgOptions[0].orgId]"
          check-strictly
          :render-after-expand="false"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Drawer">
import { onMounted, ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { sysDepartment } from "@/api/interface/system1/sysDepartment";
import { getTreeList } from "@/api/modules/system1/organization";

onMounted(() => {
  getTree();
});
const rules = reactive({
  orgId: [{ required: true, message: "请填写部门名称" }]
});

interface DrawerProps {
  row: Partial<sysDepartment.Department>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const props = {
  label: "orgName",
  children: "children",
  value: "orgId"
};
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  row: {}
});
let orgOptions = ref<any>([]);

const getTree = async () => {
  //const { data } = await getTreeList();
  //console.log(data);
  //orgOptions.value = data;
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  console.log(params);
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);

const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (loading.value) return;
    if (!valid) return;
    try {
      loading.value = true;
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `绑定公司成功！` });
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
