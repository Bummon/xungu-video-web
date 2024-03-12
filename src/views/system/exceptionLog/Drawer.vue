<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    width="60%"
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
    <el-descriptions title="异常日志详情" column="2" size="default" direction="horizontal">
      <el-descriptions-item label="模块">
        <el-tag effect="dark" type="info">{{ drawerProps.row.moduleName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="名称">
        <el-tag effect="dark" type="danger">{{ drawerProps.row.operationName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="用户">
        <el-tag effect="light" type="warning">{{ drawerProps.row.createUsername }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="类型">
        <el-tag v-if="drawerProps.row.type === 1" type="success">新增</el-tag>
        <el-tag v-else-if="drawerProps.row.type === 2" type="warning">修改</el-tag>
        <el-tag v-else-if="drawerProps.row.type === 3" type="danger">删除</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="请求类型">
        <el-tag type="warning">{{ drawerProps.row.requestType }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="请求结果">
        <el-tag v-if="drawerProps.row.isSuccess" type="success">成功</el-tag>
        <el-tag v-else type="danger">失败</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="请求IP">{{ drawerProps.row.ip }}</el-descriptions-item>
      <el-descriptions-item label="请求URI">{{ drawerProps.row.requestUri }}</el-descriptions-item>
      <el-descriptions-item label="请求类名">{{ drawerProps.row.methodName }}</el-descriptions-item>
      <el-descriptions-item label="请求时间">{{ drawerProps.row.createTime }}</el-descriptions-item>
      <el-descriptions-item label="请求参数">
        <JsonViewer
          :style="{
            mainHeight: 100,
            overflow: 'auto'
          }"
          :copyable="{
            copyText: '复制',
            copiedText: '已复制'
          }"
          :boxed="false"
          :sort="true"
          :expanded="true"
          :show-array-index="false"
          :show-double-quotes="true"
          expand-depth="1"
          :value="JSON.parse(drawerProps.row.requestJson)"
        ></JsonViewer>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions>
      <el-descriptions-item label="异常信息">
        <JsonViewer
          :style="{
            mainHeight: 100,
            overflow: 'auto'
          }"
          :copyable="{
            copyText: '复制',
            copiedText: '已复制'
          }"
          :boxed="false"
          :sort="true"
          :show-array-index="false"
          :show-double-quotes="true"
          expand-depth="1"
          :value="JSON.parse(drawerProps.row.exceptionMsg)"
        ></JsonViewer>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Drawer">
import { ref } from "vue";
import "vue-json-viewer/style.css";
import JsonViewer from "vue-json-viewer";
import { SysExceptionLog } from "@/api/interface/system/sysExceptionLog";

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<SysExceptionLog.ExceptionLog>;
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
