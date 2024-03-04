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
          <el-form-item label="员工姓名" prop="empName">
            <el-input v-model="drawerProps.row!.empName" placeholder="请填写员工姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工号" prop="empCode">
            <el-input v-model="drawerProps.row!.empCode" placeholder="请填写工号" clearable></el-input>
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
          <el-form-item label="检索助记码" prop="helpCode">
            <el-input v-model="drawerProps.row!.helpCode" placeholder="请填写检索助记码" clearable></el-input>
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
          <!--          <el-form-item label="组织" prop="orgId">-->
          <!--            <el-select v-model="drawerProps.row!.orgId" placeholder="请选择组织" style="width: 100%" @change="queryDept">-->
          <!--              <el-option v-for="item in getOrgs" :key="item.orgId" :label="item.orgName" :value="item.orgId" />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="公司" prop="orgId">
            <el-tree-select
              v-model="drawerProps.row.orgId"
              placeholder="请选择公司"
              :data="getOrgs"
              :props="propsOrg"
              check-strictly
              :render-after-expand="false"
              @change="queryDept"
            />
          </el-form-item>
        </el-col>
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
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位" prop="jobId">
            <el-select v-model="drawerProps.row!.jobId" placeholder="请选择岗位" style="width: 100%">
              <el-option v-for="item in getJobs" :key="item.jobId" :label="item.jobName" :value="item.jobId" />
            </el-select>
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
import { sysEmployee } from "@/api/interface/system1/sysEmployee";
import { SysOrganization } from "@/api/interface/system1/sysOrganization";
import { checkName, getDeptsList, getOrgList } from "@/api/modules/system1/employee";
import { getList } from "@/api/modules/system1/job";
import { sysDepartment } from "@/api/interface/system1/sysDepartment";
import { VerifyEnum } from "@/enums/VerifyEnum";
import { sysRoles } from "@/api/interface/system1/sysRole";
import { getRoleList } from "@/api/modules/system1/user";
import { OrganizationHttp } from "@/api/modules/system1/organization";
import { useAppStore } from "@/stores/modules/appStore";
import { getRoleListCustom } from "@/api/modules/system1/roles";

const appStore = useAppStore();
const rules = reactive({
  empName: [{ required: true, trigger: "blur", message: "请填写姓名" }, { trigger: "blur" }],
  empCode: [{ required: true, trigger: "blur", message: "请填写工号" }, { trigger: "blur" }],
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
  orgId: [{ required: true, message: "请选择组织", trigger: "change" }],
  deptId: [{ required: true, message: "请选择部门", trigger: "change" }],
  jobId: [{ required: true, message: "请选择岗位", trigger: "change" }],
  roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
  email: [{ required: true, type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }, { trigger: "blur" }]
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
  row: Partial<sysEmployee.employee>;
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
  { label: "女", key: 0 },
  { label: "男", key: 1 }
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
let getOrgs = ref<SysOrganization.organization[]>();
let getJobs = ref<SysOrganization.organization[]>();
let getRoles = ref<sysRoles.SysRole[]>();
let getDepts = ref<sysDepartment.TreeDepartment[]>();

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
    if (appStore.appKey === "admin") {
      getRoles.value = await getRoleListCustom({});
    } else {
      getRoles.value = await getRoleList({ appId: appStore.appId });
    }

    // 获取组织列表
    getOrgs.value = (await OrganizationHttp.getOrgTreeList()).data;
    // 获取岗位列表
    getJobs.value = await getList();
    // 新增的时候  不显示 部门列表
    if (params.title === "新增") {
      getDepts.value = [];
    } else {
      getDepts.value = (await getDeptsList({ orgId: params.row.orgId })).data;
    }
    // 获取部门列表
    return true;
  } catch (e) {
    ElMessage.error("服务器接口发生异常，请稍后尝试");
    return false;
  }
}

// 当公司改变的时候 查询该组织下的部门的列表  同时把原有的部门选择清除掉
async function queryDept(val) {
  console.log(val);
  getDepts.value = (await getDeptsList({ orgId: val })).data;
  console.log(getDepts.value);
  drawerProps.value.row.deptId = null;
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
      ElMessage.success({ message: `${drawerProps.value.title}员工成功！` });
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
