<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    width="30%"
    draggable
    @close="updateProTable"
    :modal="false"
  >
    <template #header>
      <div class="" style="display: flex; align-items: center">
        <el-icon :size="18">
          <Edit />
        </el-icon>
        <span v-if="drawerProps.isFirst" style="vertical-align: middle">{{ drawerProps.title }} 一级区域 </span>
        <span v-else style="vertical-align: middle"> {{ drawerProps.title }}二级区域 </span>
      </div>
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
          <el-form-item label="区域名称" prop="areaName">
            <el-input v-model="drawerProps.row!.areaName" placeholder="请填写区域名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!drawerProps.isFirst">
        <el-col :span="24">
          <el-form-item label="一级区域" prop="parentId">
            <el-select v-model="drawerProps.row.parentId" placeholder="请选择从属的一级区域" style="width: 100%">
              <el-option v-for="item in firstAreaList" :key="item.areaId" :label="item.areaName" :value="item.areaId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-col :span="24">
            <el-form-item label="说明" prop="areaDescr">
              <el-input
                type="textarea"
                :rows="4"
                v-model="drawerProps.row!.areaDescr"
                placeholder="请填写备注"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="附件" prop="context">
            <el-upload
              style="width: 80%"
              action="#"
              class="upload"
              :drag="true"
              :multiple="true"
              :limit="10"
              :show-file-list="true"
              :file-list="fileList"
              :http-request="uploadExcel"
              :on-remove="handleRemove"
            >
              <slot name="empty">
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </slot>
            </el-upload>
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
import { ElMessage, FormInstance, ElNotification, UploadRequestOptions } from "element-plus";
import { AreaType } from "@/api/interface/control/area";
import { AreaHttp } from "@/api/modules/control/area";
import { upload } from "@/api/modules/upload";

interface DrawerProps {
  title: string;
  isView: boolean;
  isFirst: boolean;
  row: Partial<AreaType.area>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  isFirst: false,
  row: {}
});
const props = defineProps({
  updateData: {
    type: Function,
    default: () => {
      console.log("触发默认的方法");
    }
  }
});
const rules = reactive({
  areaName: [
    { required: true, message: "请填写区域名称" },
    { max: 12, message: "区域名称应在12个字以内" }
  ],
  parentId: [{ required: !drawerProps.value.isFirst, message: "请填写区域名称" }]
});
const firstAreaList = ref<AreaType.area[]>([]);
//文件上传
let fileList = ref<any>([]);
const uploadExcel = async (param: UploadRequestOptions) => {
  let excelFormData = new FormData();
  excelFormData.append("file", param.file);
  const res = await upload(excelFormData);
  if (res.code === 200) {
    fileList.value.push(res.data);
    if (!drawerProps.value.row.files) {
      drawerProps.value.row.files = [];
    }
    drawerProps.value.row.files.push({
      fileExt: res.data.fileType,
      fileName: res.data.fileName,
      fileSize: res.data.fileSize,
      fileUrl: res.data.fileUrl
    });
    UploadSuccess();
  }
};
const UploadSuccess = () => {
  ElNotification({
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    message: `上传成功`,
    duration: 10000,
    type: "success"
  });
};
const handleRemove = async (file: UploadRequestOptions) => {
  console.log(file);
  ElMessage.success({ message: `删除成功！` });
};

const drawerVisible = ref(false);

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  // 二级区域里面 需要拿到一级区域的列表
  if (!params.isFirst) {
    firstAreaList.value = (await AreaHttp.getAreaList({ parentId: 0 })).data;
  }
  // 文件数据
  fileList.value = [];
  if (drawerProps.value.title != "新增") {
    // 如果是编辑
    if (drawerProps.value.row.files && drawerProps.value.row.files?.length > 0) {
      drawerProps.value.row.files.forEach(file => {
        fileList.value.push({ name: file.fileName, url: file.fileUrl });
      });
    }
  } else {
    // 这是新增的处理罗辑
    drawerProps.value.row.files = [];
  }
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
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}区域成功！` });
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  });
};

/**
 * 关闭前  调用父组件更新
 */
function updateProTable() {
  console.log("关闭弹窗触发更新数据的回调");
  // 借用父组件的方法 更新品牌数据
  props.updateData();
}

defineExpose({
  acceptParams
});
</script>
