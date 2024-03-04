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
      v-if="type === 'email'"
      ref="emailFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="emailRules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="邮箱名称" prop="emailName">
            <el-input
              v-model="drawerProps.row!.emailName"
              placeholder="请填写邮箱名称"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="邮箱授权码" prop="authorizeCode">
            <el-input
              v-model="drawerProps.row!.authorizeCode"
              placeholder="请填写授权码"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="服务器地址" prop="serverAddress">
            <el-input
              v-model="drawerProps.row!.serverAddress"
              placeholder="请填写服务器地址"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="服务器端口" prop="serverPort">
            <el-input-number
              v-model="drawerProps.row!.serverPort"
              placeholder="请填写服务器端口"
              clearable
              :controls="false"
              :validate-event="false"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      v-if="type === 'message'"
      ref="messageFormRef"
      label-width="200px"
      label-suffix=" :"
      :rules="messageRules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="短信签名" prop="signature">
            <el-input
              v-model.trim="drawerProps.row!.signature"
              placeholder="请填写短信签名"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="阿里云accessKey" prop="accessKey">
            <el-input
              v-model.trim="drawerProps.row!.accessKey"
              placeholder="请填写阿里云accessKey"
              clearable
              type="textarea"
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="阿里云accessKeySecret" prop="accessKeySecret">
            <el-input
              v-model.trim="drawerProps.row!.accessKeySecret"
              placeholder="请填写阿里云密钥"
              type="textarea"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="模板编号" prop="templateId">
            <el-input
              v-model.trim="drawerProps.row!.templateId"
              placeholder="请填写模板编号"
              clearable
              :validate-event="false"
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
import { NoticeType } from "@/api/modules/system1/notice";

const emailRules = reactive({
  emailName: [{ required: true, message: "请填写邮箱名称" }],
  authorizeCode: [{ required: true, message: "请填写邮箱授权码" }],
  serverAddress: [{ required: true, message: "请填写服务器地址" }],
  serverPort: [{ required: true, message: "请填写服务器端口" }]
});
const messageRules = reactive({
  signature: [{ required: true, message: "请填写短信签名" }],
  accessKey: [{ required: true, message: "请填写阿里云 access Key" }],
  accessKeySecret: [{ required: true, message: "请填写阿里云 access Secret" }],
  templateId: [{ required: true, message: "请填写模板编号" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<NoticeType.email>;
  api?: (params: any) => Promise<any>;
}

const props = {
  label: "menuName",
  children: "children",
  value: "menuId"
};
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  updateData: () => {}
});
const type = ref<"email" | "message">("email");
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  switch (params.title) {
    case "新增邮箱":
      console.log("新增邮箱");
      type.value = "email";
      break;
    case "编辑邮箱":
      type.value = "email";
      console.log("新增邮箱");
      break;
    case "新增短信":
      type.value = "message";
      console.log("新增邮箱");
      break;
    case "编辑短信":
      type.value = "message";
      console.log("新增邮箱");
      break;
  }
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const emailFormRef = ref<FormInstance>();
const messageFormRef = ref<FormInstance>();
const loading = ref(false);
const handleSubmit = () => {
  if (type.value === "email") {
    emailFormRef.value!.validate(async valid => {
      if (!valid) return;
      if (loading.value) return;
      try {
        loading.value = true;
        await drawerProps.value.api!(drawerProps.value.row);
        ElMessage.success({ message: `${drawerProps.value.title}成功！` });
        drawerProps.value.updateData();
        drawerVisible.value = false;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    });
  } else if (type.value === "message") {
    messageFormRef.value!.validate(async valid => {
      if (!valid) return;
      if (loading.value) return;
      try {
        loading.value = true;
        await drawerProps.value.api!(drawerProps.value.row);
        ElMessage.success({ message: `${drawerProps.value.title}成功！` });
        drawerProps.value.updateData();
        drawerVisible.value = false;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    });
  }
};

defineExpose({
  acceptParams
});
</script>
