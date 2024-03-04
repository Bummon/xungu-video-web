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
          <el-form-item label="父级文件夹" prop="parentId">
            <el-tree-select
              v-model="drawerProps.row!.parentId"
              :data="drawerProps.tableData"
              :props="props"
              check-strictly
              :render-after-expand="false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="文件夹名称" prop="dirName">
            <el-input v-model="drawerProps.row!.dirName" placeholder="请填写文件夹名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="dirDesc">
            <el-input type="textarea" :rows="3" v-model="drawerProps.row!.dirDescr" placeholder="请填写描述" clearable></el-input>
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
import { BaseLibraryDir } from "@/api/interface/player/baseLibraryDir";
import { getTreeMenuList } from "@/api/modules/player/libraryDir";

// const getTableList = (params: any) => {
//   let newParams = JSON.parse(JSON.stringify(params));
//   return getTreeMenuList(newParams);
// };
const rules = reactive({
  dirName: [{ required: true, message: "请填写文件夹名称" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<BaseLibraryDir.LibraryDir>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
}

const props = {
  label: "dirName",
  children: "children",
  value: "dirId"
};
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  tableData: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log(params);
  if (params.title == "新增") {
    drawerProps.value = params;
    drawerProps.value.row.parentId = params.row.dirId;
    drawerProps.value.row.dirName = "";
    drawerProps.value.row.dirDescr = "";
  } else {
    drawerProps.value = params;
  }
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
      if (drawerProps.value.tableData.constructor === Array && drawerProps.value.tableData.length === 0) {
        drawerProps.value.row.parentId = 0;
      }
      await drawerProps.value.api(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}文件夹成功！` });
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
