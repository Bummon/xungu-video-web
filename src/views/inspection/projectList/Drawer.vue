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
        <el-icon :size="22" class="no-inherit">
          <Edit />
        </el-icon>
      </span>
      <span style="padding-left: 5px; vertical-align: middle"> {{ drawerProps.title }}巡检计划 </span>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row>
        <el-col :span="18">
          <el-form-item label="名称" prop="inspectionName">
            <el-input v-model="drawerProps.row.inspectionName" placeholder="请填写计划名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="巡检范围" prop="roomList">
            <el-cascader
              v-model="drawerProps.row.roomList"
              :options="cascaderOptions"
              :props="cascaderProps"
              placeholder="请选择巡检区域"
              popper-class="custom-popper"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="巡检资源类型" prop="typeIdList">
            <el-checkbox-group v-model="drawerProps.row.typeIdList">
              <el-checkbox :label="item.typeId.toString()" v-for="item in typeIdOptions" :key="item.typeId"
                >{{ item.typeName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="执行方式" prop="executionType">
            <el-radio-group v-model="drawerProps.row.executionType" style="display: flex">
              <el-radio :label="1">立即执行</el-radio>
              <el-radio :label="2">周期执行</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设置周期" prop="scheduleConf" v-show="drawerProps.row.executionType == 2">
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

          <el-form-item v-if="drawerProps.row.executionType === 2" style="display: block"></el-form-item>
          <el-form-item v-else style="display: none">
            <p>立即执行</p>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Drawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { MeetSourceType } from "@/api/interface/source";
import { ResourceTypeHttp } from "@/api/modules/source/resourceType";
import { InspectionHandle } from "@/views/inspection/projectList/index";
import SelectCron from "../component/selectCron.vue";
import { InspectionType } from "@/api/interface/inspection"; // 引入样式
const rules = reactive({
  inspectionName: [
    { required: true, message: "请填写计划名称" },
    { min: 2, max: 12, message: "名称应在2到12个字数以内", trigger: "blur" }
  ],
  inspectionStatus: [{ required: true, message: "请选择是否启用" }],
  typeIdList: [{ required: true, message: "请选择需要巡检的资源" }],
  executionType: [{ required: true, message: "请选择执行方式" }],
  roomList: [{ required: true, message: "请选择巡检范围" }]
});
const cascaderProps = {
  expandTrigger: "hover" as const,
  multiple: true
};

const valueDate = ref(["", ""]);
const changeCron = (val: any) => {
  if (typeof val !== "string") return false;
  drawerProps.value.row.cron = val;
  console.log("修改cron", val);
};

// 时间早于今日 就禁止选用
function disabledDate(time) {
  // 获取今日日期
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 如果时间早于今日，则禁用
  return time.getTime() < today.getTime();
}

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<InspectionType.inspection>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  tableData: []
});
// 可选数据源
let typeIdOptions = ref<MeetSourceType.resourceType[]>([]); // 资源类型选项
const cascaderOptions = ref([]); // 会议室级联树选项
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  // 获取资源类型列表
  typeIdOptions.value = (await ResourceTypeHttp.getResourceTypeList()).data;
  // 获取会议室级联树
  cascaderOptions.value = await InspectionHandle.getRoomTree();

  if (params.title == "新增") {
    drawerProps.value.row.roomList = []; // 巡检范围
    drawerProps.value.row.typeIdList = [];
    drawerProps.value.row.cron = "0 0 1 * * ? *";
  } else {
    valueDate.value = [drawerProps.value.row.startTime, drawerProps.value.row.endTime];
    drawerProps.value.row.roomList = handleRoomList(
      drawerProps.value.row.parentIds,
      drawerProps.value.row.areaIds,
      drawerProps.value.row.roomIds
    ); // 巡检范围
    drawerProps.value.row.typeIdList = (drawerProps.value.row.typeIds && drawerProps.value.row.typeIds.split(",")) || [];
  }

  drawerVisible.value = true;
};

// 转二维数组
function handleRoomList(parentIds: string, areaIds: string, roomIds: string) {
  let list: number[][] = [];
  if (parentIds && areaIds && roomIds) {
    try {
      let parentList = parentIds.split(",");
      let areaList = areaIds.split(",");
      let roomList = roomIds.split(",");
      parentList.forEach((item, index) => {
        list.push([Number(item), Number(areaList[index]), Number(roomList[index])]);
      });
    } catch (e) {
      list = [];
    }
  }
  console.log(list);
  return list;
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
let flag = ref(false);
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    if (flag.value) return;
    try {
      flag.value = true;
      if (drawerProps.value.row.executionType === 2) {
        drawerProps.value.row.startTime = valueDate.value[0];
        drawerProps.value.row.endTime = valueDate.value[1];
      }
      let list = [];
      drawerProps.value.row.roomList.forEach(item => {
        if (item?.length > 0) {
          list.push(item[item.length - 1]);
        }
      });
      drawerProps.value.row.roomIds = list; // 选择的房间列表
      drawerProps.value.row.typeIds = drawerProps.value.row.typeIdList.join(",");
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功，启用该计划后才可正式生效！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      flag.value = false;
    }
  });
};

defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss">
:deep(.el-input__wrapper) {
  width: 15vw;
}
.custom-popper {
  width: 300px; /* 修改宽度为需要的值，确保文字完整显示 */
}
</style>
