<template>
  <!-- 侧边栏和数据分发处理 -->
  <div class="go-chart-common">
    <n-menu
      v-show="hidePackageOneCategory"
      class="chart-menu-width"
      v-model:value="selectValue"
      :options="packages.menuOptions"
      :icon-size="16"
      :indent="18"
      @update:value="clickItemHandle"
    ></n-menu>
    <div class="chart-content-list">
      <n-scrollbar trigger="none">
        <charts-item-box :menuOptions="packages.selectOptions" @deletePhoto="deleteHandle"></charts-item-box>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive, WatchOptions } from "vue";
import { useSettingStore } from "@/stores/modules/settingStore/settingStore";
import { loadAsyncComponent } from "@/utils";
import { usePackagesStore } from "@/stores/modules/packagesStore/packagesStore";
import { PackagesEnum, ConfigType } from "@/packages/index.d";

const ChartsItemBox = loadAsyncComponent(() => import("../ChartsItemBox/index.vue"));
const packagesStore = usePackagesStore();

const props = defineProps({
  selectOptions: {
    type: Object,
    default: () => {}
  }
});

// 隐藏设置
const settingStore = useSettingStore();

const hidePackageOneCategory = computed(() => {
  if (packages.categorysNum > 2) return true;
  return !settingStore.getHidePackageOneCategory;
});

// 核心存储项
let packages = reactive<{
  [T: string]: any;
}>({
  // 侧边栏
  menuOptions: [],
  // 当前选择
  selectOptions: {},
  // 分类归档
  categorys: {
    all: []
  },
  categoryNames: {
    all: "所有"
  },
  // 分类归档数量
  categorysNum: 0,
  // 存储不同类别组件进来的选中值
  saveSelectOptions: {}
});

const selectValue = ref<string>("all");

// 设置初始列表
const setSelectOptions = (categorys: any) => {
  for (const val in categorys) {
    packages.selectOptions = categorys[val];
    break;
  }
};

// 监听选中的列表  然后渲染到右侧供拖拽
watch<{ list: ConfigType[] }>(
  () => props.selectOptions,
  newData => {
    packages.categorysNum = 0; //种类数量等于0
    if (!newData) return;
    // Logic1： 遍历数组 添加到要展示的列表里面
    newData.list.forEach((item: ConfigType) => {
      const value: ConfigType[] = (packages.categorys as any)[item.category];
      packages.categorys[item.category] = value && value.length ? [...value, item] : [item];
      packages.categoryNames[item.category] = item.categoryName;
      packages.categorys["all"].push(item);
    });
    for (const val in packages.categorys) {
      packages.categorysNum += 1;
      packages.menuOptions.push({
        key: val,
        label: packages.categoryNames[val]
      });
    }
    setSelectOptions(packages.categorys);
    // 默认选中处理
    selectValue.value = packages.menuOptions[0]["key"];
  },
  {
    immediate: true
  } as WatchOptions<false> | undefined
);

watch(
  () => packagesStore.newPhoto,
  newPhoto => {
    if (!newPhoto) return;
    const newPhotoCategory = newPhoto.category;
    packages.categorys[newPhotoCategory].splice(1, 0, newPhoto);
    packages.categorys["all"].splice(1, 0, newPhoto);
  }
);

// 删除图片
const deleteHandle = (item: ConfigType, index: number) => {
  packages.categorys[item.category].splice(index, 1);
  packages.categorys["all"].splice(index, 1);
};

// 处理点击事件
const clickItemHandle = (key: string) => {
  console.log(`点击了二级目录item:选中的是${key}菜单`);
  packages.selectOptions = packages.categorys[key];
};
</script>

<style lang="scss" scoped>
/* 此高度与 ContentBox 组件关联 */
$top-height: 40px;
$menu-width: 65px;

@include go("chart-common") {
  display: flex;
  height: calc(100vh - #{$--header-height} - #{$top-height});
  .chart-menu-width {
    flex-shrink: 0;
    width: $menu-width;
    background-color: $--color-light-bg-1-shallow;
  }
  .chart-content-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    width: 200px;
  }

  @include deep {
    .n-menu-item {
      height: 30px;
      &.n-menu-item--selected {
        &::before {
          background-color: rgb(0 0 0 / 0%);
        }
      }
      .n-menu-item-content {
        padding: 0 14px !important;
        font-size: 12px !important;
        text-align: center;
      }
    }
  }
}
</style>
