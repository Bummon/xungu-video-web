<template>
  <div class="controller">
    <div class="controller-header">
      <div class="header1">
        <p>
          <span style="font-weight: bolder">会议室名称:</span>
          <span style="margin: 0 1vw">{{ roomData?.roomName || "" }}</span>
          <span class="online" v-if="roomData?.runningStatus === 1">(在线)</span>
          <span class="breakdown" v-if="roomData?.runningStatus === 0">(故障)</span>
          <span class="offline" v-if="roomData?.runningStatus === 2">(离线)</span>
        </p>
      </div>
      <div class="quit-box">
        <p class="scene" @click="tabScene">切换场景</p>
        <p class="quit" @click="backPage">退出</p>
      </div>
      <el-row class="header2">
        <el-col :span="4">
          <el-row
            >温度：<span>{{ EnvironmentDetail.temperature }}</span
            >℃
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-row
            >PM2.5：<span>{{ EnvironmentDetail.pm2_5 }}</span></el-row
          >
        </el-col>
        <el-col :span="4">
          <el-row
            >湿度：<span>{{ EnvironmentDetail.humidity }}%</span></el-row
          >
        </el-col>
        <el-col :span="4">
          <el-row
            >PM10：<span>{{ EnvironmentDetail.pm10 }}</span></el-row
          >
        </el-col>
        <el-col :span="4">
          <el-row
            >CO2：<span>{{ EnvironmentDetail.co2 }}</span></el-row
          >
        </el-col>
        <el-col :span="4">
          <!--          <el-row>有机污染：<span>45</span></el-row>-->
        </el-col>
      </el-row>
    </div>
    <div class="controller-main">
      <div class="main-lf">
        <div class="lf-items">
          <div
            class="lf-item"
            @click="activeId = 0"
            v-if="terminalData.RecordingHost.length > 0"
            :class="activeId === 0 ? 'isActive' : ''"
          >
            {{ SourceTypeEnums.RecordingHost.name }}
          </div>
          <div
            class="lf-item"
            @click="activeId = 1"
            v-if="terminalData.AudioControl.length > 0"
            :class="activeId === 1 ? 'isActive' : ''"
          >
            {{ SourceTypeEnums.AudioControl.name }}
          </div>
          <div
            class="lf-item"
            @click="activeId = 2"
            v-if="terminalData.Matrix.length > 0"
            :class="activeId === 2 ? 'isActive' : ''"
          >
            {{ SourceTypeEnums.Matrix.name }}
          </div>
          <div
            class="lf-item"
            @click="activeId = 3"
            v-if="terminalData.Power.length > 0"
            :class="activeId === 3 ? 'isActive' : ''"
          >
            {{ SourceTypeEnums.Power.name }}
          </div>
          <div
            class="lf-item"
            @click="activeId = 4"
            v-if="terminalData.VideoTerminal.length > 0"
            :class="activeId === 4 ? 'isActive' : ''"
          >
            {{ SourceTypeEnums.VideoTerminal.name }}
          </div>
          <div
            class="lf-item"
            @click="activeId = 5"
            v-if="terminalData.VideoCamera.length > 0"
            :class="activeId === 5 ? 'isActive' : ''"
          >
            {{ SourceTypeEnums.VideoCamera.name }}
          </div>
          <div v-for="item in terminalData.Other" :key="item.typeId">
            <div
              class="lf-item"
              @click="selectMenu(item)"
              :class="{ isActive: activeId === item.typeId }"
              v-if="item?.terminalList?.length > 0"
            >
              <!--              v-if="item.terminalList.length > 0"-->
              {{ item.typeName }}
            </div>
          </div>
        </div>
      </div>
      <div class="main-ct">
        <div class="centerControl" v-if="activeId === 0 && terminalData.RecordingHost.length > 0">
          <RecordingHost :data="terminalData.RecordingHost" :ip="roomData.ip"></RecordingHost>
        </div>
        <div class="audioControl" v-if="activeId === 1 && terminalData.AudioControl.length > 0">
          <audioControl :data="terminalData.AudioControl" :ip="roomData.ip"></audioControl>
        </div>
        <div class="matrix" v-if="activeId === 2 && terminalData.Matrix.length > 0">
          <matrix :data="terminalData.Matrix" :ip="roomData.ip"></matrix>
        </div>
        <div class="power" v-if="activeId === 3 && terminalData.Power.length > 0">
          <power :data="terminalData.Power" :ip="roomData.ip"></power>
        </div>
        <div class="videoTerminal" v-if="activeId === 4 && terminalData.VideoTerminal.length > 0">
          <videoTerminal :data="terminalData.VideoTerminal" :ip="roomData.ip"></videoTerminal>
        </div>
        <div class="videoCamera" v-if="activeId === 5 && terminalData.VideoCamera.length > 0">
          <videoCamera :data="terminalData.VideoCamera" :tabEquipment="handleVideoClick" :ip="roomData.ip"></videoCamera>
        </div>
        <div class="" v-for="item in terminalData.Other" :key="item.typeId">
          <div class="other" v-if="activeId === item.typeId">
            <Other :data="item.terminalList" :ip="roomData.ip"></Other>
          </div>
        </div>
      </div>
      <div class="main-rg" v-if="terminalData.VideoCamera && terminalData.VideoCamera.length > 0">
        <div class="videoPlayer">
          <rtspPlayer
            :url="activeCamera?.cameraUrl"
            v-if="activeCamera?.cameraUrl !== null && activeCamera?.cameraUrl?.includes('rtsp')"
          ></rtspPlayer>
          <div class="noSign" v-else>无信号</div>
        </div>
        <div class="selectCamera">
          <div class="" v-for="item in terminalData.VideoCamera" :key="item.terminalId">
            <p :class="{ activeCamera: item.terminalId === activeCamera.terminalId }" @click="handleVideoClick(item)">
              {{ item.terminalName }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <scene-drawer ref="sceneDrawer"></scene-drawer>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref, reactive } from "vue";
