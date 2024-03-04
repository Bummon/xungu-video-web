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
      <span style="padding-left: 5px; vertical-align: middle"> {{ drawerProps.title }}设备型号 </span>
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
          <el-form-item label="型号名称" prop="modelName">
            <el-input v-model="drawerProps.row.modelName" placeholder="请填写型号名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row>-->
      <!--        <el-col :span="24">-->
      <!--          <el-form-item label="状态" prop="modelStatus">-->
      <!--            <el-radio-group v-model="drawerProps.row.modelStatus" class="ml-4">-->
      <!--              <el-radio-button :label="0" size="large">停用</el-radio-button>-->
      <!--              <el-radio-button :label="1" size="large">启用</el-radio-button>-->
      <!--            </el-radio-group>-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属品牌" prop="brandId">
            <el-select v-model="drawerProps.row.brandId" class="m-2" placeholder="请选择品牌" size="large">
              <el-option v-for="item in brandOptions" :key="item.brandId" :label="item.brandName" :value="item.brandId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="控制协议" prop="protocolId">
            <el-select v-model="drawerProps.row.protocolId" class="m-2" placeholder="请选择协议" size="large">
              <el-option
                v-for="item in protocolOptions"
                :key="item.protocolId"
                :label="item.protocolName"
                :value="item.protocolId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="功能" prop="functionIds">
            <el-checkbox-group v-model="drawerProps.row.functionIds">
              <el-checkbox v-for="item in functionOptions" :label="Number(item.functionId)" :key="item.functionId">
                <el-tooltip
                  class="box-item"
                  effect="customized"
                  :content="item.functionDescr"
                  placement="bottom-start"
                  :show-after="300"
                >
                  <span>{{ item.functionName }}</span>
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
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

<script setup lang="ts" name="ModelDrawer">
import { ref, reactive, Ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { MeetSourceType } from "@/api/interface/source";
import { BrandHttp } from "@/api/modules/source/brand";
import { FunctionHttp } from "@/api/modules/source/funciton";
import { ProtocolHttp } from "@/api/modules/source/protocol";

const rules = reactive({
  modelName: [{ required: true, message: "请填写型号名称" }],
  brandId: [{ required: true, message: "请选择品牌" }]
});
// 品牌列表  功能列表 协议列表
const brandOptions: Ref<MeetSourceType.brand[]> = ref([]);
const functionOptions: Ref<MeetSourceType.functionData[]> = ref([]);
const protocolOptions: Ref<MeetSourceType.protocol[]> = ref([]);

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<MeetSourceType.model>;
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

/**
 * 接收父组件传过来的参数
 * @description 这里相当于初始化的阶段 网络请求也写到这里
 */

const acceptParams = async (params: DrawerProps) => {
  if (params.title == "新增") {
    drawerProps.value = params;
  } else {
    drawerProps.value = params;
  }
  // 获取品牌选择
  brandOptions.value = (await BrandHttp.getBrand()).data;
  // 获取协议选择
  protocolOptions.value = (await ProtocolHttp.getProtocol()).data;
  // 获取功能选择
  functionOptions.value = (await FunctionHttp.getFunction({ functionStatus: 1 })).data;
  // 显示窗口
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
      console.log(drawerProps.value.row);
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
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
<style lang="scss" scoped></style>
