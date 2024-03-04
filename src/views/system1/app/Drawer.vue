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
          <el-form-item label="应用名称" prop="appName">
            <el-input
              v-model="drawerProps.row!.appName"
              placeholder="请填写应用名称"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="编程Key" prop="appKey">
            <el-input v-model="drawerProps.row!.appKey" placeholder="请填写编程Key" clearable :validate-event="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="appSort">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row!.appSort"
              placeholder="请填写顺序"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="appStatus">
            <el-switch v-model="drawerProps.row!.appStatus" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="主页" prop="homeParam">
            <el-form-item label="name">
              <el-input v-model="routeMenu.name" placeholder="英文名称" clearable></el-input>
            </el-form-item>

            <el-form-item label="title">
              <el-input v-model="routeMenu.meta.title" placeholder="菜单名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="isHide">
              <el-input v-model="routeMenu.meta.isHide" placeholder="isHide" clearable></el-input>
            </el-form-item>
            <el-form-item label="isFull">
              <el-input v-model="routeMenu.meta.isFull" placeholder="isFull" clearable></el-input>
            </el-form-item>
            <el-form-item label="isAffix">
              <el-input v-model="routeMenu.meta.isAffix" placeholder="isAffix" clearable></el-input>
            </el-form-item>
            <el-form-item label="isKeepAlive">
              <el-input v-model="routeMenu.meta.isKeepAlive" placeholder="isKeepAlive" clearable></el-input>
            </el-form-item>
            <el-form-item label="icon">
              <el-input v-model="routeMenu.meta.icon" placeholder="icon" clearable></el-input>
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="应用类型">
            <el-select v-model="drawerProps.row.appType" :default-first-option="true">
              <el-option v-for="item in appTypeOptions" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="appDescr">
            <el-input type="textarea" :rows="4" v-model="drawerProps.row!.appDescr" placeholder="请填写备注" clearable></el-input>
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
import { ElMessage, FormInstance } from "element-plus";
import { sysApp } from "@/api/interface/system1/sysApp";

const rules = reactive({
  appName: [{ required: true, message: "请填写应用名称" }],
  appKey: [{ required: true, message: "请填写编程Key" }],
  appSort: [{ required: true, message: "请填写顺序" }],
  appStatus: [{ required: true, message: "请选择状态" }]
});

interface homeParam {
  component: string;
  menuId: 1;
  meta: {
    icon: string;
    title: string;
    isHide: boolean;
    isFull: boolean;
    isAffix: boolean;
    isKeepAlive: boolean;
    isLink: false;
  };
  name: string;
  parentId: 0;
  path: string;
}

const appTypeOptions = [
  {
    value: 1,
    name: "移动应用"
  },
  {
    value: 0,
    name: "PC应用"
  }
];
let routeMenu = ref<homeParam>({
  component: "/dataScreen/index",
  menuId: 1,
  meta: {
    icon: "HomeFilled",
    title: "数据大屏",
    isHide: false,
    isFull: true,
    isAffix: true,
    isKeepAlive: true,
    isLink: false
  },
  name: "home",
  parentId: 0,
  path: "/dataScreen"
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysApp.app>;
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
  if (drawerProps.value.row.homeParam) {
    routeMenu.value = JSON.parse(drawerProps.value.row.homeParam);
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
      routeMenu.value.menuId = 1; // 锁定项 不可更改
      routeMenu.value.parentId = 0; // 锁定项 不可更改
      routeMenu.value.meta.isLink = false; //  锁定项 不可更改
      routeMenu.value.path = "/" + routeMenu.value.name;
      routeMenu.value.component = "/" + routeMenu.value.name + "/index";
      drawerProps.value.row.homeParam = JSON.stringify(routeMenu.value);
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}应用成功！` });
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
