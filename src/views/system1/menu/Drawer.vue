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
          <el-form-item label="父级菜单" prop="parentId">
            <el-tree-select
              v-model="drawerProps.row!.parentId"
              :data="drawerProps.tableData"
              :props="props"
              check-strictly
              :render-after-expand="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input
              v-model="drawerProps.row!.menuName"
              placeholder="请填写菜单名称"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      <el-row>-->
      <!--        <el-col :span="24">-->
      <!--          <el-form-item label="菜单权限" prop="menuParam">-->
      <!--            <el-input-->
      <!--              v-brand="drawerProps.row!.menuParam"-->
      <!--              placeholder="请填写菜单权限"-->
      <!--              clearable-->
      <!--              :validate-event="false"-->
      <!--            ></el-input>-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单路径" prop="menuPath">
            <el-input
              v-model="drawerProps.row!.menuPath"
              placeholder="请填写菜单路径"
              clearable
              :validate-event="false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单图标" prop="menuIcon">
            <SelectIcon v-model:icon-value="drawerProps.row.menuIcon" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="显示顺序" prop="menuSort">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row.menuSort"
              placeholder="请填写顺序"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-select v-model="drawerProps.row.menuType" placeholder="请选择菜单类型" style="width: 100%">
              <el-option label="目录" :value="0" />
              <el-option label="菜单" :value="1" />
              <el-option label="按钮" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="绑定应用" prop="appId">
            <el-select v-model="drawerProps.row.appId" placeholder="请选择绑定应用" style="width: 100%" multiple>
              <el-option :label="item.appName" :value="item.appId" v-for="item in appList" :key="item.appId" />
            </el-select>
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

<script setup lang="ts" name="Drawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { SysMenu } from "@/api/interface/system1/sysMenu";
import SelectIcon from "@/components/SelectIcon/index.vue";
import { sysAppHttp } from "@/api/modules/system1/app";

const rules = reactive({
  menuName: [{ required: true, message: "请填写菜单名称" }],
  menuSort: [{ required: true, message: "请填写顺序" }],
  menuType: [{ required: true, message: "请填写菜单类型" }],
  appId: [{ required: true, message: "请选择归属的应用" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<SysMenu.Menu>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
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
  tableData: []
});
const appList = ref();
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  console.log(params);
  // 获取可以选择的应用列表
  appList.value = await sysAppHttp.getAppList();
  console.log("  appList.value", appList.value);
  if (params.title == "新增") {
    drawerProps.value = params;
    if (params.row.menuId) {
      drawerProps.value.row.parentId = params.row.menuId;
    } else {
      drawerProps.value.row.parentId = 0;
    }
    drawerProps.value.row.menuName = "";
    drawerProps.value.row.menuParam = "";
    drawerProps.value.row.menuPath = "";
    drawerProps.value.row.menuId = "";
    drawerProps.value.row.menuSort = null;
  } else {
    drawerProps.value = params; // 先整体赋值 再解析
    drawerProps.value.row.appId = JSON.parse(params.row.appId);
    console.log("放在父组件改动，子组件收到的appId", drawerProps.value.row.appId);
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
      if (drawerProps.value.title == "新增") {
        drawerProps.value.row.menuStatus = 1;
        // drawerProps.value.row.appId = 0;
      }
      drawerProps.value.row.appId = JSON.stringify(drawerProps.value.row.appId);
      console.log(drawerProps.value);

      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}菜单成功！` });
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
