<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="true"
    width="30%"
    draggable
  >
    <template #header>
      <span style="vertical-align: middle">
        <el-icon :size="28" class="no-inherit">
          <Edit />
        </el-icon>
      </span>
      <span style="vertical-align: middle"> {{ drawerProps.title }}会议室类型 </span>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="160px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row>
        <el-col :span="20">
          <el-form-item label="会议室类型名称" prop="typeName">
            <el-input v-model="drawerProps.row.typeName" placeholder="请填写会议室类型名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :span="20">
          <el-form-item label="会议室类型简介" prop="typeDescr">
            <el-input
              v-model="drawerProps.row.typeDescr"
              placeholder="请填写会议室类型描述"
              type="textarea"
              clearable
              :autosize="{ minRows: 3, maxRows: 6 }"
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

<script setup lang="ts" name="AppDrawer">
import { ref, reactive } from "vue";
import { ElMessage, ElNotification, FormInstance, UploadRequestOptions } from "element-plus";
import { RoomType } from "@/api/interface/control/MeetRoom";

const rules = reactive({
  typeName: [
    { required: true, message: "请填写类型名称" },
    { max: 12, min: 1, message: "类型名称应在12个字以内" }
  ]
});

const Props = defineProps({
  updatePage: {
    type: Function,
    default: () => {
      console.log("默认方法");
    }
  }
});
const drawerVisible = ref(false);
const drawerProps = ref<RoomType.DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = async (params: RoomType.DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);
const handleSubmit = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return;
  ruleFormRef.validate(async valid => {
    if (!valid) return;
    if (loading.value) return;
    try {
      loading.value = true;
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}会议室成功！` });
      Props.updatePage();
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
