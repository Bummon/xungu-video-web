<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    width="40%"
    top="10vh"
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
      <el-steps :active="activeStep" simple style="cursor: pointer">
        <el-step title="基本信息" icon="Edit" @click="activeStep = 1"></el-step>
        <el-step title="详情设置" icon="UploadFilled" @click="activeStep = 2" />
        <el-step title="资产信息" icon="Wallet" @click="activeStep = 3" />
      </el-steps>
      <br style="margin-bottom: 5px" />
      <el-space v-show="activeStep === 1" direction="vertical" :fill="true" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="terminalName">
              <el-input
                v-model.trim="drawerProps.row.terminalName"
                placeholder="请填写设备名称"
                clearable
                :rows="1"
                type="text"
                :input-style="{ color: 'var(--el-color-primary)', width: '10vw' }"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="会议室" prop="roomId">
              <el-select
                v-model="drawerProps.row!.roomId"
                class="m-2"
                placeholder="请配置会议室"
                size="default"
                @change="selectRoom"
                style="width: 10vw"
              >
                <el-option v-for="item in meetRoomOptions" :key="item.roomId" :label="item.roomName" :value="item.roomId">
                  {{ item.roomName }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会议室位置">
              {{ areaName }}
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="管理岗位" prop="manageJobId">
              <el-select v-model="drawerProps.row!.manageJobId" style="width: 10vw" placeholder="请选择职责岗位" size="default">
                <el-option v-for="item in jobOptions" :key="item.jobId" :label="item.jobName" :value="item.jobId">
                  {{ item.jobName }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资源类型" prop="resourceTypeId">
              <el-select
                v-model="drawerProps.row!.resourceTypeId"
                style="width: 10vw"
                placeholder="请选择资源类型"
                size="default"
              >
                <el-option v-for="item in resourceTypeOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId">
                  {{ item.typeName }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="modelList">
              <el-cascader v-model="drawerProps.row.modelList" :options="modelListOptions" :props="props" style="width: 10vw" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--        会议录播主机   -->
        <el-row v-if="drawerProps.row.resourceTypeId === SourceTypeEnum.RecordingHost">
          <!--          录播系统-->
          <el-col :span="18">
            <el-form-item label="IP地址" prop="ip">
              <el-input v-model="drawerProps.row.ip"></el-input>
            </el-form-item>
            <el-form-item label="RTSP播放流" prop="rtsp">
              <el-col>
                <el-input v-model.trim="rtspList[0]">
                  <template #prepend><span style="width: 2.2vw; text-align: center">第一路</span></template>
                </el-input>
                <el-input v-model.trim="rtspList[1]">
                  <template #prepend><span style="width: 2.2vw; text-align: center">第二路</span></template>
                </el-input>
                <el-input v-model.trim="rtspList[2]">
                  <template #prepend><span style="width: 2.2vw; text-align: center">第三路</span></template>
                </el-input>
                <el-input v-model.trim="rtspList[3]">
                  <template #prepend><span style="width: 2.2vw; text-align: center">第四路</span></template>
                </el-input>
                <el-input v-model.trim="rtspList[4]">
                  <template #prepend><span style="width: 2.2vw; text-align: center">第五路</span></template>
                </el-input>
                <el-input v-model.trim="rtspList[5]">
                  <template #prepend><span style="width: 2.2vw; text-align: center">导播</span></template>
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="drawerProps.row.resourceTypeId === SourceTypeEnum.VideoCamera">
          <!--        摄像机-->
          <el-col :span="18">
            <el-form-item label="播放地址" prop="cameraUrl">
              <el-input v-model.trim="drawerProps.row.cameraUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        视频会议终端   -->
        <el-row v-if="drawerProps.row.resourceTypeId === SourceTypeEnum.VideoTerminal">
          <el-col :span="18">
            <el-form-item label="IP地址" prop="ip">
              <el-input v-model.trim="drawerProps.row.ip"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="账号" prop="account">
              <el-input v-model.trim="drawerProps.row.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model.trim="drawerProps.row.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--       矩阵 -->
        <el-row v-if="drawerProps.row.resourceTypeId === SourceTypeEnum.Matrix">
          <el-col :span="18">
            <el-form-item label="矩阵规格" prop="matrixSpecification">
              <el-select v-model.trim="drawerProps.row.matrixSpecification">
                <el-option label="9x9" :value="9" key="1"></el-option>
                <el-option label="18x18" :value="18" key="1"></el-option>
                <el-option label="36x36" :value="36" key="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--       音频处理器   -->
        <el-row v-if="drawerProps.row.resourceTypeId === SourceTypeEnum.AudioControl">
          <el-col :span="18">
            <el-form-item label="通道规格" prop="matrixSpecification">
              <el-select v-model.trim="drawerProps.row.matrixSpecification">
                <el-option label="8x8" :value="8" key="1"></el-option>
                <el-option label="16x16" :value="16" key="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        电源时序器   -->
        <el-row v-if="drawerProps.row.resourceTypeId === SourceTypeEnum.Power">
          <!--          录播系统-->
          <el-col :span="18">
            <el-form-item label="关联设备" prop="controlTerminalSwitchBo">
              <el-row v-for="item in controlTerminalSwitchBo" :key="item.number" style="margin: 5px auto">
                <el-form-item :label="`CH${item.number}`">
                  <el-select v-model="item.terminalIdBind" @change="powerSelectChange">
                    <el-option
                      v-for="option in roomTerminalOptions"
                      :key="option.terminalId"
                      :value="option.terminalId"
                      :label="option.terminalName"
                      :disabled="option.isUsed"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-space>
      <el-space v-show="activeStep === 2">
        <div class="">
          <el-form-item label="设备图片" prop="imageUrl">
            <UploadImg v-model:image-url="drawerProps.row!.imageUrl" width="135px" height="135px" :file-size="10" :api="upload">
              <template #empty>
                <el-icon>
                  <Picture />
                </el-icon>
                <span>请上传图片</span>
              </template>
              <template #tip> 图片大小不能超过 5M</template>
            </UploadImg>
          </el-form-item>
          <el-form-item label="附件" prop="files">
            <el-upload
              action="#"
              class="upload"
              :drag="true"
              :multiple="true"
              :limit="10"
              :show-file-list="true"
              :file-list="fileList"
              :http-request="uploadAttachment"
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
        </div>
      </el-space>

      <div v-show="activeStep === 3" style="width: 100%; padding: 0 10px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="质保期" prop="sellByDates" class="form_item">
              <el-input-number v-model="drawerProps.row.sellByDate" :min="1" controls-position="right"></el-input-number>
              <span style="margin-left: 1em; font-size: 16px; font-weight: bold; color: #7b7777">个月</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="资产标签" prop="labels" class="form_item">
              <div class="sliverCard">
                <p v-show="drawerProps.row.terminalLabel?.length">
                  <span class="text">{{ drawerProps.row.terminalLabel || "" }}</span>
                  <span class="pointer"></span>
                </p>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="" style="padding: 10px 0">
              <el-form-item label="生成标签" prop="tagDates" class="form_item">
                <el-input v-model.trim="prefixTag" placeholder="请输入前缀">
                  <template #append>
                    <el-button @click="generateTag" :disabled="prefixTag === ''">生成新资产标签</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName" class="form_item">
              <el-input v-model="drawerProps.row.supplierName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="telephone" class="form_item">
              <el-input v-model="drawerProps.row.telephone" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格" prop="price" class="form_item">
              <el-input v-model="drawerProps.row.price" type="text">
                <template #append>
                  <span>元</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="描述" prop="terminalDescr" class="form_item">
              <el-input v-model="drawerProps.row.terminalDescr" type="textarea" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="设备启用" prop="terminalStatus" class="form_item">
              <el-radio-group v-model="drawerProps.row.terminalStatus" class="ml-4">
                <el-radio-button :label="0" size="large">停用</el-radio-button>
                <el-radio-button :label="1" size="large">启用</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-if="activeStep !== 1" @click="activeStep--" type="primary">上一步</el-button>
      <el-button v-if="activeStep !== 3" @click="activeStep++" type="primary">下一步</el-button>
      <el-button v-if="activeStep === 3" type="primary" v-show="!drawerProps.isView" @click="handleSubmit(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="terminalDrawer">
import { ref, reactive, Ref, computed } from "vue";
import { ElMessage, FormInstance, ElNotification, UploadRequestOptions } from "element-plus";
import { MeetSourceType, SourceTypeEnum } from "@/api/interface/source";
import { TerminalHandle } from "@/views/source/terminal/index";

import UploadImg from "@/components/Upload/Img.vue";
import { fileRemoveByUrl, upload } from "@/api/modules/upload";
import { sysJob } from "@/api/interface/system1/sysJob";
import { sysApp } from "@/api/modules/control/meetRoom";
import { DataType } from "@/api/modules/data";
import { TerminalHttp } from "@/api/modules/source/terminal";

const props = {
  expandTrigger: "hover" as const
};
const activeStep = ref<1 | 2 | 3>(1);
const resourceTypeOptions = ref<MeetSourceType.resourceType[] | []>([]);
const meetRoomOptions = ref<sysApp.meeting[] | []>([]);
const jobOptions = ref<sysJob.job[] | []>([]);
const modelListOptions = ref<DataType.Cascade[] | []>([]);
const rtspList = ref(["", "", "", "", "", " "]);

//文件上传
let fileList = ref<any[]>([]);

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<MeetSourceType.terminal>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  tableData: [];
}

const prefixTag = ref<string>("");

const drawerVisible = ref(false);
const drawerProps: Ref<DrawerProps> = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  tableData: []
});
// 动态调整矩阵规格是否为必选
const matrixFlag = computed(() => {
  if (
    drawerProps.value.row.resourceTypeId === SourceTypeEnum.Matrix ||
    drawerProps.value.row.resourceTypeId === SourceTypeEnum.AudioControl
  ) {
    return true;
  } else {
    return false;
  }
});
const rules = reactive({
  terminalName: [{ required: true, message: "请填写设备名称" }],
  resourceTypeId: [{ required: true, message: "请选择资源类型" }],
  modelList: [{ required: true, message: "请选择设备型号" }],
  roomId: [{ required: true, message: "请配置到会议室" }],
  manageJobId: [{ required: true, message: "请选择管理人员" }],
  terminalStatus: [{ required: true, message: "请选择启用停用状态" }],
  matrixSpecification: [{ required: matrixFlag, message: "请选择规格" }]
});
//  选择出来的电源 接口数据 存储到这里  最终上传前赋值给数据
const controlTerminalSwitchBo = ref([]);
// 选中会议室后  会议室内的设备列表
const roomTerminalOptions = ref([]);

