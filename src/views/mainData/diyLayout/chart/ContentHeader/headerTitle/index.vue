<template>
  <!--  这是标题栏的内容-->
  <n-space>
    <el-icon size="20"><Notification /></el-icon>
    <span @click="handleFocus">
      布局名称 -
      <el-button v-show="!focus" size="small" type="primary">
        <span class="title">
          {{ comTitle }}
        </span>
      </el-button>
    </span>

    <el-input
      v-show="focus"
      ref="inputInstRef"
      size="small"
      type="text"
      maxlength="16"
      show-count
      placeholder="请输入项目名称"
      v-model.trim="title"
      @keyup.enter="handleBlur"
      @blur="handleBlur"
    ></el-input>
  </n-space>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { fetchRouteParamsLocation, setTitle } from "@/utils";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
import { EditCanvasConfigEnum } from "@/stores/modules/chartEditStore/chartEditStore.d";
const chartEditStore = useChartEditStore();

const focus = ref<boolean>(false);
const inputInstRef = ref(null);

// 根据路由 id 参数获取项目信息
const fetchProhectInfoById = () => {
  const id = fetchRouteParamsLocation();
  if (id.length) {
    return id[0];
  }
  return "";
};

// const title = ref<string>(fetchProhectInfoById() || "");
const title = ref<string>(chartEditStore.editCanvasConfig.projectName || "");

const comTitle = computed(() => {
  const newTitle = title.value.length ? title.value : "新项目";
  setTitle(`工作空间-${newTitle}`);
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.PROJECT_NAME, newTitle);
  return newTitle;
});

const handleFocus = () => {
  focus.value = true;
  nextTick(() => {
    inputInstRef.value && (inputInstRef.value as any).focus();
  });
};

const handleBlur = () => {
  focus.value = false;
};
</script>
<style lang="scss" scoped>
.title {
  padding-right: 5px;
  padding-left: 5px;
  font-size: 15px;
}
</style>
