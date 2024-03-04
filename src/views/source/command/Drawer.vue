<template>
  <div id="command-dialog">
    <el-dialog
      v-model="drawerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :show-close="false"
      width="40%"
      draggable
    >
      <template #header>
        <span style="vertical-align: middle">
          <el-icon :size="22" class="no-inherit">
            <Edit />
          </el-icon>
        </span>
        <span style="padding-left: 5px; vertical-align: middle"> {{ drawerProps.title }}命令 </span>
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
            <el-form-item label="名称" prop="commandName">
              <el-input v-model="drawerProps.row.commandName" placeholder="请填写命令名称" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="命令格式" prop="commandFormat">
              <el-select v-model="drawerProps.row.commandFormat" :default-first-option="true">
                <el-option label="字符串" value="字符串" />
                <el-option label="十六进制" value="十六进制" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="设备型号" prop="modelList">
            <el-cascader v-model="drawerProps.row.modelList" :options="modelListOptions" :props="cascaderProps" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="协议内容" prop="commandContext">
              <el-input
                v-model="drawerProps.row.commandContext"
                placeholder="请填写协议内容"
                class="input-with-select"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="命令编号" prop="commandCode">
              <el-input v-model="drawerProps.row.commandCode" placeholder="" class="input-with-select"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <p style="width: 100%; font-size: 0.8vw; text-align: center">注意事项：</p>
        <el-row style="height: 30vh; overflow-y: scroll; background-color: #dedede">
          <el-form-item :label="item.name" v-for="item in remark.data" :key="item.id">
            <div style="display: flex; width: 100%" v-for="(ctx, i) in item.command" :key="i">
              <p style="width: 7em; color: var(--el-color-primary)">{{ ctx.fn }}：</p>
              命令名称应包含《
              <p style="padding: 0 5px; color: var(--el-color-primary)">{{ ctx.content }}</p>
              》
            </div>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Drawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { MeetSourceType } from "@/api/interface/source";
import { CommandHandle } from "@/views/source/command/index";
// 级联选择的格式化
const cascaderProps = {
  expandTrigger: "hover" as const,
  multiple: true
};
const rules = reactive({
  commandName: [{ required: true, message: "请填写命令名称" }],
  commandFormat: [{ required: true, message: "请选择命令格式" }],
  modelList: [{ required: true, message: "请选择需要安装到的型号" }]
});
const modelListOptions = ref([]);
const select = ref();
import remark from "./remark.json";

console.log(remark.data);

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<MeetSourceType.command>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
}

const props = defineProps({
  updateTable: {
    type: Function,
    default: () => {
      console.log("对外调用父组件更新列表的方法");
    }
  }
});

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  tableData: []
});

async function init() {
  modelListOptions.value = await CommandHandle.getModelList();
}

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  init();
  console.log(params);
  if (params.title == "新增") {
    drawerProps.value = params;
  } else {
    drawerProps.value = params;
  }
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    if (loading.value) return;
    drawerProps.value.row.modelIds = []; //置空 再填数据
    let list = drawerProps.value.row.modelList;
    list.forEach(item => {
      drawerProps.value.row.modelIds.push(item[1]);
    });
    console.log(drawerProps.value.row);
    try {
      // 提交
      loading.value = true;
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      // 关页面  刷新父组件列表
      props.updateTable();
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