async function disposeRoomTerminalOptions(roomId) {
  roomTerminalOptions.value = (await TerminalHttp.getTerminal({ roomId: roomId })).data;
  roomTerminalOptions.value.forEach(item => {
    item.isUsed = false;
  });
  roomTerminalOptions.value.push({
    terminalId: null,
    terminalName: "无",
    isUsed: false
  });
  meetRoomOptions.value.forEach(item => {
    if (item.roomId === roomId) {
      areaName.value = item.areaName;
      console.log(item.areaName);
    }
  });
}

// 重置电源绑定列表数据
function resetPowerBind() {
  controlTerminalSwitchBo.value = [
    {
      number: 1,
      terminalIdBind: null
    },
    {
      number: 2,
      terminalIdBind: null
    },
    {
      number: 3,
      terminalIdBind: null
    },
    {
      number: 4,
      terminalIdBind: null
    },
    {
      number: 5,
      terminalIdBind: null
    },
    {
      number: 6,
      terminalIdBind: null
    },
    {
      number: 7,
      terminalIdBind: null
    },
    {
      number: 8,
      terminalIdBind: null
    }
  ];
}

// 当给某个电源绑定选项赋值之后
function powerSelectChange() {
  roomTerminalOptions.value.forEach(item => {
    // 先把所有选项都改成可用
    item.isUsed = false;
    controlTerminalSwitchBo.value.forEach(result => {
      // 找到已经进到选中表的数据 改成isUsed
      if (result.terminalIdBind === item.terminalId && item.terminalId) {
        item.isUsed = true;
      }
    });
  });
}

