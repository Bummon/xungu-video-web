<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" width="40%" :title="`${drawerProps.title}设备`">
    <div class="table-box">
      <el-transfer style="text-align: center" v-model="value" :data="data" :titles="['未选设备', '已选设备']"></el-transfer>
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
    <Drawer ref="drawerRef" />
  </el-dialog>
</template>

<script setup lang="ts" name="RangeManage">
import { ref } from "vue";
import Drawer from "./Drawer.vue";
import { BaseTerminal } from "@/api/interface/player/baseTerminal";
import { getList } from "@/api/modules/player/terminal";
import { ElMessage } from "element-plus";
import { getSelectList } from "@/api/modules/system1/versionRange";

const drawerVisible = ref(false);
const algData = ref<BaseTerminal.Option[]>();
const data = ref([]);
const value = ref([]);

getList().then(res => {
  algData.value = res as BaseTerminal.Option[];
  data.value = [];
  algData.value.forEach(i => {
    data.value.push({
      label: i.terminalName,
      key: i.terminalId
    });
  });
});

interface DrawerProps {
  title: string;
  ids: string[];
  versionId: number;
  api?: (params: any) => Promise<any>;
}

const drawerProps = ref<DrawerProps>({
  title: "",
  ids: [],
  versionId: 0
});

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  const res = await getSelectList({ versionId: params.versionId });
  value.value = [];
  algData.value?.forEach(item => {
    res.forEach(it => {
      if (it.rangeId == item.terminalId) {
        value.value.push(item.terminalId);
      }
    });
  });
};
const loading = ref(false);
// 提交数据（）
const handleSubmit = async () => {
  if (loading.value) return;
  try {
    loading.value = true;
    const ids = value?.value.toString();
    await drawerProps.value.api!({ rangeId: ids, versionId: drawerProps.value.versionId });
    ElMessage.success({ message: `绑定设备成功！` });
    drawerVisible.value = false;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

defineExpose({
  acceptParams
});
</script>
