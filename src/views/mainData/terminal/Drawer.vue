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
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="终端名称" prop="terminalName">
            <el-input v-model="drawerProps.row!.terminalName" placeholder="请填写终端名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="类型" prop="typeId">
            <el-select v-model="drawerProps.row!.typeId" placeholder="请选择类型" style="width: 100%">
              <el-option v-for="item in typeOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属分组" prop="groupId">
            <el-select v-model="drawerProps.row!.groupId" placeholder="请选择分组" style="width: 100%">
              <el-option v-for="item in groupOptions" :key="item.groupId" :label="item.groupName" :value="item.groupId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="场所" prop="roomId">
            <el-select v-model="drawerProps.row!.roomId" placeholder="请选择场所" style="width: 100%">
              <el-option v-for="item in roomOptions" :key="item.roomId" :label="item.roomName" :value="item.roomId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="显示顺序" prop="terminalSort">
            <el-input-number
              style="width: 100%"
              :min="0"
              v-model="drawerProps.row!.terminalSort"
              placeholder="请填写顺序"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="terminalDescr">
            <el-input
              type="textarea"
              :rows="3"
              v-model="drawerProps.row!.terminalDescr"
              placeholder="请填写备注"
              clearable
            ></el-input>
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

<script setup lang="ts" name="TerminalDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { BaseTerminal } from "@/api/interface/player/baseTerminal";
import { BaseTerminalType } from "@/api/interface/player/baseTerminalType";
import { getTypeList } from "@/api/modules/player/terminalType";
import { BaseTerminalGroup } from "@/api/interface/player/baseTerminalGroup";
import { getGroupList } from "@/api/modules/player/group";
import { getRoomList } from "@/api/modules/player/room";
import { BaseRoom } from "@/api/interface/player/baseRoom";

const rules = reactive({
  terminalName: [{ required: true, message: "请填写终端名称" }],
  typeId: [{ required: true, message: "请选择类型" }],
  groupId: [{ required: true, message: "请选择分组" }],
  roomId: [{ required: true, message: "请选择场所" }],
  terminalSort: [{ required: true, message: "请填写顺序" }]
});

let typeOptions = ref<BaseTerminalType.Option[]>([]);
getTypeList().then(res => {
  typeOptions.value = res as BaseTerminalType.Option[];
});

let groupOptions = ref<BaseTerminalGroup.Option[]>([]);
getGroupList().then(res => {
  groupOptions.value = res as BaseTerminalGroup.Option[];
});

let roomOptions = ref<BaseRoom.Option[]>([]);
getRoomList().then(res => {
  roomOptions.value = res as BaseRoom.Option[];
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<BaseTerminal.Terminal>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    if (loading.value) return;
    try {
      loading.value = true;
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}终端成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  });
};
defineExpose({
  acceptParams
});
</script>
