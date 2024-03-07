<template>
  <div class="card table-main">
    <p>更多设置</p>
    <el-divider />
    <el-form label-width="100px" label-suffix=" :" ref="ruleFormRef" :model="configProps">
      <el-row :gutter="20" v-if="!isEdit">
        <el-col>
          <el-form-item>
            <el-button v-has="'system:config:edit'" class="btn" size="default" type="primary" @click="isEdit = true" link>
              编辑
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="系统名称" prop="systemName">
            <el-text>{{ configProps.systemName }}</el-text>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="系统Logo" prop="systemLogo">
            <UploadImg v-model:image-url="configProps.systemLogo" :disabled="true" width="135px" height="135px" :file-size="1">
              <template #empty>
                <el-icon>
                  <Picture />
                </el-icon>
              </template>
            </UploadImg>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-else>
        <el-col>
          <el-form-item>
            <el-button v-has="'system:config:edit'" class="btn" size="default" type="primary" @click="handleEdit" link
              >完成
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="系统名称" prop="systemName">
            <el-input
              v-model="configProps.systemName"
              style="width: 240px"
              maxlength="8"
              placeholder="请填写系统名称"
              show-word-limit
              type="text"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="系统Logo" prop="systemLogo">
            <UploadImg
              v-model:image-url="configProps.systemLogo"
              @update:imageUrl="handleUploadUrl"
              :api="uploadFile"
              width="135px"
              height="135px"
              :file-size="1"
            >
              <template #empty>
                <el-icon>
                  <Picture />
                </el-icon>
                <span>请上传图片</span>
              </template>
              <template #tip> 图片大小不能超过 1M</template>
            </UploadImg>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="MoreConfig">
import { onMounted, ref } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
import { getConfigInfo, updateConfig } from "@/api/modules/system/sysConfig";
import { sysConfig } from "@/api/interface/system/sysConfig";
import { ElMessage, FormInstance } from "element-plus";
import { uploadFile } from "@/api/modules/common/common";

const disabled = ref(false);

// 更多设置参数
const configProps = ref<sysConfig.Config>({});

let isEdit = ref(false);

//初始化参数
const getConfigDetails = async () => {
  configProps.value = (await getConfigInfo()).data;
};

const handleUploadUrl = (fileUrl: string) => {
  console.log("fileUrl", fileUrl);
  configProps.value!.systemLogo = import.meta.env.VITE_API_URL + fileUrl;
};

// 编辑数据
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);

// 修改更多配置
const handleEdit = async () => {
  if (loading.value) {
    return;
  }
  try {
    loading.value = true;
    const params = {
      configId: configProps.value!.configId,
      systemName: configProps.value!.systemName,
      systemLogo: configProps.value!.systemLogo
    };
    await updateConfig(params);
    ElMessage.success({ message: "修改系统配置成功！" });
    isEdit.value = false;
    getConfigDetails();
    isEdit.value = false;
    location.reload();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  getConfigDetails();
});
</script>

<style scoped>
.btn {
  width: 30%;
}
</style>
