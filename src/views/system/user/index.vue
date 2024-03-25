<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户管理"
      rowKey="userId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-has="'system:user:add'" type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增 </el-button>
        <!--        -->
        <el-button
          v-has="'system:user:remove'"
          :disabled="!scope.isSelected"
          type="danger"
          icon="Delete"
          plain
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <!-- 扩展 -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!--      开关操作-->
      <template #enabled="scope">
        <el-switch
          v-model="scope.row.enabled"
          :disabled="scope.row.defaultType === 1 || !AuthUtils.hasPermission('system:user:edit')"
          inline-prompt
          active-text="启用"
          :active-value="1"
          :inactive-value="0"
          inactive-text="禁用"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button
          v-if="scope.row.defaultType === 0"
          v-has="'system:user:query'"
          type="primary"
          link
          icon="View"
          @click="openDrawer('查看', scope.row)"
          >查看
        </el-button>
        <el-button
          v-if="scope.row.defaultType === 0"
          v-has="'system:user:edit'"
          type="primary"
          link
          icon="EditPen"
          @click="openDrawer('编辑', scope.row)"
          >编辑
        </el-button>
        <el-button
          v-if="scope.row.defaultType === 0"
          v-has="'system:user:resetPwd'"
          type="primary"
          link
          icon="Refresh"
          @click="resetPass(scope.row)"
        >
          重置密码
        </el-button>
        <el-button
          v-if="scope.row.defaultType === 0"
          v-has="'system:user:remove'"
          type="primary"
          link
          icon="Delete"
          @click="deleteAccount(scope.row)"
        >
          删除
        </el-button>
        <p v-if="scope.row.defaultType === 1" style="font-style: italic; color: #9f9e9e">系统默认，不可修改</p>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <!--<ImportExcel ref="dialogRef" />-->
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import Drawer from "./Drawer.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { addUser, changeUserStatus, deleteUser, getUserPage, resetPassword, updateUser } from "@/api/modules/system/user";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { UserDeptHandle } from "@/views/system/user/userIndex";
import { sysUser } from "@/api/interface/system/sysUser";
import { AuthUtils } from "@/utils/auth";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

const initParam = reactive({});

const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: sysUser.User) => {
  params.type = 1;
  let newParams = JSON.parse(JSON.stringify(params));
  return getUserPage(newParams);
};
// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: TableLabelEnum.Index, width: 50 },
  {
    prop: "userAccount",
    label: "用户名",
    search: { el: "input" },
    align: "left",
    width: TableWidthEnum.PersonName
  },
  {
    prop: "nickname",
    label: "姓名",
    search: { el: "input" },
    align: "left",
    width: TableWidthEnum.PersonName
  },
  {
    prop: "gender",
    label: "性别",
    align: "left",
    width: TableWidthEnum.SingleString,
    render: (scope): string => {
      return scope.row.gender === 0 ? "男" : "女";
    }
  },
  {
    prop: "deptId",
    label: "部门",
    align: "left",
    width: TableWidthEnum.PersonName,
    search: {
      el: "tree-select",
      key: "deptId",
      props: {
        "check-strictly": true
      }
    },
    enum: async () => {
      let data = await UserDeptHandle.getDeptList();
      return { data: data };
    }
  },
  { prop: "phone", label: "手机", align: "left", width: TableWidthEnum.BigIntNum },
  { prop: "roleName", label: "角色", align: "left", width: TableWidthEnum.PersonName },
  { prop: "enabled", label: TableLabelEnum.Status, align: "center", width: TableWidthEnum.Status },
  {
    prop: "createTime",
    label: "创建时间",
    align: "left",
    width: TableWidthEnum.LongTime
  },
  {
    prop: "modifyTime",
    label: "修改时间",
    align: "left",
    width: TableWidthEnum.LongTime
  },
  { prop: "operation", label: TableLabelEnum.Operation, fixed: "right", width: 330 }
];
// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, [params.userId], `删除【${params.nickname}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (ids: number[] | bigint[]) => {
  await useHandleData(deleteUser, ids, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  await useHandleData(resetPassword, params.userId, `重置【${params.nickname}】用户密码`);
  proTable.value?.getTableList();
};

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
  const enabled = row.enabled == 1 ? 0 : 1;
  await useHandleData(
    changeUserStatus,
    {
      userId: row.userId,
      enabled: enabled,
      type: 1
    },
    `切换【${row.nickname}】用户状态`
  );
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, type: 1 },
    api: title === "新增" ? addUser : title === "编辑" ? updateUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  console.log();
  drawerRef.value?.acceptParams(params);
};
</script>
