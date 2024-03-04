<template>
  <el-dialog v-model="dialogVisible" :title="`${parameter.title}`" :destroy-on-close="true" width="480px" draggable>
    <el-form ref="ruleFormRef" class="drawer-multiColumn-form" :rules="rules" :model="parameter.row">
      <!--      <el-form-item label="名称" prop="libName">-->
      <!--        <el-input v-model="parameter.row!.libName" placeholder="请填写名称" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!-- <el-form-item label="显示顺序" prop="libSort">
        <el-input-number
          style="width: 100%"
          v-model="parameter.row!.libSort"
          :min="0"
          placeholder="请填写顺序"
          clearable
        ></el-input-number>
      </el-form-item>
      <el-form-item label="描述说明" prop="libDescr">
        <el-input :rows="3" type="textarea" v-model="parameter.row!.libDescr" placeholder="请填写描述说明" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="libStatus">
        <el-radio-group v-model="parameter.row!.libStatus">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item>
        <el-upload
          action="#"
          class="upload"
          :drag="true"
          :limit="excelLimit"
          :multiple="true"
          :show-file-list="true"
          :file-list="fileList"
          :http-request="uploadExcel"
          :on-exceed="handleExceed"
        >
          <slot name="empty">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </slot>
          <template #tip>
            <slot name="tip">
              <div class="el-upload__tip">请上传 .png , .jpg, .mp4, .ppt 标准格式文件</div>
            </slot>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="ImportExcel">
import { ref, reactive } from "vue";
import { ElNotification, ElMessage, UploadRequestOptions } from "element-plus";
import { addRow, deleteRows } from "@/api/modules/player/baseLibrary";
import { upload } from "@/api/modules/upload";

const rules = reactive({
  // libName: [{ required: true, message: "请填写名字", trigger: "blur" }],
  libSort: [{ required: true, message: "请填写顺序", trigger: "blur" }],
  libStatus: [{ required: true, message: "请选择状态", trigger: "blur" }]
});

interface ExcelParameterProps {
  title: string; // 标题
  row: {};
  // fileSize?: number; // 上传文件的大小
  // fileType?: File.ExcelMimeType[]; // 上传文件的类型
  api?: (params: any) => Promise<any>; // 批量导入的Api
  getTableList?: () => void; // 获取表格数据的Api
}

// 是否覆盖数据
// 最大文件上传数
const excelLimit = ref(10);
// dialog状态
const dialogVisible = ref(false);
// 父组件传过来的参数
const parameter = ref<ExcelParameterProps>({
  title: "",
  row: {}
  // fileSize: 5,
  // fileType: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
});
let fileList = ref<any>([]);
// 接收父组件参数
const acceptParams = (params: ExcelParameterProps) => {
  parameter.value = { ...parameter.value, ...params };
  console.log(parameter.value);
  fileList.value = [];
  parameter.value.row.list = [];
  // if (parameter.value.title == "编辑") {
  //   fileList.value.push({
  //     name: parameter.value.row.libFilename,
  //     url: parameter.value.row.libUrl
  //   });
  // }
  dialogVisible.value = true;
};
// 文件上传
const uploadExcel = async (param: UploadRequestOptions) => {
  console.log(param);
  let excelFormData = new FormData();
  excelFormData.append("file", param.file);
  const res = await upload(excelFormData);
  if (res.code === 200) {
    parameter.value.row.list.push({
      dirId: parameter.value.row.dirId,
      libFilename: res.data.fileName,
      libFilesize: res.data.fileSize,
      libExt: res.data.fileType,
      libUrl: res.data.fileUrl
    });
    // parameter.value.row.libFilename = res.data.fileName;
    // parameter.value.row.libFilesize = res.data.fileSize;
    // parameter.value.row.libExt = res.data.fileType;
    // parameter.value.row.libUrl = res.data.fileUrl;
    excelUploadSuccess(res);
  }
};
const loading = ref(false);

// 提交数据（新增/编辑）
const handleSubmit = async () => {
  if (loading.value) return;
  try {
    loading.value = true;
    let list = parameter.value.row.list;
    await parameter.value.api!(list);
    ElMessage.success({ message: `${parameter.value.title}成功！` });
    parameter.value.getTableList!();
    dialogVisible.value = false;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
// 文件数超出提示
const handleExceed = () => {
  ElNotification({
    title: "温馨提示",
    message: "最多只能上传一个文件！",
    type: "warning"
  });
};

// 上传错误提示
const excelUploadError = res => {
  ElNotification({
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    message: `${res.msg}`,
    duration: 10000,
    type: "error"
  });
};

// 上传成功提示
const excelUploadSuccess = res => {
  ElNotification({
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    message: `上传成功`,
    duration: 10000,
    type: "success"
  });
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
.upload {
  width: 100%;
}
</style>
