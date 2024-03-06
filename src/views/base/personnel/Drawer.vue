<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    width="40%"
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
          <el-form-item label="用户名" prop="userAccount">
            <el-input v-model="drawerProps.row!.userAccount" placeholder="请填写用户名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="nickname">
            <el-input v-model="drawerProps.row!.nickname" placeholder="请填写姓名" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机" prop="phone">
            <el-input v-model="drawerProps.row!.phone" placeholder="请填写手机" clearable maxlength="11"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="drawerProps.row!.email" placeholder="请填写邮箱" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门" prop="deptId">
            <el-tree-select
              v-model="drawerProps.row!.deptId"
              :data="getDepts"
              :props="props"
              check-strictly
              :render-after-expand="false"
              style="width: 100%"
              placeholder="请选择部门"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="drawerProps.row!.roleId" placeholder="请选择角色" style="width: 100%">
              <el-option v-for="item in getRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="drawerProps.row!.gender" placeholder="请选择性别" style="width: 100%">
              <el-option v-for="item in genderOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="enabled">
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
      <el-row v-if="drawerProps.title === '新增'">
        <el-col :span="12">
          <el-form-item label="初始密码">
            <el-input placeholder="123456" :disabled="true"></el-input>
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
import { sysRole } from "@/api/interface/system/sysRole";
import { getRoleList } from "@/api/modules/system/user";
import { getDeptTree } from "@/api/modules/base/dept";
import { useAppStore } from "@/stores/modules/appStore";
import { sysDept } from "@/api/interface/system/sysDept";
import { sysUser } from "@/api/interface/system/sysUser";

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
const propsOrg = {
  label: "orgName",
  children: "children",
  value: "orgId"
};

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysUser.User>;
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
  let queryStatus = await init(params);
  // 数据查询成功 则弹出来界面  不成功便成仁
  if (queryStatus) {
    drawerProps.value = params;
    drawerVisible.value = true;
  }
};
let getRoles = ref<sysRole.SysRole[]>();
let getDepts = ref<sysDept.DeptTree[]>();

/*
 *
 *@author  党亚南
 * 1.   不要呜呜啦啦写一堆废话代码  用 await链式查询数据 精简代码
 * 2.   子组件的数据查询 要写到触发函数里面  不要写在外边
 * 3.   写注释！
 *
 *
 *
 * */
async function init(params) {
  try {
    // 获取角色列表
    getRoles.value = (await getRoleList({ enabled: 1 })).data;
    // 获取部门列表
    getDepts.value = (await getDeptTree({ enabled: 1 })).data;
    return true;
  } catch (e) {
    ElMessage.error("服务器接口发生异常，请稍后尝试");
    return false;
  }
}

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
