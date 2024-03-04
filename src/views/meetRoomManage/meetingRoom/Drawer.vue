<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="true"
    width="40%"
    height="80%"
    draggable
    :modal="false"
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
      style="height: 60vh; overflow-y: scroll"
    >
      <el-row>
        <el-col :span="10">
          <el-form-item label="会议室名称" prop="roomName">
            <el-input v-model="drawerProps.row.roomName" placeholder="请填写会议室名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="IP地址" prop="ip">
            <el-input v-model.trim="drawerProps.row.ip" placeholder="请输入中控IP"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="会议室类型" prop="roomTypeId">
            <el-select v-model="drawerProps.row.roomTypeId" placeholder="请选择会议室类型" style="width: 100%" value-key="label">
              <el-option v-for="item in roomOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="容纳人数" prop="capacity">
            <el-input-number style="width: 100%" :min="0" v-model="drawerProps.row.capacity" clearable></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="区域名称" prop="areaList">
            <el-cascader
              v-model="drawerProps.row.areaList"
              :options="areaOptions"
              :props="cascaderProps"
              placeholder="请选择所在区域"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="房间号" prop="location">
            <el-input v-model="drawerProps.row.location" placeholder="请填写房间号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="图片" prop="imageUrl">
            <UploadImg v-model:image-url="drawerProps.row.imageUrl" width="135px" height="135px" :file-size="10">
              <template #empty>
                <el-icon>
                  <Picture />
                </el-icon>
                <span>请上传图片</span>
              </template>
              <template #tip> 图片大小不能超过 10M</template>
            </UploadImg>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="附件" prop="context">
            <el-upload
              style="width: 80%"
              action="#"
              class="upload"
              :drag="true"
              :multiple="true"
              :limit="10"
              :show-file-list="true"
              :file-list="fileList"
              :http-request="uploadExcel"
              :on-remove="handleRemove"
            >
              <slot name="empty">
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </slot>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-col :span="24">
          <el-form-item label="是否启用" prop="roomStatus">
            <el-radio-group v-model="drawerProps.row.roomStatus" class="ml-4">
              <el-radio-button :label="0" size="large">停用</el-radio-button>
              <el-radio-button :label="1" size="large">启用</el-radio-button>
            </el-radio-group>
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

<script setup lang="ts" name="AppDrawer">
import { ref, reactive } from "vue";
import { ElMessage, ElNotification, FormInstance, UploadRequestOptions } from "element-plus";
import { upload, fileRemove } from "@/api/modules/upload";
import UploadImg from "@/components/Upload/roomImg.vue";
import { MeetingRoomHandle } from "@/views/meetRoomManage/meetingRoom/index";
import { DataType } from "@/api/modules/data";
import { CentralType } from "@/api/interface/control/central";
import { RoomType } from "@/api/interface/control/MeetRoom";
import { MeetRoomTypeHttp } from "@/api/modules/control/meetRoomType";
import { RoomTypeType } from "@/api/interface/control/MeetRoomType";

const rules = reactive({
  roomName: [{ required: true, message: "请填写会议室名称" }],
  areaList: [{ required: true, message: "请选择区域" }],
  capacity: [{ required: true, message: "请填写容纳人数" }],
  roomStatus: [{ required: true, message: "请选择启用停用状态" }],
  roomTypeId: [{ required: true, message: "请选择会议室类型" }],
  location: [
    { required: true, message: "请填写房间号" },
    { min: 1, max: 8, message: "房间号在1到8个字之间", trigger: "blur" }
  ],
  ip: [{ required: true, message: "请输入会议室IP" }]
});

const Props = defineProps({
  updatePage: {
    type: Function,
    default: () => {
      console.log("默认方法");
    }
  }
});
// 区域连选择下拉框所有的值
let areaOptions = ref<DataType.Cascade[] | []>([]);
// 级联选择的格式化
const cascaderProps = {
  expandTrigger: "hover" as const,
  multiple: false
};

/* 下拉框所有的值 */
let controlOptions = ref<CentralType.central[]>([]);
/**
 * 房间类型的可选项列表
 */
const roomOptions = ref<RoomTypeType.RoomType[]>([]);

const drawerVisible = ref(false);
const drawerProps = ref<RoomType.DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
//文件上传
let fileList = ref<any>([]);
const uploadExcel = async (param: UploadRequestOptions) => {
  let excelFormData = new FormData();
  excelFormData.append("file", param.file);
  const res = await upload(excelFormData);
  if (res.code === 200) {
    fileList.value.push(res.data);
    if (!drawerProps.value.row.files) {
      drawerProps.value.row.files = [];
    }
    drawerProps.value.row.files.push({
      fileExt: res.data.fileType,
      fileName: res.data.fileName,
      fileSize: res.data.fileSize,
      fileUrl: res.data.fileUrl
    });
    excelUploadSuccess();
  }
};
const handleRemove = async (file: UploadRequestOptions) => {
  console.log(file);
  ElMessage.success({ message: `删除成功！` });
};
// 上传成功提示
const excelUploadSuccess = () => {
  ElNotification({
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    message: `上传成功`,
    duration: 10000,
    type: "success"
  });
};
// 接收父组件传过来的参数
const acceptParams = async (params: RoomType.DrawerProps) => {
  // 获取会议室类型列表
  roomOptions.value = (await MeetRoomTypeHttp.getList()).data;
  // 获取区域选项的数据
  areaOptions.value = await MeetingRoomHandle.getAreaCascaderList();

  drawerProps.value = params;

  // 清洗区域的数据
  if (drawerProps.value.row.areaId && drawerProps.value.row.areaIdFirst) {
    //  自身绑定有区域数据的
    drawerProps.value.row.areaList = [drawerProps.value.row.areaIdFirst, drawerProps.value.row.areaId];
  } else {
    // 自身没有绑定  或 新增
    drawerProps.value.row.areaList = [];
  }
  // 文件数据
  fileList.value = [];
  if (drawerProps.value.title != "新增") {
    // 如果是编辑
    if (drawerProps.value.row.files && drawerProps.value.row.files?.length > 0) {
      drawerProps.value.row.files.forEach(file => {
        fileList.value.push({ name: file.fileName, url: file.fileUrl });
      });
    }
  } else {
    // 这是新增的处理罗辑
    drawerProps.value.row.files = [];
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
    try {
      loading.value = true;
      console.log(drawerProps.value.row);
      drawerProps.value.row.parentId = drawerProps.value.row.areaList[0] || null;
      drawerProps.value.row.areaId = drawerProps.value.row.areaList[1] || null;
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}会议室成功！` });
      Props.updatePage();
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
