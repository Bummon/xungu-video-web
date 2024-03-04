<template>
  <el-dialog
    v-model="finishDrawerVisible"
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
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :model="drawerProps.row">
      <el-row>
        <el-col :span="24">
          <el-col :span="24">
            <el-form-item label="说明" prop="orderDescr">
              <el-input
                type="textarea"
                :rows="4"
                v-model="drawerProps.row!.orderDescr"
                placeholder="请填写说明"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="图片" prop="imageUrl">
            <OrderUploadImgs v-model:file-list="fileList" width="135px" height="135px" :file-size="5">
              <template #empty>
                <el-icon>
                  <Picture />
                </el-icon>
                <span>请上传照片</span>
              </template>
              <template #tip> 图片大小不能超过 5M</template>
            </OrderUploadImgs>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="finishDrawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="FinishDrawer">
import { ref, reactive, computed, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";

import { WorkOrder } from "@/api/interface/work";
import OrderUploadImgs from "@/components/Upload/orderImgs.vue";

const rules = reactive({});

const fileList = ref<any>([]);

interface DrawerProps {
  title: string;
  row: Partial<WorkOrder.order>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
}

const finishDrawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  title: "",
  row: {},
  tableData: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log("打开弹窗时传入的参数", params);
  drawerProps.value = params;
  drawerProps.value.row.finishFiles = [];
  finishDrawerVisible.value = true;
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
      if (fileList.value != null) {
        drawerProps.value.row.finishFiles = [];
        fileList.value!.forEach(item => {
          drawerProps.value.row.finishFiles.push({
            fileExt: item.ext,
            fileName: item.name,
            fileSize: item.size,
            fileUrl: item.url
          });
        });
      }
      drawerProps.value.row.orderStatus = 2;
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}！` });
      drawerProps.value.getTableList!();
      finishDrawerVisible.value = false;
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
