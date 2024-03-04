<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="true"
    width="500"
    draggable
    :modal="false"
  >
    <template #header>
      <span style="vertical-align: middle">
        <el-icon :size="20" class="no-inherit">
          <Connection />
        </el-icon>
      </span>
      <span style="font-size: 16px"> 场景控制</span>
    </template>
    <el-form ref="formRef" label-width="100px" label-suffix=" :" :rules="rules" :model="drawerProps.row">
      <el-row>
        <el-col :span="24">
          <el-form-item label="会议室" prop="roomName">
            <span>{{ drawerProps.roomName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="场景名称" prop="scenarioName">
            <el-input v-model.trim="drawerProps.row.scenarioName" placeholder="请填写场景名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="命令编号" prop="commandNumber">
            <el-input v-model.number="drawerProps.row.commandNumber" placeholder="请填写绑定命令编号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="场景说明" prop="terminalDescr">
            <el-input v-model.trim="drawerProps.row.terminalDescr" :rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">关闭</el-button>
      <el-button @click="submitForm(formRef)" type="primary">提交</el-button>
    </template>

    <!--  计划列表  -->
  </el-dialog>
</template>

<script setup lang="ts" name="AppDrawer">
import { ref, reactive } from "vue";
import { ElMessage, ElNotification, FormInstance } from "element-plus";
import { SceneType } from "@/api/interface/control/scene";
import { SceneHttp } from "@/api/modules/control/scene";

const rules = reactive({
  scenarioName: [
    { required: true, message: "请填写场景名称" },
    { min: 2, max: 12, message: "房间号在1到12个字之间", trigger: "blur" }
  ],
  commandNumber: [
    { required: true, message: "请填写命令编号" },
    { type: "number", message: "命令编号应为数字", trigger: "blur" }
  ]
});
const drawerVisible = ref(false);

// 接收父组件的参数的类型
export interface iDrawerProp {
  title: string;
  roomId: number;
  roomName: string;
  row: SceneType.Scene;
  update: Function;
}

const formRef = ref<FormInstance>();
const drawerProps = ref<iDrawerProp>();

// 接收父组件传过来的参数
const acceptParams = async (params: iDrawerProp) => {
  drawerProps.value = params;
  console.log(params);
  // 获取场景列表
  drawerVisible.value = true;
};

function submitForm(formRef: FormInstance | undefined) {
  if (!formRef) return;
  formRef.validate(async valid => {
    if (!valid) return;
    try {
      drawerProps.value.row.roomId = drawerProps.value.roomId;
      if (drawerProps.value.title === "新增") {
        await SceneHttp.addSceneRow(drawerProps.value.row);
      } else {
        await SceneHttp.updateSceneRow(drawerProps.value.row);
      }
      await drawerProps.value.update(); // 更新父组件的值
      ElNotification.success({ message: "添加场景成功" });
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
}

defineExpose({
  acceptParams
});
</script>
