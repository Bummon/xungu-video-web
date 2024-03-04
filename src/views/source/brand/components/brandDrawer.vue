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
        <el-icon :size="22" class="no-inherit">
          <Edit />
        </el-icon>
      </span>
      <span class="title"> {{ drawerProps.title }}品牌 </span>
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
          <el-form-item label="名称" prop="brandName">
            <el-input v-model="drawerProps.row.brandName" placeholder="请填写品牌名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="状态" prop="brandStatus">
            <el-radio-group v-model="drawerProps.row.brandStatus" class="ml-4">
              <el-radio-button :label="0" size="large">停用</el-radio-button>
              <el-radio-button :label="1" size="large">启用</el-radio-button>
            </el-radio-group>
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

<script setup lang="ts" name="brandDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { MeetSourceType } from "@/api/interface/source";

const rules = reactive({
  brandName: [{ required: true, message: "请填写品牌名称" }],
  brandStatus: [{ required: true, message: "请选择是否启用" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<MeetSourceType.brand>;
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
const acceptParams = (params: DrawerProps) => {
  if (params.title == "新增") {
    drawerProps.value = params;
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
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
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
<style scoped lang="scss">
.title {
  padding-left: 5px;
  vertical-align: middle;
}
</style>
