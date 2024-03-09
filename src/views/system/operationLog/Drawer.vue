<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    width="60%"
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
    <el-descriptions title="操作日志详情" column="2" size="default" direction="horizontal">
      <el-descriptions-item label="模块">
        <el-tag effect="dark" type="info">{{ drawerProps.row.moduleName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="名称">
        <el-tag effect="dark" type="danger">{{ drawerProps.row.operationName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="用户">
        <el-tag effect="light" type="warning">{{ drawerProps.row.createUsername }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="类型">
        <el-tag v-if="drawerProps.row.type === 1" type="success">新增</el-tag>
        <el-tag v-else-if="drawerProps.row.type === 2" type="warning">修改</el-tag>
        <el-tag v-else-if="drawerProps.row.type === 3" type="danger">删除</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="请求类型">
        <el-tag type="warning">{{ drawerProps.row.requestType }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="请求结果">
        <el-tag v-if="drawerProps.row.isSuccess" type="success">成功</el-tag>
        <el-tag v-else type="danger">失败</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="请求IP">{{ drawerProps.row.requestUri }}</el-descriptions-item>
      <el-descriptions-item label="请求URI">{{ drawerProps.row.requestUri }}</el-descriptions-item>
      <el-descriptions-item label="请求类名">{{ drawerProps.row.methodName }}</el-descriptions-item>
      <el-descriptions-item label="请求时间">{{ drawerProps.row.createTime }}</el-descriptions-item>
      <el-descriptions-item label="请求参数">
        <JsonViewer
          :style="{
            mainHeight: 100,
            overflow: 'auto'
          }"
          :copyable="{
            copyText: '复制',
            copiedText: '已复制'
          }"
          :boxed="false"
          :sort="true"
          :expanded="true"
          :show-array-index="false"
          :show-double-quotes="true"
          expand-depth="20"
          :value="JSON.parse(drawerProps.row.requestJson)"
        ></JsonViewer>
      </el-descriptions-item>
      <el-descriptions-item label="响应参数">
        <JsonViewer
          :style="{
            mainHeight: 100,
            overflow: 'auto'
          }"
          :copyable="{
            copyText: '复制',
            copiedText: '已复制'
          }"
          :boxed="false"
          :sort="true"
          :expanded="false"
          :show-array-index="true"
          :show-double-quotes="true"
          expand-depth="20"
          :value="JSON.parse(drawerProps.row.responseJson)"
        ></JsonViewer>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Drawer">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { useAppStore } from "@/stores/modules/appStore";
import { sysOperationLog } from "@/api/interface/system/sysOperationLog";
import "vue-json-viewer/style.css";
import JsonViewer from "vue-json-viewer";

const appStore = useAppStore();
const rules = reactive({
  userAccount: [{ required: true, trigger: "blur", message: "请填写用户名" }, { trigger: "blur" }],
  nickname: [{ required: true, trigger: "blur", message: "请填写姓名" }, { trigger: "blur" }],
  phone: [
    {
      required: true,
      trigger: "blur",
      message: "请输入正确的手机号",
      pattern: /^((13|14|15|16|17|18)[0-9]{1}\d{8})|((166|199|198)[0-9]{1}\d{7})$/
    },
    { trigger: "blur" }
  ],
  gender: [{ required: true, message: "请选择性别" }],
  deptId: [{ required: true, message: "请选择部门", trigger: "change" }],
  roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
  email: [{ required: true, type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }, { trigger: "blur" }],
  enabled: [{ required: true, message: "请选择状态" }]
});

const props = {
  label: "deptName",
  children: "children",
  value: "deptId"
};

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysOperationLog.OperationLog>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

interface Option {
  label: string;
  key: number;
}

const genderOptions = ref<Option[]>([
  { label: "男", key: 0 },
  { label: "女", key: 1 }
]);
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
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
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
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
