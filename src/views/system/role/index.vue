<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="角色管理"
      row-key="path"
      :indent="30"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button v-has="'system:role:add'" type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增 </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon>
        <el-icon :size="18">
          <component :is="'Avatar'"></component>
        </el-icon>
      </template>
      <!--      开关操作-->
      <template #enabled="scope">
        <el-switch
          v-model="scope.row.enabled"
          inline-prompt
          :disabled="scope.row.defaultType === 1 || !AuthUtils.hasPermission('system:role:edit')"
          :active-value="1"
          active-text="启用"
          :inactive-value="0"
          inactive-text="停用"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button
          v-if="scope.row.defaultType !== 1"
          v-has="'system:role:assignMenu'"
          type="primary"
          link
          icon="EditPen"
          @click="configDrawer(scope.row)"
          >配置菜单
        </el-button>
        <el-button
          v-if="scope.row.defaultType === 0"
          v-has="'system:role:edit'"
          type="primary"
          link
          icon="EditPen"
          @click="openDrawer('编辑', scope.row)"
          >编辑
        </el-button>
        <el-button
          v-if="scope.row.defaultType === 0"
          v-has="'system:role:remove'"
          type="primary"
          link
          icon="Delete"
          @click="deleteRow(scope.row)"
        >
          删除
        </el-button>
        <p v-if="scope.row.defaultType === 1" style="font-style: italic; color: #9f9e9e">系统默认，不可修改</p>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" />
    <!-- <ConfigRole ref="dialogRef" /> -->
    <el-dialog v-model="dialogVisible" :append-to-body="true" show-close width="30%" title="配置角色" draggable>
      <el-form ref="ruleFormRef" label-width="120px">
        <el-form-item label="菜单权限">
          <!-- <el-checkbox
            v-brand="menuExpand"
            @change="handleCheckedTreeExpand($event, 'menu')"
            >展开/折叠</el-checkbox
          > -->
          <!-- <el-checkbox v-brand="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox> -->
          <el-tree
            :data="menuOptions.data"
            show-checkbox
            ref="menu"
            node-key="menuId"
            :check-strictly="false"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import Drawer from "./Drawer.vue";
import { nextTick, reactive, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { BaseSite } from "@/api/interface/player/baseSite";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { useAuthStore } from "@/stores/modules/auth";
import { useAppStore } from "@/stores/modules/appStore";
import {
  addRole,
  assignRoleMenu,
  changeRoleStatus,
  deleteRole,
  getMenuByRoleId,
  getRolePage,
  updateRole
} from "@/api/modules/system/role";
import { sysRole } from "@/api/interface/system/sysRole";
import { AuthUtils } from "@/utils/auth";

const authStore = useAuthStore();
const appStore = useAppStore();
const proTable = ref();

const initParam = reactive({});

const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = (title: any, row: Partial<sysRole.Role> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: title === "新增" ? { groupStatus: 0 } : { ...row },
    api: title === "新增" ? addRole : title === "编辑" ? updateRole : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
//角色相关的参数--------------
const defaultProps = reactive({
  children: "children",
  label: "menuName"
});
const rowParam = reactive({});
const menu = ref<InstanceType<typeof Menu> | null>(null);
const currentIds = ref<number[]>([]);
const menuOptions = ref<BaseSite.Option[]>([]);
const dialogVisible = ref(false);

const handleObj = data => {
  data.forEach(item => {
    currentIds.value.push(item);
    if (item.children && item.children.length) {
      handleObj(item.children);
    }
  });
};

/**
 * 打开配置菜单
 * @param row
 */
const configDrawer = async (row: Partial<sysRole.SysRole> = {}) => {
  rowParam.value = row;
  dialogVisible.value = true;
  const currentList: BaseSite.Option[] = [];
  // 查询菜单列表 选项
  const res = await getMenuByRoleId(row.roleId);
  currentIds.value = [];
  menuOptions.value = res as BaseSite.Option[];
  handleObj(res.data);
  currentIds.value.forEach(item => {
    if (item.status === 1 && (!item.children || item.children.length === 0)) {
      console.log(item);
      currentList.push(item.menuId);
    }
  });
  nextTick(() => {
    menu.value?.setCheckedKeys(currentList, false);
  });
};
const getMenuAllCheckedKeys = () => {
  // 目前被选中的菜单节点
  let checkedKeys = menu.value?.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menu.value?.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};
const loading = ref(false);

// 提交数据（新增/编辑）
const handleSubmit = async () => {
  if (loading.value) return;

  try {
    loading.value = true;
    const roleId = rowParam.value?.roleId;
    const menuId = getMenuAllCheckedKeys();
    console.log(rowParam);
    const res = await assignRoleMenu({ roleId: roleId, menuIdList: menuId });
    ElMessage.success({ message: `配置角色成功！` });
    dialogVisible.value = false;
    proTable.value?.getTableList();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

//删除角色
const deleteRow = async (params: sysRole.Role) => {
  await useHandleData(deleteRole, [params.roleId], `删除【${params.roleName}】角色`);
  proTable.value?.getTableList();
};
const getTableList = params => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getRolePage(newParams);
};

// 表格配置项
const columns: ColumnProps<sysRole.Role>[] = [
  { type: "selection", fixed: "left", width: TableWidthEnum.Select },
  { type: "index", label: "No", width: 50 },
  { prop: "roleName", label: "角色名称", align: "left", width: TableWidthEnum.Name, search: { el: "input" } },
  { prop: "roleSort", label: TableLabelEnum.Sort, align: "left", width: TableWidthEnum.Sort },
  { prop: "enabled", label: TableLabelEnum.Status, width: TableWidthEnum.Status, align: "center" },
  { prop: "remark", label: "描述说明", align: "left" },
  { prop: "createTime", label: "创建时间", width: TableWidthEnum.LongTime, align: "left" },
  { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: TableWidthEnum.LongTime, align: "left" },
  { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle3, fixed: "right" }
];

// 切换状态
const changeStatus = async (params: sysRole.Role) => {
  const newStatus = params.enabled === 1 ? 0 : 1;
  const requestData = { roleId: params.roleId, enabled: newStatus };
  const message = `切换【${params.roleName}】角色状态`;
  await useHandleData(changeRoleStatus, requestData, message);
  proTable.value?.getTableList();
};
</script>
