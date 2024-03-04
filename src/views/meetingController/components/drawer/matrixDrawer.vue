<script setup lang="ts">
import { ref } from "vue";
import { EquipmentControlHttp } from "@/api/modules/equipmentControl";

const drawerVisible = ref(false);
const outputChannelList = ref([]);
const inputChannelList = ref([]);

function handleSubmit() {
  console.log("提交");
  EquipmentControlHttp.updateMatrixRow([...inputChannelList.value, ...outputChannelList.value]).then(res => {
    console.log(res);
    drawerVisible.value = false;
  });
}

const open = (inputList, outputList, type) => {
  console.log(type);
  drawerVisible.value = true;
  inputChannelList.value = inputList;
  outputChannelList.value = outputList;
  console.log(inputChannelList.value);
};
defineExpose({
  open
});
</script>

<template>
  <div id="matrix-drawer">
    <el-dialog
      width="36%"
      v-model="drawerVisible"
      :close-on-click-modal="false"
      title="通道管理"
      :destroy-on-close="true"
      top="10vh"
      draggable
    >
      <el-row>
        <el-col :span="12">
          <el-table :data="inputChannelList" style="width: 100%" stripe>
            <el-table-column label="序号" width="80" align="center">
              <template #default="scope">
                <span style="color: #067b71"> {{ scope.row.outputId || scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="输入通道">
              <template #default="scope">
                <span @click="scope.row.focus = true">
                  <el-button v-show="!scope.row.focus" type="primary">
                    <span class="title">
                      {{ scope.row.name }}
                    </span>
                  </el-button>
                </span>
                <el-input
                  v-show="scope.row.focus"
                  ref="inputInstRef"
                  type="text"
                  maxlength="16"
                  show-count
                  placeholder="请输入通道名称"
                  v-model.trim="scope.row.name"
                  @keyup.enter="scope.row.focus = false"
                  @blur="scope.row.focus = false"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table :data="outputChannelList" style="width: 100%" stripe>
            <el-table-column label="序号" width="80" align="center">
              <template #default="scope">
                <span style="color: #067b71"> {{ scope.row.outputId || scope.row.number }}</span>
              </template>
            </el-table-column>

            <el-table-column label="输出通道">
              <template #default="scope">
                <span @click="scope.row.focus = true">
                  <el-button v-show="!scope.row.focus" type="primary">
                    <span class="title">
                      {{ scope.row.name }}
                    </span>
                  </el-button>
                </span>
                <el-input
                  v-show="scope.row.focus"
                  ref="inputInstRef"
                  type="text"
                  maxlength="16"
                  show-count
                  placeholder="请输入通道名称"
                  v-model.trim="scope.row.name"
                  @keyup.enter="scope.row.focus = false"
                  @blur="scope.row.focus = false"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="drawerVisible = false" text>取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
#matrix-drawer {
  :deep(.el-dialog) {
    height: 80vh;
    overflow: hidden;
    background-color: transparent;
    border: 4px solid #5c5c5c;
    border-radius: 1vh;
    .el-dialog__header {
      background-color: transparent;
      border-bottom: none;
      backdrop-filter: blur(15px);
      .el-dialog__title {
        color: #ffcd05;
      }
    }
    .el-dialog__body {
      height: 65vh;
      overflow-y: scroll;
      background-color: transparent;
      backdrop-filter: blur(15px);
    }
  }
  :deep(.el-table) {
    background-color: transparent;
    border-bottom-color: #6e6e6e;
    .el-table__cell {
      background-color: transparent;
      border-bottom-color: #6e6e6e;
    }
    tr,
    td {
      background-color: transparent;
      border-bottom-color: #6e6e6e;
    }
  }
}
</style>
