<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="true"
    width="40vw"
    height="80vh"
    top="5vh"
    :modal="false"
    draggable
  >
    <template #header>
      <span style="vertical-align: middle">
        <el-icon :size="20" class="no-inherit">
          <Connection />
        </el-icon>
      </span>
      <span style="font-size: 16px"> 场景控制</span>
    </template>
    <el-form
      ref="formRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
      :disabled="drawerProps.isView"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="会议室" prop="roomName">
            <span>{{ drawerProps.roomName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划名称" prop="planName">
            <el-input v-model.trim="drawerProps.row.planName" placeholder="请填写计划名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="场景名称" prop="scenarioId">
            <el-select v-model="drawerProps.row.scenarioId">
              <el-option
                v-for="item in sceneOptions"
                :key="item.scenarioId"
                :label="item.scenarioName"
                :value="item.scenarioId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="重复" prop="executionType">
            <el-radio-group v-model="drawerProps.row.executionType" style="display: flex">
              <el-radio :label="1">执行一次</el-radio>
              <el-radio :label="2">周期执行</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="执行时间" prop="startTime" v-show="drawerProps.row.executionType == 1">
            <div class="demo-date-picker">
              <div class="block">
                <el-date-picker
                  v-model="drawerProps.row.startTime"
                  type="datetime"
                  :disabledDate="disabledDate"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  size="default"
                ></el-date-picker>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="设置周期" prop="startTime" v-show="drawerProps.row.executionType == 2">
            <div class="demo-date-picker" style="margin: 1vh 0">
              <div class="block">
                <el-date-picker
                  v-model="valueDate"
                  type="datetimerange"
                  :disabledDate="disabledDate"
                  range-separator="---"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  size="default"
                ></el-date-picker>
              </div>
            </div>
            <SelectCron :cron="drawerProps.row.cron" :change="changeCron"></SelectCron>
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
import { SceneHttp, ScenePlanHttp } from "@/api/modules/control/scene";
import SelectCron from "@/views/inspection/component/selectCron.vue";

// const validateStartTime = (rule, value, callback) => {
//   if (value === "") {
//     callback(new Error("请再次输入密码"));
//     // password 是表单上绑定的字段
//   } else if (value !== formData.value.newPassword) {
//     callback(new Error("两次输入密码不一致!"));
//   } else {
//     callback();
//   }
// };
const rules = reactive({
  planName: [
    { required: true, message: "请填写计划名称" },
    { min: 2, max: 12, message: "名称应在2到12个字之间", trigger: "blur" }
  ],
  scenarioId: [{ required: true, message: "请选择场景" }],
  executionType: [{ required: true, message: "请选择执行方式" }]
  // startTime: [{ required: true, validator: validateStartTime, message: "请选择执行时间" }]
});
const drawerVisible = ref(false);

// 接收父组件的参数的类型
export interface iDrawerProp {
  title: string;
  isView: boolean;
  roomId: number;
  roomName: string;
  row: SceneType.ScenePlan;
  update: Function;
}

const formRef = ref<FormInstance>();
const drawerProps = ref<iDrawerProp>();

// 场景的选项表
const sceneOptions = ref();

const valueDate = ref(["", ""]);
const changeCron = (val: any) => {
  if (typeof val !== "string") return false;
  drawerProps.value.row.cron = val;
  console.log("修改cron", val);
};

// 时间早于今日 就禁止选用
function disabledDate(time) {
  // 获取今日日期
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);
  // // 如果时间早于今日，则禁用
  // return time.getTime() < today.getTime();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return time.getTime() < now.getTime();
}

// 接收父组件传过来的参数  入口
const acceptParams = async (params: iDrawerProp) => {
  drawerProps.value = params;
  sceneOptions.value = (await SceneHttp.getSceneList({ roomId: drawerProps.value.roomId })).data;
  console.log(params);
  if (params.title == "新增") {
    drawerProps.value.row.cron = "0 0 1 * * ? *";
  } else {
    valueDate.value = [drawerProps.value.row.startTime, drawerProps.value.row.endTime];
  }

  // 获取场景列表
  drawerVisible.value = true;
};

/**
 * 出口  提交表单
 * @param formRef
 */
function submitForm(formRef: FormInstance | undefined) {
  if (!formRef) return;
  formRef.validate(async valid => {
    if (!valid) return;
    try {
      drawerProps.value.row.roomId = drawerProps.value.roomId;
      if (drawerProps.value.row.executionType === 2) {
        // 周期执行
        drawerProps.value.row.startTime = valueDate.value[0];
        drawerProps.value.row.endTime = valueDate.value[1];
      } else if (drawerProps.value.row.executionType === 1) {
        // 立即执行
        drawerProps.value.row.endTime = null;
      }

      if (drawerProps.value.title === "新增") {
        await ScenePlanHttp.addScenePlanRow(drawerProps.value.row);
      } else {
        await ScenePlanHttp.updateScenePlanRow(drawerProps.value.row);
      }
      await drawerProps.value.update(); // 更新父组件的值
      ElNotification.success({ message: "添加计划成功" });
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
