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
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="drawerProps.row!.roleName"
              placeholder="请填写角色名称"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="显示顺序" prop="roleSort">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row!.roleSort"
              placeholder="请填写顺序"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="appStore.appKey === 'admin'">
        <el-col :span="24">
          <el-form-item label="绑定应用" prop="appId">
            <el-select v-model="drawerProps.row.appId" :min="0" placeholder="请绑定应用" size="default">
              <el-option v-for="item in appOptions" :key="item.appId" :label="item.appName" :value="item.appId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <el-form-item label="绑定应用" prop="appId">
            <el-select v-model="drawerProps.row.appId" :min="0" placeholder="请绑定应用" size="default">
              <el-option :label="appStore.appName" :value="appStore.appId" />
            </el-select>
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
import { sysRoles } from "@/api/interface/system1/sysRole";
import { getList } from "@/api/modules/system1/app";
import { sysApp } from "@/api/interface/system1/sysApp";
import { useAppStore } from "@/stores/modules/appStore";

const appStore = useAppStore();
//下拉框所有的值
let appOptions = ref<sysApp.Option[]>([]);
const rules = reactive({
  roleName: [{ trigger: "blur", required: true, message: "请填写角色姓名" }],
  roleSort: [{ trigger: "blur", required: true, message: "请填写顺序" }],
  appId: [{ trigger: "blur", required: true, message: "请选择应用" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysRoles.SysRole>;
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
  // 如果是内部平台
  if (appStore.appKey === "admin") {
    getList().then(res => {
      appOptions.value = res as sysApp.Option[];
      drawerVisible.value = true;
    });
  } else {
    // 如果是其他平台
    appOptions.value = [{ appName: appStore.appName, appKey: appStore.appKey, appId: appStore.appId }];
    drawerVisible.value = true;
  }
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
      if (drawerProps.value.title === "新增") {
        drawerProps.value.row.parentId = 0;
        drawerProps.value.row.groupId = 0;
        drawerProps.value.row.type = appStore.appKey === "admin" ? 1 : 0;
      }
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}角色成功！` });
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
