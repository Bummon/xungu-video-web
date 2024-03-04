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
          <el-form-item label="用户姓名" prop="nickName">
            <el-input
              v-model="drawerProps.row!.nickName"
              placeholder="请填写用户姓名"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="用户账户" prop="userAccount">
            <el-input
              v-model="drawerProps.row!.userAccount"
              placeholder="请填写用户账户"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="drawerProps.row!.roleId" placeholder="请选择角色" style="width: 100%">
              <el-option v-for="item in getRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
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
import { checkName, getRoleList } from "@/api/modules/system1/user";
import { User } from "@/api/interface";
import { sysRoles } from "@/api/interface/system1/sysRole";
import { VerifyEnum } from "@/enums/VerifyEnum";
import { SysUser } from "@/api/interface/system1/sysUser";
import { useAppStore } from "@/stores/modules/appStore";

const appStore = useAppStore();
const rules = reactive({
  nickName: [{ required: true, message: "请填写用户姓名" }, { trigger: "blur" }],
  userAccount: [{ required: true, message: "请填写用户账户" }, { trigger: "blur" }],
  roleId: [{ required: true, message: "请选择角色" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

let getRoles = ref<sysRoles.SysRole[]>();
getRoleList({ appId: appStore.appId }).then(res => {
  getRoles.value = res as sysRoles.SysRole[];
});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
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

      if (drawerProps.value.row.roleId != null) {
        let children: User.SysUserRoleBo[] = [];
        children.push({
          userId: drawerProps.value.row.userId as bigint,
          roleId: drawerProps.value.row.roleId || null
        });
        drawerProps.value.row.children = children;
      }
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
