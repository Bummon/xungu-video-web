<script setup lang="ts" name="dataScreen">
import { ref, Ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { AreaHttp } from "@/api/modules/control/area";
import { AreaType } from "@/api/interface/control/area";
import { RoomType } from "@/api/interface/control/MeetRoom";
import { RoomHttp } from "@/api/modules/control/meetRoom";

const router = useRouter();
const dataScreenRef = ref<HTMLElement | null>(null);
const dialogVisible = ref(false);
const firstArea = ref<Partial<AreaType.area>>({
  areaName: "无数据",
  areaId: 0
});
onMounted(() => {});
// 一级区域数据
const firstAreaList = ref<AreaType.area[]>([]);
// 二级区域数据
const secondAreaList = ref<AreaType.area[]>([]);
const active = ref<bigint | number>(1);
// 会议室数据
const roomList = ref<RoomType.Room[]>([]);
// 查看设备列表
const terminalDialogVisible = ref(false);
// 弹窗的设备列表
const terminalList = ref([]);
// 销毁时触发
onBeforeUnmount(() => {});

function handleEnterController(item) {
  console.log("跳转到控制台");
  router.push({ path: "/meetingController", query: { id: item.roomId } });
}

/**
 * 修改一级区域
 * @param item 一级区域的详情
 */
function handleSelectFirstArea(item: AreaType.area) {
  firstArea.value = item;
  handleGetSecondArea(item.areaId); // 拉取二级区域的列表
  dialogVisible.value = false;
}

/**
 * 自动加载二级区域  同时渲染会议室
 * @param areaId
 */
async function handleGetSecondArea(areaId) {
  secondAreaList.value = (await AreaHttp.getAreaList({ parentId: areaId })).data;
  if (secondAreaList.value.constructor === Array && secondAreaList.value.length > 0) {
    active.value = secondAreaList.value[0].areaId;
    await handleGetMeetRoomList(active.value);
  } else {
    roomList.value = [];
  }
}

// 自动获取会议室列表
async function handleGetMeetRoomList(areaId) {
  roomList.value = (await RoomHttp.getList({ areaId: areaId })).data;
  console.log(roomList.value);
  roomList.value.forEach(item => {
    item.faultTerminalList = [];
    item.onLineTerminalList = [];
    if (item?.terminalVos?.length) {
      item.terminalVos.forEach(tem => {
        if (tem.runningStatus === 0) {
          item.faultTerminalList.push(tem);
        }
        if (tem.runningStatus === 1) {
          item.onLineTerminalList.push(tem);
        }
      });
    }
  });
}

// 手动选择二级区域
function selectSecondArea(item: AreaType.area) {
  active.value = item.areaId;
  handleGetMeetRoomList(item.areaId);
}

//  查看在线设备  故障设备等
function viewTerminalList(list) {
  if (list.constructor === Array && list.length > 0) {
    console.log(list);
    terminalList.value = list;
    terminalDialogVisible.value = true;
  }
}

async function Init() {
  firstAreaList.value = (await AreaHttp.getAreaList({ parentId: 0 })).data;
  if (firstAreaList.value.constructor === Array && firstAreaList.value.length > 0) {
    firstArea.value = firstAreaList.value[0];
    await handleGetSecondArea(firstArea.value.areaId);
  }
}

Init();
</script>
<template>
  <div class="remoteControl-container">
    <div ref="dataScreenRef" class="dataScreen">
      <div class="header card">
        <div class="header-lf">
          <span class="header-area card_button" @click="dialogVisible = true">切换区域</span>
        </div>
        <div class="header-ct">
          <div class="header-ct-title">
            <span class="card_button">会议室远程控制中心</span>
          </div>
        </div>
        <div class="header-rg">
          <span class="header-time"></span>
        </div>
      </div>
      <div class="main">
        <div class="main-lf">
          <div class="list-title">
            <span>{{ firstArea.areaName || "区域列表" }}</span>
            <img src="./images/dataScreen-title.png" alt="" width="80px" />
          </div>
          <div class="room-items">
            <div
              class="room-item"
              @click="selectSecondArea(item)"
              :class="active === item.areaId ? 'item-active' : ''"
              v-for="item in secondAreaList"
              :key="item.areaId"
            >
              <p style="display: flex; align-items: center">
                <el-icon size="18" style="margin-right: 5px">
                  <OfficeBuilding />
                </el-icon>
                {{ item.areaName || "" }}
              </p>
            </div>
          </div>
        </div>
        <div class="main-ct">
          <div class="room-card" v-for="item in roomList" :key="item.roomId">
            <div
              class="room-card-status"
              :class="['room-card-status-warning', 'room-card-status-online', 'room-card-status-outline'][item.runningStatus]"
            >
              <p>{{ ["告警", "在线", "离线"][item.runningStatus] }}</p>
            </div>
            <div class="room-card-title">
              <span>名称：{{ item.roomName }}</span>
              <img src="./images/dataScreen-title.png" alt="" />
            </div>
            <!-- 信息区域 -->
            <div class="room-card-info">
              <p style="margin: 5px 0">位置：{{ item.areaName }}</p>
              <p>类型：{{ item.roomTypeName }}</p>
              <div class="room-card-info-footer">
                <div class="room-card-info-equipment">
                  <div v-if="item.runningStatus === 1" @click="viewTerminalList(item.onLineTerminalList)">
                    <p>在线设备</p>
                    <p class="robotFont">{{ item.onLineTerminalList.length }}</p>
                  </div>
                  <div @click="viewTerminalList(item.terminalVos)" v-else>
                    <p>设备总数</p>
                    <p class="robotFont">{{ item.terminalNum }}</p>
                  </div>
                  <div @click="viewTerminalList(item.faultTerminalList)">
                    <p>故障设备</p>
                    <p class="robotFont" style="color: darkred">{{ item.faultTerminalList.length }}</p>
                  </div>
                </div>
                <div class="room-card-info-footer-button">
                  <button @click="handleEnterController(item)" v-if="!(item.runningStatus === 2)">进入</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="选取一级区域" width="30%">
      <div class="dialog_box">
        <p
          class="firstAreaOption_button"
          v-for="item in firstAreaList"
          :key="item.areaId"
          :class="item.areaId === firstArea.areaId ? 'firstAreaOption_button_active' : ''"
          @click="handleSelectFirstArea(item)"
        >
          {{ item.areaName }}
        </p>
      </div>
    </el-dialog>
    <el-dialog v-model="terminalDialogVisible" title="设备" width="30%">
      <div class="dialog_box">
        <div class="terminal_button" v-for="item in terminalList" :key="item.terminalId">
          <p>
            <span class="terminal-type">{{ item.typeName }}：</span>
            <span class="terminal-name">{{ item.terminalName }}</span>
            <span class="terminal-status">{{ ["故障", "在线", "离线"][item.runningStatus] }}</span>
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";

$cardBgc: linear-gradient(rgb(100 100 100) 30%, rgb(70 70 70), rgb(100 100 100) 30%);
$cardButtonBgc: linear-gradient(rgb(120 120 120) 20%, rgb(150 150 150), rgb(120 120 120) 20%);
.card {
  box-sizing: border-box;
  background: $cardBgc;
  filter: brightness(120%);
  border: 2px solid #8e8c8c;
  box-shadow: 2px 2px 2px rgb(111 110 110 / 76%) inset;
}
.card_button {
  color: var(--el-color-primary-dark-2);
  cursor: pointer;
  background: $main-color-gray;
  border: 1px solid rgb(160 158 158 / 52%);
  box-shadow: 2px 2px 2px #484848;
  &:hover {
    color: $font-color-primary-hover;
    background: $main-color-gray-hover;
  }
}
</style>
