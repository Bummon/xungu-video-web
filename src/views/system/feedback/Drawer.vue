<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    width="30%"
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
    <el-descriptions title="意见反馈详情" column="1" size="default" direction="horizontal">
      <el-descriptions-item label="ID">
        <el-tag effect="dark" type="info">{{ drawerProps.row.feedbackId }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="反馈标题">
        <el-tag effect="dark" type="primary">{{ drawerProps.row.feedbackName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="创建人">
        {{ drawerProps.row.createUsername }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ drawerProps.row.createTime }}
      </el-descriptions-item>
      <el-descriptions-item label="反馈内容">{{ drawerProps.row.feedbackContent }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Drawer">
import { ref } from "vue";
import "vue-json-viewer/style.css";
import { TFeedback } from "@/api/interface/system/tFeedback";

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<TFeedback.FeedBack>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

interface Option {
  label: string;
  key: number;
}

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

defineExpose({
  acceptParams
});
</script>
