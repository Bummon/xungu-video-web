<template>
  <!--  右侧的三个按钮  发布 修改 上传-->
  <n-space class="go-mt-0">
    <n-button v-for="item in comBtnList" :key="item.title" :type="item.type as buttonTypes" ghost @click="item.event">
      <template #icon>
        <component :is="item.icon"></component>
      </template>
      <span>{{ item.title }}</span>
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  renderIcon,
  XGDialog,
  fetchPathByName,
  routerTurnByPath,
  setSessionStorage,
  getLocalStorage,
  JSONStringify
} from "@/utils";
import { PreviewEnum } from "@/enums/pageEnum";
import { StorageEnum } from "@/enums/storageEnum";
import { useRoute } from "vue-router";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
import { syncData } from "../../Canvas_Editor/components/EditTools/hooks/useSyncUpdate.hook";
import { icon } from "@/plugins";
import { cloneDeep } from "lodash";
import { buttonTypes } from "@/generalInterface/Native_type";
// API 上传API
import { DiyLayoutAddRow, DiyLayoutUpdateRow } from "@/api/modules/player/diyLayout";
import { XGHandleClose, XGHandleEnsure } from "@/hooks/useHandleData";

const { BrowsersOutlineIcon, SendIcon, AnalyticsIcon } = icon.ionicons5;
const chartEditStore = useChartEditStore();

const Props = defineProps({
  parentMethod: {
    type: Function,
    default: () => {}
  }
});
// 预览
// const previewHandle = () => {
//   console.log("点击预览");
//   const path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, "href");
//   if (!path) return;
//   const { id } = routerParamsInfo.params;
//   // id 标识
//   const previewId = typeof id === "string" ? id : id[0];
//   const storageInfo = chartEditStore.getStorageInfo;
//   const sessionStorageInfo = getLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST) || [];
//
//   if (sessionStorageInfo?.length) {
//     const repeatIndex = sessionStorageInfo.findIndex((e: { id: string }) => e.id === previewId);
//     // 重复替换
//     if (repeatIndex !== -1) {
//       sessionStorageInfo.splice(repeatIndex, 1, { id: previewId, ...storageInfo });
//       setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo);
//     } else {
//       sessionStorageInfo.push({
//         id: previewId,
//         ...storageInfo
//       });
//       setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo);
//     }
//   } else {
//     setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ id: previewId, ...storageInfo }]);
//   }
//   // 跳转
//   routerTurnByPath(path, [previewId], undefined, true);
// };

// 发布
const sendHandle = () => {
  console.log("点击了发布");
  let title = chartEditStore.getTitle;
  let jsonData = JSONStringify(chartEditStore.getStorageInfo || []);
  // Logic1：如果有id 则调用更新
  if (chartEditStore.id) {
    XGHandleEnsure(
      DiyLayoutUpdateRow,
      {
        layoutDescr: "",
        layoutDesign: jsonData,
        layoutTitle: title,
        layoutIco: "",
        layoutId: chartEditStore.id
      },
      "修改布局"
    ).then(() => {
      console.log("修改成功");
      Props.parentMethod();
    });
  } else {
    // Logic2：如果没id 则调取新增布局的接口
    XGHandleEnsure(
      DiyLayoutAddRow,
      {
        layoutDescr: "",
        layoutDesign: jsonData,
        layoutTitle: title,
        layoutIco: ""
      },
      "发布布局"
    ).then(() => {
      console.log("发布成功");
      Props.parentMethod();
    });
  }
};
const closeHandle = () => {
  console.log("点击了关闭");
  Props.parentMethod();
};
const btnList = [
  {
    select: true,
    title: "修改上传",
    type: "primary",
    icon: renderIcon(AnalyticsIcon),
    event: syncData
  },
  {
    select: true,
    title: "取消",
    type: "primary",
    icon: renderIcon(BrowsersOutlineIcon),
    event: closeHandle
  },
  {
    select: true,
    title: "发布",
    type: "primary",
    icon: renderIcon(SendIcon),
    event: sendHandle
  }
  // {
  //   select: true,
  //   title: "预览",
  //   type: "primary",
  //   icon: renderIcon(BrowsersOutlineIcon),
  //   event: previewHandle
  // },
];
// 计算出要展示的按钮
const comBtnList = computed(() => {
  if (chartEditStore.getEditCanvas.isCodeEdit) {
    return btnList;
  }
  const cloneList = cloneDeep(btnList);
  cloneList.shift();
  return cloneList;
});
</script>

<style lang="scss" scoped>
.align-center {
  margin-top: -4px;
}
</style>
