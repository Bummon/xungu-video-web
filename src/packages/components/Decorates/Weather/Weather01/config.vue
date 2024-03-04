<template>
  <collapse-item name="属性" :expanded="true">
    <setting-item-box name="暂无" :alone="true">
      <setting-item>
        <n-input v-model:value="optionData.url" placeholder="请输入要填写的内容" />
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { option } from "./config";
import { CollapseItem, SettingItemBox, SettingItem } from "@/components/Pages/ChartItemSetting";

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
});
</script>
