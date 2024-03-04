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
        <el-col :span="24">
          <el-form-item label="应用" prop="appId">
            <el-select v-model="drawerProps.row!.appId" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in appOptions" :key="item.appId" :label="item.appName" :value="item.appId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="标题" prop="title">
            <el-input v-model="drawerProps.row!.title" placeholder="请填写标题" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="版本号" prop="versionNum">
            <el-input v-model="drawerProps.row!.versionNum" placeholder="请填写版本号" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="主版本" prop="major">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row!.major"
              clearable
              @change="changeVersion"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="次版本" prop="minor">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row!.minor"
              clearable
              @change="changeVersion"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="修订版本" prop="revise">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row!.revise"
              clearable
              @change="changeVersion"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="附加版本" prop="attach">
            <el-input v-model="drawerProps.row!.attach" placeholder="请填写附加版本" clearable @change="changeVersion"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="必要更新" prop="isMust">
            <el-switch v-model="drawerProps.row!.isMust" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="versionStatus">
            <el-switch v-model="drawerProps.row!.versionStatus" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="上传文件" prop="context">
            <el-upload
              style="width: 100%"
              action="#"
              class="upload"
              :drag="true"
              :multiple="false"
              :limit="1"
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
      <el-row>
        <el-col :span="24">
          <el-form-item label="更新内容" prop="context">
            <el-input
              type="textarea"
              :rows="4"
              v-model="drawerProps.row!.context"
              placeholder="请填写更新内容"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-col :span="24">
            <el-form-item label="备注" prop="versionDescr">
              <el-input
                type="textarea"
                :rows="4"
                v-model="drawerProps.row!.versionDescr"
                placeholder="请填写备注"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="AppDrawer">
import { ref, reactive } from "vue";
import { ElMessage, ElNotification, FormInstance, UploadRequestOptions } from "element-plus";
import { sysAppVersion } from "@/api/interface/system1/sysAppVersion";
import { sysApp } from "@/api/interface/system1/sysApp";
import { getList } from "@/api/modules/system1/app";
import { upload, fileRemove } from "@/api/modules/upload";

const rules = reactive({
  appId: [{ required: true, message: "请选择应用" }],
  title: [{ required: true, message: "请填写标题" }],
  versionNum: [{ required: true, message: "请填写版本号" }],
  versionStatus: [{ required: true, message: "请选择状态" }]
});

//下拉框所有的值
let appOptions = ref<sysApp.Option[]>([]);
getList().then(res => {
  appOptions.value = res as sysApp.Option[];
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<sysAppVersion.appVersion>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
//文件上传
let fileList = ref<any>([]);
const uploadExcel = async (param: UploadRequestOptions) => {
  let excelFormData = new FormData();
  excelFormData.append("file", param.file);
  const res = await upload(excelFormData);
  if (res.code === 200) {
    drawerProps.value.row.fileName = res.data.fileName;
    drawerProps.value.row.fileSize = res.data.fileSize;
    drawerProps.value.row.versionUrl = res.data.fileUrl;
    drawerProps.value.row.actualUrl = res.data.actualUrl;
    excelUploadSuccess();
  }
};
const handleRemove = async (file: UploadRequestOptions) => {
  console.log(drawerProps.value.row.actualUrl);
  const res = await fileRemove({ actualUrl: drawerProps.value.row.actualUrl });
  console.log(res);
  if (res.code == 200) {
    ElMessage.success({ message: `删除成功！` });
    drawerProps.value.row.fileName = "";
    drawerProps.value.row.fileSize = "";
    drawerProps.value.row.versionUrl = "";
  }
};
// 上传成功提示
const excelUploadSuccess = () => {
  ElNotification({
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    message: `上传成功`,
    duration: 10000,
    type: "success"
  });
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  fileList.value = [];
  if (drawerProps.value.title == "编辑") {
    if (drawerProps.value.row.fileName) {
      fileList.value.push({
        name: drawerProps.value.row.fileName,
        url: drawerProps.value.row.versionUrl
      });
    }
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
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}版本成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  });
};

const changeVersion = () => {
  drawerProps.value.row.versionNum = "";
  drawerProps.value.row.versionNum += drawerProps.value.row.major?.toString();
  if (drawerProps.value.row.minor != undefined) {
    drawerProps.value.row.versionNum += "." + drawerProps.value.row.minor?.toString();
  }
  if (drawerProps.value.row.revise != undefined) {
    drawerProps.value.row.versionNum += "." + drawerProps.value.row.revise?.toString() ?? "";
  }

  console.log("v2", drawerProps.value.row.major);
  if (drawerProps.value.row.attach != null && drawerProps.value.row.attach != "") {
    drawerProps.value.row.versionNum += "-" + drawerProps.value.row.attach;
  }
};

defineExpose({
  acceptParams
});
</script>
