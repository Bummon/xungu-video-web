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
          <el-form-item label="场所名称" prop="roomName">
            <el-input v-model="drawerProps.row!.roomName" placeholder="请填写场所名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="位置" prop="siteId">
            <el-select v-model="drawerProps.row!.siteId" placeholder="请选择位置" style="width: 100%">
              <el-option v-for="item in siteOptions" :key="item.siteId" :label="item.siteName" :value="item.siteId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="roomSort">
            <el-input-number
              style="width: 100%"
              v-model="drawerProps.row!.roomSort"
              :min="0"
              placeholder="请填写顺序"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="roomStatus">
            <el-switch v-model="drawerProps.row!.roomStatus" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="roomDescr">
            <el-input
              type="textarea"
              :rows="3"
              v-model="drawerProps.row!.roomDescr"
              placeholder="请填写备注"
              clearable
            ></el-input>
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

<script setup lang="ts" name="RoomDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { BaseRoom } from "@/api/interface/player/baseRoom";
import { getList } from "@/api/modules/player/site";
import { BaseSite } from "@/api/interface/player/baseSite";

const rules = reactive({
  roomName: [{ required: true, trigger: "blur" }],
  siteId: [{ required: true, message: "请选择位置" }],
  roomSort: [{ required: true, message: "请填写顺序" }],
  roomStatus: [{ required: true, message: "请选择状态" }]
});

//位置下拉框所有的值
let siteOptions = ref<BaseSite.Option[]>([]);
getList().then(res => {
  siteOptions.value = res as BaseSite.Option[];
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<BaseRoom.Room>;
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
      ElMessage.success({ message: `${drawerProps.value.title}场所成功！` });
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
