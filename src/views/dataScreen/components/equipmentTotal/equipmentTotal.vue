<script setup lang="ts">
import { ref } from "vue";
import { DataScreenHttp, DataScreenType } from "@/api/modules/dataScreen";

const data = ref();

async function init() {
  data.value = (await DataScreenHttp.getTerminalCountListByType()).data;
  console.log(data.value);
}

init();
</script>
<template>
  <div class="equipment">
    <table>
      <thead>
        <tr>
          <th>设备资源类型</th>
          <th>设备总数量</th>
          <th>在线数量</th>
          <th style="width: 8vw">在线占比</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.dataType">
          <td style="font-size: 16px">{{ item.dataType }}</td>
          <td>{{ item.total }}</td>
          <td style="color: var(--el-color-primary-light-2)">{{ item.onlineCount }}</td>

          <td class="progress-td">
            <el-progress
              :text-inside="true"
              :stroke-width="18"
              :percentage="Math.round(100 * (item.onlineCount / item.total))"
              striped
              :color="`var(--el-color-primary)`"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@import "../../index.scss";
.equipment {
  width: 100%;
  height: 33vh;
  border-radius: 8px;
}
table {
  width: 100%;
  height: 32vh;
  overflow: hidden;
  overflow-y: scroll;
  font-size: 0.8vw;
  color: #a6a4a4;
  text-align: center;
  tr {
    height: 4vh;
    td {
      height: 3vh;
      font-family: "DSI4";
      font-size: 1vw;
    }
  }
  tbody {
    font-weight: bold;
    color: #a6a4a4;
    text-shadow: 1px 1px 0 rgb(14 6 6 / 90%);
  }
}
:deep(.el-progress) {
  .el-progress-bar__outer {
    background-color: rgb(0 0 0 / 60%);
  }
}
</style>