const areaName = ref("");

async function selectRoom(val) {
  console.log("选择了会议室", val);
  await disposeRoomTerminalOptions(val); // 拿到这个会议室下的 设备列表

  resetPowerBind(); // 重置电源的绑定数据
}

/**
 * 上传的方法
 * @param param
 */
async function uploadAttachment(param: UploadRequestOptions) {
  let excelFormData = new FormData();
  excelFormData.append("file", param.file);
  try {
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
      ElNotification({
        title: "温馨提示",
        dangerouslyUseHTMLString: true,
        message: `上传成功`,
        duration: 10000,
        type: "success"
      });
    }
  } catch (e) {
    console.log("上传失败", e);
    ElNotification({
      title: "温馨提示",
      dangerouslyUseHTMLString: true,
      message: `上传失败,请稍后尝试`,
      duration: 10000,
      type: "error"
    });
  }
}

/**
 * 删除附件
 * @param file
 */
const handleRemove = async (file: UploadRequestOptions) => {
  console.log(file);
  console.log(drawerProps.value.row.files);
  ElMessage.success({ message: `删除成功！` });
  // fileRemoveByUrl({ url: file.url }).then(res => {
  //   console.log(res);
  // });
};
/**
 * 暴露给父组件的方法
 * @param params
 */
const acceptParams = async (params: DrawerProps) => {
  // 1. 初始化数据
  await init();
  // 2. 步骤数归零
  activeStep.value = 1;
  fileList.value = [];
  drawerProps.value = params;
  // 3. 特殊数据处理
  if (params.title === "新增") {
    drawerProps.value.row.files = [];
    drawerProps.value.row.terminalStatus = 1; // 新增设备默认为启用
    areaName.value = "待选择会议室";
    resetPowerBind(); // 充值电源绑定数据为初始值
  } else {
    meetRoomOptions.value.forEach(item => {
      if (item.roomId === drawerProps.value.row.roomId) {
        areaName.value = item.areaName;
      }
    });
    // 如果是录播主机
    if (drawerProps.value.row.resourceTypeId === SourceTypeEnum.RecordingHost) {
      if (params.row.rtsp) {
        rtspList.value = JSON.parse(params.row.rtsp);
      } else {
        rtspList.value = ["", "", "", "", "", ""];
      }
    }
    // 如果是时序电源
    if (drawerProps.value.row.resourceTypeId === SourceTypeEnum.Power) {
      // 把自带的数据 赋值过来
      // 先拿一次初始会议室的设备列表
      resetPowerBind(); // 先把电源列表弄成空值
      // 拿到会议室的设备列表 处理会议室相关数据 比如位置
      await disposeRoomTerminalOptions(drawerProps.value.row.roomId);
      if (drawerProps.value.row.controlTerminalSwitchBo?.constructor === Array) {
        console.log("电源有初始值");
        drawerProps.value.row.controlTerminalSwitchBo.forEach(item => {
          controlTerminalSwitchBo.value.forEach(result => {
            if (item.number === result.number) {
              result.terminalIdBind = item.terminalIdBind;
            }
          });
        });
      }
      powerSelectChange();
    }

    // 展开附件列表
    if (drawerProps.value.row.files && drawerProps.value.row.files?.length > 0) {
      drawerProps.value.row.files.forEach(file => {
        fileList.value.push({ name: file.fileName, url: file.fileUrl });
      });
    }
  }

  drawerVisible.value = true;
};

