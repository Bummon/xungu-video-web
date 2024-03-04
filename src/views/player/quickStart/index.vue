<template>
  <div class="main-box">
    <div class="left">
      <h3>终端列表：</h3>
      <el-collapse v-model="activeNames" accordion @change="handleChange">
        <el-collapse-item
          style="font-size: 20px"
          :title="item.groupName"
          :name="index + 1"
          v-for="(item, index) in groupData"
          :key="item.groupId"
          @click="tabClick(item.groupId)"
        >
          <div class="left_item" v-for="it in terminalData" :key="it.terminalId" @click.stop="tabClicks(it)">
            {{ it.terminalName }}
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="table-box">
      <el-row style="height: 100%">
        <el-col :span="17" style="padding: 0 20px">
          <div class="top">
            <h2>{{ terminalParams.value?.terminalName }}</h2>
            <div>
              <el-button size="large" type="primary" round @click="palyer('start')">开始播放</el-button>
              <el-button size="large" type="danger" round @click="palyer('pause')">暂停播放</el-button>
              <el-button size="large" type="danger" round @click="palyer('stop')">停止播放</el-button>
              <el-button size="large" type="danger" round @click="palyer('resume')">重新开始</el-button>
              <el-button size="large" round @click="palyer('v+')">增大音量</el-button>
              <el-button size="large" round @click="palyer('v-')">减小音量</el-button>
              <el-button size="large" round @click="palyer('mute')">静音</el-button>
            </div>
            <div>
              <el-button size="large" type="primary" round @click="palyer('forward')">快进</el-button>
              <el-button size="large" type="danger" round @click="palyer('backward')">快退</el-button>
              <el-button size="large" type="primary" round @click="palyer('playNext')">下一个</el-button>
              <el-button size="large" type="danger" round @click="palyer('playLast')">上一个</el-button>
            </div>
          </div>
          <div class="content">
            <h2>播放列表：</h2>
            <div class="content-list">
              <div v-show="playData.length > 0" class="content_item" v-for="(it, index) in playData" :key="it.listId">
                <span class="content_item_left">{{ index + 1 }}</span>
                <span>{{ it.libFilename }}</span>
              </div>
              <div v-show="playData.length == 0">
                <el-empty description="暂无数据" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="7" style="padding: 0 20px; background: #ffffff">
          <h3 style="color: #73767a">媒体清单：</h3>
          <div class="media">
            <p class="line" v-for="(item, index) in mediaData" :key="item.billId">
              <span
                style="
                  display: inline-block;
                  width: 10%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  vertical-align: top;
                "
                >{{ index + 1 }}</span
              >
              <span
                style="
                  display: inline-block;
                  width: 70%;
                  margin-left: 10px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  vertical-align: top;
                "
                >{{ item.billTitle }}</span
              >
              <span
                style="
                  display: inline-block;
                  width: 10%;
                  overflow: hidden;
                  text-align: center;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  vertical-align: top;
                "
              >
                <el-icon @click="handleAdd(item)" color="#6094e0">
                  <Plus />
                </el-icon>
              </span>
              <!--              <el-icon @click="handleDelete(item)" color="red"><Delete /></el-icon>-->
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts" name="RoomManage">
import { ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAllLists } from "@/api/modules/player/playList";
import { getAllList, deleteRows } from "@/api/modules/release/playList";
import { getGroupList } from "@/api/modules/player/group";
import { addRow } from "@/api/modules/player/bizMediaObj";
import { getList } from "@/api/modules/player/terminal";
import { sendGroupMsg } from "@/api/modules/player/send";
import { BaseRoom } from "@/api/interface/player/baseRoom";
import { useHandleData } from "@/hooks/useHandleData";

onMounted(() => {
  getMediaList();
  getGroupData();
});
const activeNames = ref([1]);
const handleChange = (val: string[]) => {
  console.log(val);
};
let groupId = "";
const palyer = async val => {
  const data = await sendGroupMsg({ groupId: groupId, methodName: val });
  console.log(data);
};
//终端分组列表
let groupData = ref<any>([]);
const getGroupData = async () => {
  const data = await getGroupList();
  console.log(data);
  groupData.value = data;
  tabClick(data[0].groupId);
};
//终端列表
let terminalData = ref<any>([]);
const tabClick = async (params: BaseRoom.Room) => {
  console.log(params);
  groupId = params;
  const data = await getList({ groupId: params });
  terminalData.value = data;
  tabClicks(data[0]);
};
let terminalParams = reactive({});
let playData = ref<any>([]);

const tabClicks = async (params: BaseRoom.Room) => {
  console.log(params);
  terminalParams.value = params;
  console.log(terminalParams.value.terminalName);
  playList(params.terminalId);
};
//获取播放列表
const playList = async val => {
  const { data } = await getAllLists({ terminalId: val });
  playData.value = data;
};
//清单列表
let mediaData = ref<any>([]);
const getMediaList = async () => {
  const { data } = await getAllList({ billStatus: 3 });
  console.log(data);
  mediaData.value = data;
};

//添加到播放列表
const handleAdd = async (params: BaseRoom.Room) => {
  if (!terminalParams.value) {
    ElMessage.warning("请先选择终端！");
    return;
  }
  console.log(params);
  const data = await addRow({ billId: params.billId, terminalId: terminalParams.value.terminalId });
  ElMessage.success({ message: `新增成功！` });
  playList(terminalParams.value.terminalId);
};

//删除
const handleDelete = async (params: BaseRoom.Room) => {
  await useHandleData(deleteRows, { ids: [params.billId] }, `删除【${params.billTitle}】清单`);
};
</script>
<style scoped lang="scss">
.left {
  box-sizing: border-box;
  width: 220px;
  height: 100%;
  padding: 18px;
  overflow-y: auto;
  background: #ffffff;
  .left_item {
    margin-bottom: 10px;
    margin-left: 10px;
    font-size: 16px;

    // display: flex;
    // align-items: center;
    // color: #6094e0;
  }
}
:deep(.el-collapse-item__header) {
  font-size: 18px !important;
  border: none;
}
.top {
  box-sizing: border-box;
  width: 100%;
  height: 20vh;
  padding: 10px 20px;
  margin: 0 0 1vh;
  background: #6094e0;
  border-radius: 30px;
  h2 {
    color: #ffffff;
  }
  div {
    text-align: center;

    // display: flex;
    // flex-wrap: wrap;
    .el-button {
      margin-bottom: 5px;
    }
  }
}
.content {
  box-sizing: border-box;
  width: 100%;
  height: 67vh;
  padding: 1vh 5vw;
  background: #ffffff;
  .content-list {
    height: 56vh;
    padding: 0.5vh 0.5vw;
    overflow-y: auto;
    border: 1px solid #e6e6e6;
    .content_item {
      height: 4vh;
      font-size: 2vh;
      line-height: 4vh;
      border-bottom: 1px solid #cbcbc7;
      .content_item_left {
        display: inline-block;
        width: 20%;
        margin-right: 20px;
        text-align: center;
      }
    }
  }
}
.media {
  height: 90%;
  overflow-y: auto;

  // background: #6094e0;
  .line {
    padding: 5px 5%;
    font-size: 18px;
    text-align: left;
    cursor: pointer;
    border-bottom: 1px solid #cbcbc7;
    span {
      cursor: pointer;
    }
    &:hover {
      background-color: #dcdada;
    }
    .el-icon {
      &:hover {
        color: #0552ce;
        transform: scale(150%);
      }
    }
  }
}
</style>
