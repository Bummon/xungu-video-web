<!--配置栏 右侧上方的-->
<template>
  <div class="go-canvas-setting">
    <n-form inline :label-width="45" size="small" label-placement="left">
      <n-form-item label="宽度">
        <!-- 尺寸选择 -->
        <n-input-number
          size="small"
          v-model:value="canvasConfig.width"
          :disabled="editCanvas.lockScale"
          :validator="validator"
          @update:value="changeSizeHandle"
        ></n-input-number>
      </n-form-item>
      <n-form-item label="高度">
        <n-input-number
          size="small"
          v-model:value="canvasConfig.height"
          :disabled="editCanvas.lockScale"
          :validator="validator"
          @update:value="changeSizeHandle"
        ></n-input-number>
      </n-form-item>
    </n-form>

    <div class="upload-box">
      <n-upload
        v-model:file-list="uploadFileListRef"
        :show-file-list="false"
        :customRequest="customRequest"
        :onBeforeUpload="beforeUploadHandle"
      >
        <n-upload-dragger>
          <img v-if="canvasConfig.backgroundImage" class="upload-show" :src="canvasConfig.backgroundImage" alt="背景" />
          <div class="upload-img" v-show="!canvasConfig.backgroundImage">
            <img src="../../../../../../../assets/images/canvas/noImage.png" />
            <span class="upload-desc" depth="3"> 背景图需小于 {{ backgroundImageSize }}M ，格式为 png/jpg/gif 的文件</span>
          </div>
        </n-upload-dragger>
      </n-upload>
    </div>
    <n-space vertical :size="12">
      <n-space>
        <n-text>背景颜色</n-text>
        <div class="picker-height">
          <el-color-picker
            v-if="!switchSelectColorLoading"
            v-model="canvasConfig.background"
            show-alpha
            color-format="hex"
            size="default"
          />
        </div>
      </n-space>
      <n-space>
        <span>应用类型</span>
        <el-select
          v-model="selectColorValue"
          class="m-2"
          :disabled="!canvasConfig.backgroundImage"
          style="width: 250px"
          @change="selectColorValueHandle"
        >
          <el-option size="small" v-for="item in selectColorOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </n-space>
      <n-space>
        <n-text>背景控制</n-text>
        <n-button class="clear-btn" size="small" :disabled="!canvasConfig.backgroundImage" @click="clearImage">
          清除背景
        </n-button>
        <n-button class="clear-btn" size="small" :disabled="!canvasConfig.background" @click="clearColor"> 清除颜色</n-button>
      </n-space>
      <n-space>
        <n-text>适配方式</n-text>
        <n-button-group>
          <n-button
            v-for="item in previewTypeList"
            :key="item.key"
            :type="canvasConfig.previewScaleType === item.key ? 'primary' : 'tertiary'"
            ghost
            size="small"
            @click="selectPreviewType(item.key)"
          >
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-icon class="select-preview-icon" size="18">
                  <component :is="item.icon"></component>
                </n-icon>
              </template>
              {{ item.desc }}
            </n-tooltip>
          </n-button>
        </n-button-group>
      </n-space>
    </n-space>

    <!-- 滤镜 -->
    <styles-setting :isCanvas="true" :chartStyles="canvasConfig"></styles-setting>
    <!--    <n-divider style="margin: 10px 0"></n-divider>-->
    <XGDivider style="margin: 10px 0"></XGDivider>
    <!-- 主题选择和布局的全局配置 -->
    <!--    <n-tabs class="tabs-box" size="small" type="segment">-->
    <!--      <n-tab-pane v-for="item in globalTabList" :key="item.key" :name="item.key" size="small" display-directive="show:lazy">-->
    <!--        <template #tab>-->
    <!--          <n-space>-->
    <!--            <span>{{ item.title }}</span>-->
    <!--            <n-icon size="16" class="icon-position">-->
    <!--              <component :is="item.icon"></component>-->
    <!--            </n-icon>-->
    <!--          </n-space>-->
    <!--        </template>-->
    <!--        <component :is="item.render"></component>-->
    <!--      </n-tab-pane>-->
    <!--    </n-tabs>-->
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { backgroundImageSize } from "@/settings/designSetting";
import { swatchesColors } from "@/settings/chartThemes";
import { FileTypeEnum } from "@/enums/fileTypeEnum";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
import { EditCanvasConfigEnum } from "@/stores/modules/chartEditStore/chartEditStore.d";
import { StylesSetting } from "@/components/Pages/ChartItemSetting";
import { UploadCustomRequestOptions } from "naive-ui";
import { fileToUrl, loadAsyncComponent } from "@/utils";
import { PreviewScaleEnum } from "@/enums/styleEnum";
import { icon } from "@/plugins";
import { XGDivider } from "@/components/xg_components/divider";
import { uploadBgcImg } from "@/api/modules/player/diyLayout";
const { ColorPaletteIcon } = icon.ionicons5;
const { ScaleIcon, FitToScreenIcon, FitToHeightIcon, FitToWidthIcon } = icon.carbon;

const chartEditStore = useChartEditStore();
const canvasConfig = chartEditStore.getEditCanvasConfig;
const editCanvas = chartEditStore.getEditCanvas;

