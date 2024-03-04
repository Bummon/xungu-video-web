<template>
  <layout-header>
    <template #left>
      <slot name="left"></slot>
    </template>
    <template #center>
      <slot name="center"></slot>
    </template>
    <template #ri-left>
      <slot name="ri-left"></slot>
    </template>
    <template #ri-right>
      <slot name="ri-right"></slot>
    </template>
  </layout-header>
</template>
<script setup lang="ts">
import { LayoutHeader } from "@/layouts/components/charts/LayoutHeader";
</script>