// 生成资产标签
function generateTag() {
  const timestamp = Date.parse(new Date());
  drawerProps.value.row.terminalLabel = prefixTag.value + "-" + timestamp;
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);
const handleSubmit = (ruleFormRef: FormInstance | undefined) => {
  ruleFormRef.validate(async valid => {
    if (!valid) {
      activeStep.value = 1;
      return;
    }
    if (loading.value) return;
    try {
      loading.value = true;
      // 如果是录播主机
      if (drawerProps.value.row.resourceTypeId === SourceTypeEnum.RecordingHost) {
        drawerProps.value.row.rtsp = JSON.stringify(rtspList.value);
      }
      // 如果是时序电源
      if (drawerProps.value.row.resourceTypeId === SourceTypeEnum.Power) {
        drawerProps.value.row.controlTerminalSwitchBo = controlTerminalSwitchBo.value;
      }
      drawerProps.value.row.brandId = drawerProps.value.row.modelList[0];
      console.log("modelList", drawerProps.value.row.modelList);
      drawerProps.value.row.modelId = drawerProps.value.row.modelList.slice(-1)[0];
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success(`${drawerProps.value.title}成功！`);
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  });
};

async function init() {
  resourceTypeOptions.value = await TerminalHandle.getResourceType();
  meetRoomOptions.value = await TerminalHandle.getMeetRoomList();
  jobOptions.value = await TerminalHandle.getJobList();
  modelListOptions.value = await TerminalHandle.getModelList();
}

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
.form_item {
  padding: 5px 0;
}
.sliverCard {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  background-color: rgb(178 173 173 / 27%);
  p {
    position: relative;
    height: 30px;
    padding: 0 30px;
    margin: 0;
    background: linear-gradient(45deg, #ffa200, #47ca4a, #455fe6);
    border-radius: 25px;
    box-shadow: 2px 2px 2px rgb(0 0 0 / 65%);
    .text {
      font-size: 16px;
      line-height: 100%;
      color: #ffffff;
    }
    .pointer {
      position: absolute;
      bottom: 10px;
      left: 15px;
      width: 10px;
      height: 10px;
      background-color: #ffffff;
      border-radius: 5px;
    }
  }
}
</style>