import RecordingHost from "./components/recordingHost.vue";
import audioControl from "./components/audioControl.vue";
import videoCamera from "./components/videoCamera.vue";
import matrix from "./components/matrix.vue";
import videoTerminal from "./components/videoTerminal.vue";
import power from "./components/power.vue";
import rtspPlayer from "@/components/rtspPlayer/index.vue";
import Other from "./components/other.vue";
import { RoomHttp } from "@/api/modules/control/meetRoom";
import { RoomType } from "@/api/interface/control/MeetRoom";
import { MeetingControllerHandle, terminalDataType } from "@/views/meetingController/index";
import { SourceTypeEnums } from "@/enums/sourceTypeEnums";
import { MeetSourceType } from "@/api/interface/source";
import SceneDrawer from "@/views/meetingController/sceneDrawer.vue";

const router = useRouter();
const route = useRoute();
const roomId = ref(); // 路由带过来的房间号
const activeId = ref(3);
const sceneDrawer = ref<InstanceType<typeof SceneDrawer>>();

function backPage() {
  console.log("返回上一页");
  router.back();
}

function tabScene() {
  console.log("选择场景");
  sceneDrawer.value.acceptParams({ id: roomId.value, ip: roomData.value.ip });
}

// 会议室的主数据
const roomData = ref<RoomType.Room>();
const terminalData = ref<terminalDataType>({
  Matrix: [],
  RecordingHost: [],
  VideoTerminal: [],
  VideoCamera: [],
  AudioControl: [],
  Power: []
});

// 切换摄像机设备
let activeCamera = ref<Partial<MeetSourceType.terminal>>({
  terminalId: 1,
  terminalName: "",
  cameraUrl: null
});

function handleVideoClick(item: MeetSourceType.terminal) {
  activeCamera.value = item;
}

type environment = {
  temperature: number; //温度
  humidity: number; //湿度
  co2: number; //CO2
  pm2_5: number;
  pm10: number;
};
let EnvironmentDetail = ref<environment>({
  temperature: 0, //温度
  humidity: 0, //湿度
  co2: 0, //CO2
  pm2_5: 0,
  pm10: 0
});

function selectMenu(item) {
  activeId.value = item.typeId;
}

async function init() {
  if (route.query) {
    // 传递过来参数了
    roomId.value = Number(route.query.id);
    let data = await RoomHttp.getList({ roomId: roomId.value });
    let { data: envData } = await RoomHttp.getEnvironmentDetail({ id: roomId.value });

    EnvironmentDetail.value = envData?.content ? JSON.parse(envData.content) : EnvironmentDetail.value;
    console.log("环境数据", EnvironmentDetail.value);
    roomData.value = data.data.find(item => item.roomId === roomId.value);

    terminalData.value = await MeetingControllerHandle.getTerminalList(roomData.value.terminalVos);
    console.log("terminalData", terminalData.value);
    // 硬筛选 筛出第一个加载项
    const dataTypes = ["RecordingHost", "AudioControl", "Matrix", "Power", "VideoTerminal", "VideoCamera"];
    for (let i = 0; i < dataTypes.length; i++) {
      if (terminalData.value[dataTypes[i]].length > 0) {
        activeId.value = i;
        break; // 找到第一个非空数组后立即跳出循环
      }
    }
    if (terminalData.value.VideoCamera.length > 0) {
      activeCamera.value = terminalData.value.VideoCamera[0];
    }
  } else {
    // 木有参数  就退回去
    router.go(-1);
  }
}

init();
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
