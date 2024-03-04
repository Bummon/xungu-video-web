<template>
  <collapse-item name="信息" :expanded="true">
    <setting-item-box name="文字" :alone="true">
      <setting-item>
        <el-input v-model="optionData.dataset" size="default"></el-input>
      </setting-item>
    </setting-item-box>
  </collapse-item>
  <collapse-item name="样式" :expanded="true">
    <setting-item-box name="文字">
      <setting-item name="字体大小">
        <n-input-number v-model:value="optionData.size" size="small" placeholder="字体大小"></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="渐变色参数">
      <setting-item name="起始值">
        <el-color-picker v-model="optionData.gradient.from" show-alpha color-format="hex" size="default" />
      </setting-item>
      <setting-item name="结束值">
        <el-color-picker v-model="optionData.gradient.to" show-alpha color-format="hex" size="default" />
      </setting-item>
      <setting-item name="偏移角度">
        <n-input-number v-model:value="optionData.gradient.deg" size="small" placeholder="颜色旋转"></n-input-number>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { option } from "./config";
import { CollapseItem, SettingItemBox, SettingItem } from "@/components/Pages/ChartItemSetting";
import { NColorPicker } from "naive-ui";
const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
});
</script>