const uploadFileListRef = ref();
const switchSelectColorLoading = ref(false);
const selectColorValue = ref(0);

const ChartThemeColor = loadAsyncComponent(() => import("./components/ChartThemeColor/index.vue"));

// 默认应用类型
const selectColorOptions = [
  {
    label: "应用颜色",
    value: 0
  },
  {
    label: "应用背景",
    value: 1
  }
];

const globalTabList = [
  {
    key: "ChartTheme",
    title: "主题颜色",
    icon: ColorPaletteIcon,
    render: ChartThemeColor
  }
];

const previewTypeList = [
  {
    key: PreviewScaleEnum.FIT,
    title: "自适应",
    icon: ScaleIcon,
    desc: "自适应比例展示，页面会有留白"
  },
  {
    key: PreviewScaleEnum.SCROLL_Y,
    title: "Y轴滚动",
    icon: FitToWidthIcon,
    desc: "X轴铺满，Y轴自适应滚动"
  },
  {
    key: PreviewScaleEnum.SCROLL_X,
    title: "X轴滚动",
    icon: FitToHeightIcon,
    desc: "Y轴铺满，X轴自适应滚动"
  },
  {
    key: PreviewScaleEnum.FULL,
    title: "铺满",
    icon: FitToScreenIcon,
    desc: "强行拉伸画面，填充所有视图"
  }
];

watch(
  () => canvasConfig.selectColor,
  newValue => {
    selectColorValue.value = newValue ? 0 : 1;
  },
  {
    immediate: true
  }
);

// 画布尺寸规则
const validator = (x: number) => x > 50;

// 修改尺寸
const changeSizeHandle = () => {
  chartEditStore.computedScale();
};

// 上传图片前置处理
//@ts-expect-error
const beforeUploadHandle = async ({ file }) => {
  uploadFileListRef.value = [];
  const type = file.file.type;
  const size = file.file.size;

  if (size > 1024 * 1024 * backgroundImageSize) {
    window["$message"].warning(`图片超出 ${backgroundImageSize}M 限制，请重新上传！`);
    return false;
  }
  if (type !== FileTypeEnum.PNG && type !== FileTypeEnum.JPEG && type !== FileTypeEnum.GIF) {
    window["$message"].warning("文件格式不符合，请重新上传！");
    return false;
  }
  return true;
};

// 应用颜色
const selectColorValueHandle = (value: number) => {
  console.log(value);
  canvasConfig.selectColor = value == 0;
};

// 清除背景
const clearImage = () => {
  //  把缓存中的背景图片改成undefined
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND_IMAGE, undefined);
  //  让缓存中的select——color 改为true
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, true);
};

// 启用/关闭 颜色（强制更新）
const switchSelectColorHandle = () => {
  switchSelectColorLoading.value = true;
  setTimeout(() => {
    switchSelectColorLoading.value = false;
  });
};

// 清除颜色
const clearColor = () => {
  // 设置背景色为undefined
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND, undefined);
  if (canvasConfig.backgroundImage) {
    // 如果有背景图 则使缓存中的select——color 改成false
    chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false);
  }
  switchSelectColorHandle();
};

// 自定义上传操作
const customRequest = (options: UploadCustomRequestOptions) => {
  const { file } = options;
  console.log("上传的options", options);
  let formData = new FormData();
  formData.append("folderName", "diyLayoutBackgroundImage");
  formData.append("file", file?.file);
  uploadBgcImg(formData).then(res => {
    console.log("调用上传接口", res);
    nextTick(() => {
      console.log(res.data[0].fileUrl);
      chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND_IMAGE, res.data[0].fileUrl);
      chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false);
    });
  });
  // nextTick(() => {
  //   if (file.file) {
  //     const ImageUrl = fileToUrl(file.file);
  //     chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND_IMAGE, ImageUrl);
  //     chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false);
  //   } else {
  //     window["$message"].error("添加图片失败，请稍后重试！");
  //   }
  // });
};

// 选择适配方式
const selectPreviewType = (key: PreviewScaleEnum) => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.PREVIEW_SCALE_TYPE, key);
};
</script>

<style lang="scss" scoped>
$upload-width: 326px;
$upload-height: 193px;

@include go(canvas-setting) {
  padding-top: 20px;
  .upload-box {
    margin-bottom: 20px;
    cursor: pointer;

    @include deep {
      .n-upload-dragger {
        width: $upload-width;
        padding: 5px;
        background-color: rgb(0 0 0 / 0%);
      }
    }
    .upload-show {
      width: -webkit-fill-available;
      height: $upload-height;
      border-radius: 5px;
    }
    .upload-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        height: 150px;
      }
      .upload-desc {
        padding: 10px 0;
      }
    }
  }
  .icon-position {
    padding-top: 2px;
  }
  .picker-height {
    min-height: 35px;
  }
  .clear-btn {
    padding-right: 2.25em;
    padding-left: 2.25em;
  }
  .select-preview-icon {
    padding-right: 0.68em;
    padding-left: 0.68em;
  }
  .tabs-box {
    margin-top: 20px;
  }
}
</style>
