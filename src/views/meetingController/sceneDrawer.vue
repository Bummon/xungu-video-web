<template>
  <div id="scene-tab">
    <el-dialog
      v-model="drawerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :show-close="true"
      width="75%"
      top="10vh"
      draggable
    >
      <template #header>
        <span class="title"><span class="line"></span>场景选择</span>
      </template>
      <ul class="sceneList" v-if="sceneList.constructor === Array && sceneList.length > 0">
        <li v-for="item in sceneList" :key="item.scenarioId" @click="selectScene(item)">
          <p>{{ item.scenarioName }}</p>
        </li>
      </ul>
      <div class="empty" v-else><p>该会议室未设置场景</p></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="AppDrawer">
import { ref, reactive } from "vue";
import { ElNotification } from "element-plus";
import { SceneType } from "@/api/interface/control/scene";
import { SceneHttp } from "@/api/modules/control/scene";

const drawerVisible = ref(false);
type propType = {
  id: number;
  ip: string;
};
const drawerProps = ref<propType>();
const sceneList = ref<SceneType.Scene[]>();
// 选择执行某个场景
const selectScene = async item => {
  let res = await SceneHttp.tabScene({ scenarioId: item.scenarioId, ip: drawerProps.value.ip });
  console.log(res);
};
// 接收父组件传过来的参数
const acceptParams = async (params: propType) => {
  drawerProps.value = params;
  sceneList.value = (await SceneHttp.getSceneList({ roomId: params.id })).data;
  drawerVisible.value = true;
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
#scene-tab {
  :deep(.el-dialog) {
    // background-color: rgba(54, 54, 54, 0.99);
    background-image: url("./images/scene.jpg");
    background-repeat: repeat-y;
    background-position: center;
    background-size: auto 100%;
    backdrop-filter: blur(15px);
    .el-dialog__header {
      background-color: transparent;
      border: none;
      .title {
        width: 100%;
        height: 3vh;
        padding-left: 1vw;
        font-size: 20px;
        color: var(--el-color-primary);
        text-align: center;
        vertical-align: middle;
      }
      .line {
        position: absolute;
        top: 1.75vh;
        left: 1vw;
        width: 8px;
        height: 2.5vh;
        background-color: var(--el-color-primary);
        border-radius: 10px;
      }
    }
    .el-dialog__body {
      background-color: transparent;
    }
  }
  .empty {
    height: 65vh;
    p {
      font-size: 1.5vw;
      line-height: 65vh;
      color: #ffffff;
      text-align: center;
    }
  }
  .sceneList {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 65vh;
    li {
      width: 10vw;
      height: 55vh;
      margin: 0 0.5vw;
      color: #ffffff;
      cursor: pointer;
      // background-color: $main-color-primary;
      background-image: url("./images/sceneBgc.jpg");
      background-repeat: repeat-x;
      background-position: bottom;
      background-size: auto 100%;
      transition-duration: 150ms;
      &:hover {
        transform: scale(1.08);
      }
      p {
        font-size: 1.5vw;
        line-height: 55vh;
        text-align: center;
        text-shadow: 1px 1px 0 #000000;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
