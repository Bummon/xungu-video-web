<template>
  <div id="scene-drawer">
    <el-dialog
      v-model="drawerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :show-close="true"
      width="1200"
      height="80%"
      top="10vh"
      draggable
    >
      <template #header>
        <span style="vertical-align: middle">
          <el-icon :size="20" class="no-inherit">
            <Connection />
          </el-icon>
        </span>
        <span style="font-size: 16px"> 场景控制</span>
      </template>
      <!--  场景列表  -->
      <div class="add-box">
        <p>场景管理</p>
        <el-button @click="openScene('新增')" link type="primary" icon="EditPen" class="add-btn"> 新增场景</el-button>
      </div>
      <el-table :data="sceneList" border style="width: 100%" height="300">
        <el-table-column label="序号" type="index" width="70" align="center"></el-table-column>
        <el-table-column
          :prop="sceneColumn.scenarioId.prop"
          :label="sceneColumn.scenarioId.label"
          :align="sceneColumn.scenarioId.align"
          :width="sceneColumn.scenarioId.width"
        >
          <template #default="scope">
            <span>{{ scope.row.scenarioId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :prop="sceneColumn.scenarioName.prop"
          :label="sceneColumn.scenarioName.label"
          :align="sceneColumn.scenarioName.align"
          :width="sceneColumn.scenarioName.width"
        >
          <template #default="scope">
            <span>{{ scope.row.scenarioName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commandNumber" label="命令编号" align="center" width="120" />
        <el-table-column prop="terminalDescr" label="场景说明" align="center" />
        <el-table-column
          :prop="sceneColumn.operation.prop"
          :label="sceneColumn.operation.label"
          :align="sceneColumn.operation.align"
          :width="sceneColumn.operation.width"
        >
          <template #default="scope">
            <el-button @click="openScene('编辑', scope.row)" text type="primary" icon="edit">编辑</el-button>
            <el-button @click="deleteScene(scope.row)" text type="danger" icon="delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--  计划列表  -->
      <div class="add-box">
        <p>计划列表</p>
        <el-button @click="openProject('新增')" link type="primary" icon="EditPen" class="add-btn"> 新增计划</el-button>
      </div>
      <el-table :data="ScenePlanList" border style="width: 100%" height="300">
        <el-table-column label="序号" type="index" width="70" align="center"></el-table-column>
        <el-table-column
          :prop="scenePlanColumn.planName.label"
          :label="scenePlanColumn.planName.label"
          :width="scenePlanColumn.planName.width"
          :align="scenePlanColumn.planName.align"
        >
          <template #default="scope">{{ scope.row.planName }}</template>
        </el-table-column>
        <el-table-column
          :prop="scenePlanColumn.scenarioName.label"
          :label="scenePlanColumn.scenarioName.label"
          :width="scenePlanColumn.scenarioName.width"
          :align="scenePlanColumn.scenarioName.align"
        >
          <template #default="scope">{{ scope.row.scenarioName }}</template>
        </el-table-column>
        <el-table-column prop="fileExt" label="重复" align="center">
          <template #default="scope">
            <span v-if="scope.row.executionType === 2">
              <p class="result-text" v-if="scope.row.cron">
                <span v-if="scope.row.cron.split(' ')[5] !== '*' && scope.row.cron.split(' ')[5] !== '?'"
                  >每周{{ weekArr[Number(scope.row.cron.split(" ")[5]) - 1] }}</span
                >
                <span v-if="scope.row.cron.split(' ')[3] === '*'">每天</span>
                <span v-if="scope.row.cron.split(' ')[3] !== '*' && scope.row.cron.split(' ')[3] !== '?'"
                  >每月{{ scope.row.cron.split(" ")[3] }}号</span
                >
                <span>{{ scope.row.cron.split(" ")[2] }}点钟执行</span>
              </p>
            </span>
            <span v-if="scope.row.executionType === 1">{{ scope.row.startTime }} 执行</span>
          </template>
        </el-table-column>
        <el-table-column
          :prop="scenePlanColumn.operation.prop"
          :label="scenePlanColumn.operation.label"
          :align="scenePlanColumn.operation.align"
          :width="scenePlanColumn.operation.width"
        >
          <template #default="scope">
            <el-button text type="primary" icon="Position" v-if="scope.row.status === 1" @click="changePlanStatus(scope.row)"
              >开始
            </el-button>
            <el-button @click="changePlanStatus(scope.row)" text type="warning" icon="SwitchButton" v-if="scope.row.status === 2"
              >结束
            </el-button>
            <el-button @click="openProject('查看', scope.row)" text type="primary" icon="View">查看</el-button>
            <el-button @click="openProject('编辑', scope.row)" text type="primary" icon="edit" v-if="scope.row.status === 1"
              >编辑
            </el-button>
            <el-button @click="deleteProject(scope.row)" text type="danger" icon="delete" v-if="scope.row.status === 3">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="drawerVisible = false">关闭</el-button>
      </template>
      <SceneDrawerDrawer ref="sceneDrawerDrawer"></SceneDrawerDrawer>
      <SceneDrawerProject ref="sceneDrawerProject"></SceneDrawerProject>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="AppDrawer">
import { ref, reactive } from "vue";
import { ElMessage, ElNotification, FormInstance } from "element-plus";
import { RoomType } from "@/api/interface/control/MeetRoom";
import { SceneType } from "@/api/interface/control/scene";
import { SceneHttp, ScenePlanHttp } from "@/api/modules/control/scene";
import { TableWidthEnum } from "@/enums/TableEnum";
import SceneDrawerDrawer from "@/views/meetRoomManage/meetingRoom/sceneDrawerDrawer.vue";
import { XGConfirmBox } from "@/hooks/useHandleData";
import SceneDrawerProject from "@/views/meetRoomManage/meetingRoom/sceneDrawerProject.vue";

const drawerVisible = ref(false);
const sceneDrawerDrawer = ref<InstanceType<typeof SceneDrawerDrawer> | null>(null);
const sceneDrawerProject = ref<InstanceType<typeof SceneDrawerProject> | null>(null);
const weekArr = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"];

// 接收父组件的参数的类型
interface iDrawerProp {
  row: RoomType.Room;
}

const drawerProps = ref<iDrawerProp>();
const sceneList = ref<SceneType.Scene[]>([]);
const ScenePlanList = ref<SceneType.ScenePlan[]>();

// 接收父组件传过来的参数
const acceptParams = async (params: iDrawerProp) => {
  drawerProps.value = params;
  if (!params.row.roomId) return;

  // 获取场景列表
  sceneList.value = (await SceneHttp.getSceneList({ roomId: params.row.roomId })).data;
  // 获取场景执行计划列表
  ScenePlanList.value = (await ScenePlanHttp.getScenePlanList({ roomId: params.row.roomId })).data;
  drawerVisible.value = true;
};

// 更新场景列表数据
async function updateList() {
  // 获取场景列表
  sceneList.value = (await SceneHttp.getSceneList({ roomId: drawerProps.value.row.roomId })).data;
}

// 更新计划列表数据
async function updateProject() {
  // 获取场景执行计划列表
  ScenePlanList.value = (await ScenePlanHttp.getScenePlanList({ roomId: drawerProps.value.row.roomId })).data;
}

/**
 * 新增或编辑场景
 * @param row
 */
function openScene(title: string, row: SceneType.Scene | {} = {}) {
  let params = {
    title: title,
    roomName: drawerProps.value.row.roomName,
    roomId: drawerProps.value.row.roomId,
    row: {},
    update: () => updateList()
  };
  if (title === "新增") {
    console.log("新增场景");
  } else {
    console.log("编辑或查看场景");
    params.row = row;
  }
  sceneDrawerDrawer.value.acceptParams(params);
}

function openProject(title: string, row: SceneType.Scene | {} = {}) {
  let params = {
    title: title,
    isView: title === "查看" ? true : false,
    roomName: drawerProps.value.row.roomName,
    roomId: drawerProps.value.row.roomId,
    row: {},
    update: () => updateProject()
  };
  if (title === "新增") {
    console.log("新增计划");
  } else {
    console.log("编辑计划");
    params.row = row;
  }
  sceneDrawerProject.value.acceptParams(params);
}

/**
 * 改变计划的状态
 */
async function changePlanStatus(row) {
  let status;
  if (row.status === 1) {
    status = 2;
  } else if (row.status === 2) {
    status = 3;
  }
  await ScenePlanHttp.changeScenePlanStatus({ planId: row.planId, status });
  await updateProject();
}

/**
 * 删除场景
 * @param row
 */
async function deleteScene(row: SceneType.Scene) {
  console.log("delete scene");
  await XGConfirmBox(SceneHttp.deleteSceneRows, [row.scenarioId], "确认删除该场景");
  await updateList();
}

async function deleteProject(row: SceneType.ScenePlan) {
  console.log("delete ScenePlan");
  await XGConfirmBox(ScenePlanHttp.deleteScenePlanRows, [row.planId], "确认删除该计划");
  await updateProject();
}

const sceneColumn = {
  scenarioId: {
    width: TableWidthEnum.BigIntNum,
    label: "场景ID",
    prop: "scenarioId",
    align: "left"
  },
  scenarioName: {
    width: TableWidthEnum.Name,
    label: "场景名称",
    prop: "scenarioName",
    align: "center"
  },
  operation: {
    width: TableWidthEnum.Handle3,
    label: "操作",
    prop: "operation",
    align: "center"
  }
};
const scenePlanColumn = {
  planName: {
    width: TableWidthEnum.Name,
    label: "计划名称",
    prop: "planName",
    align: "left"
  },
  scenarioName: {
    width: TableWidthEnum.Parent,
    label: "场景名称",
    prop: "scenarioName",
    align: "left"
  },
  operation: {
    width: TableWidthEnum.Handle5,
    label: "操作",
    prop: "operation",
    align: "center"
  }
};
defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
#scene-drawer {
  :deep(.el-dialog) {
    .el-dialog__body {
      padding-top: 0;
    }
  }
}
.add-box {
  position: relative;
  height: 4vh;
  p {
    font-size: 20px;
    font-weight: bold;
    line-height: 4vh;
    color: #0f0f0f;
    text-align: center;
  }
  .add-btn {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
