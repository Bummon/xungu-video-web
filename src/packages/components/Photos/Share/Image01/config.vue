<template>
  <collapse-item name="属性" :expanded="true">
    <setting-item-box name="地址" :alone="true">
      <el-input v-model="optionData.dataset"></el-input>
    </setting-item-box>
    <setting-item-box name="上传" :alone="true">
      <el-upload
        class="upload-img"
        drag
        multiple
        :show-file-list="false"
        :http-request="customRequest"
        :before-upload="beforeUploadHandle"
      >
        <img v-if="optionData.dataset" class="upload-show" :src="optionData.dataset" alt="背景" />
        <div class="upload-img" v-show="!optionData.dataset">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽放入文件 <em>或点击图片上传</em></div>
        </div>
        <template #tip>
          <span class="upload-desc" depth="3"> 背景图需小于 {{ imageSize }}M ，格式为 png/jpg/gif 的文件</span>
        </template>
      </el-upload></setting-item-box
    >
  </collapse-item>
</template>

<script setup lang="ts">
import { nextTick, PropType, ref } from "vue";
import { option } from "./config";
import { CollapseItem, SettingItemBox, SettingItem } from "@/components/Pages/ChartItemSetting";
import { imageSize } from "@/settings/designSetting";
import { UploadCustomRequestOptions } from "naive-ui";
import { uploadBgcImg } from "@/api/modules/player/diyLayout";
import { FileTypeEnum } from "@/enums/fileTypeEnum";

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
});

const uploadFileListRef = ref();
// 上传图片前置处理
//@ts-expect-error
const beforeUploadHandle = async file => {
  console.log("调用上传前的检测", file);
  uploadFileListRef.value = [];
  const type = file.type;
  const size = file.size;

  if (size > 1024 * 1024 * imageSize) {
    window["$message"].warning(`图片超出 ${imageSize}M 限制，请重新上传！`);
    return false;
  }
  if (type !== FileTypeEnum.PNG && type !== FileTypeEnum.JPEG && type !== FileTypeEnum.GIF) {
    window["$message"].warning("文件格式不符合，请重新上传！");
    return false;
  }
  console.log("上传前的检测全部通过");
  return true;
};
// 上传接口
const customRequest = (options: UploadCustomRequestOptions) => {
  console.log(options, "调用上传接口");
  const { file } = options;
  console.log("上传的options", options);
  let formData = new FormData();
  formData.append("folderName", "diyLayoutImages");
  formData.append("file", file);
  uploadBgcImg(formData).then(res => {
    console.log("调用上传接口", res);
    nextTick(() => {
      console.log(res?.data[0].fileUrl);
      props.optionData.dataset = res?.data[0].fileUrl;
    });
  });
};
</script>
<style lang="scss" scoped>
.upload-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 90%;
  }
  .upload-desc {
    padding: 10px 0;
  }
}
</style>
