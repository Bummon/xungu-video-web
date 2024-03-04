<template>
  <div class="dataVisualize-box">
    <div class="card top-box">
      <div class="top-title">
        <div class="card">
          <img src="./images/today.png" alt="" />
          <div>
            <span>你好admin，你一定有些累了，喝杯咖啡提提神。</span>
            <span style="font-size: 16px; font-weight: 400">欢迎</span>
          </div>
        </div>
      </div>
      <div class="top-content">
        <el-row :gutter="40">
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item">
              <div class="items">
                <div class="echarts-title">访问量</div>
                <div class="curve-echarts">
                  <Line ref="lineRef" />
                </div>
              </div>
              <div class="items">
                <div class="echarts-title">终端统计</div>
                <div class="curve-echarts">
                  <Curve ref="curveRef" />
                </div>
              </div>
            </div>
            <div class="item-center">
              <div class="gitee-traffic traffic-box" @click="toDetail(1)">
                <div class="traffic-img">
                  <img src="./images/add_team.png" alt="" />
                </div>
                <span class="traffic-name sle">播放清单</span>
              </div>
              <div class="gitHub-traffic traffic-box" @click="toDetail(2)">
                <div class="traffic-img">
                  <img src="./images/book_sum.png" alt="" />
                </div>
                <span class="traffic-name sle">计划清单</span>
              </div>
              <div class="gitee-traffic traffic-box" @click="toDetail(3)">
                <div class="traffic-img">
                  <img src="./images/add_team.png" alt="" />
                </div>
                <span class="traffic-name sle">快速开始</span>
              </div>
              <div class="gitHub-traffic traffic-box" @click="toDetail(4)">
                <div class="traffic-img">
                  <img src="./images/book_sum.png" alt="" />
                </div>
                <span class="traffic-name sle">自定义布局</span>
              </div>
            </div>
            <div class="item-right" style="height: 505px">
              <div class="echarts-title">常规清单</div>
              <div class="book-echarts">
                <el-table :data="MediaList" height="400" stripe style="width: 100%">
                  <el-table-column prop="billTitle" label="常规清单" align="center" />
                  <el-table-column prop="billItemCount" label="文件数量" align="center" />
                </el-table>
              </div>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <div class="item-right" style="height: 300px">
              <div class="echarts-title">信息</div>
              <div class="book-echarts">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="vue" label-align="left" align="center" width="100px">
                    <el-tag size="small">^3.3.4</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="@vue/cli" width="100px" label-align="left" align="center">
                    <el-tag size="small">^3.3.4</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="vuex" label-align="left" align="center">
                    <el-tag size="small">^3.3.4</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="vue-router" label-align="left" align="center">
                    <el-tag size="small">^4.2.1</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="element-plus" label-align="left" align="center">
                    <el-tag size="small">^2.3.4</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="axios" label-align="left" align="center">
                    <el-tag size="small">^1.4.0</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="echarts" label-align="left" align="center">
                    <el-tag size="small">^5.4.2</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="vite" label-align="left" align="center">
                    <el-tag size="small">^4.3.8</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
            <div class="item-center">
              <div class="gitee-traffic traffic-box" @click="toDetail(5)">
                <div class="traffic-img">
                  <img src="./images/add_team.png" alt="" />
                </div>
                <span class="traffic-name sle">终端管理</span>
              </div>
              <div class="gitHub-traffic traffic-box" @click="toDetail(6)">
                <div class="traffic-img">
                  <img src="./images/book_sum.png" alt="" />
                </div>
                <span class="traffic-name sle">终端授权</span>
              </div>
              <div class="gitee-traffic traffic-box" @click="toDetail(7)">
                <div class="traffic-img">
                  <img src="./images/add_team.png" alt="" />
                </div>
                <span class="traffic-name sle">群控分组</span>
              </div>
              <div class="gitHub-traffic traffic-box" @click="toDetail(8)">
                <div class="traffic-img">
                  <img src="./images/book_sum.png" alt="" />
                </div>
                <span class="traffic-name sle">多媒体文件</span>
              </div>
            </div>
            <div class="item-right" style="height: 505px">
              <div class="echarts-title">计划清单</div>
              <div class="book-echarts">
                <el-table :data="planList" height="400" stripe style="width: 100%">
                  <el-table-column prop="billTitle" label="计划清单" align="left" />
                  <el-table-column prop="billItemCount" label="文件数量" align="center" />
                  <el-table-column prop="billItemDuration" label="总播放时间" align="center" />
                  <el-table-column prop="billStatus" label="状态" align="center">
                    <template #default="scope">
                      <el-tag v-if="scope.row.billStatus == 0" type="info">草稿</el-tag>
                      <el-tag v-if="scope.row.billStatus == 1" type="warning" disable-transitions>已提交待审核</el-tag>
                      <el-tag v-if="scope.row.billStatus == 2" disable-transitions>已审核</el-tag>
                      <el-tag v-if="scope.row.billStatus == 3" type="success" disable-transitions>已发布</el-tag>
                      <el-tag v-if="scope.row.billStatus == 4" type="success" disable-transitions>已完成</el-tag>
                      <el-tag v-if="scope.row.billStatus == 5" type="danger" disable-transitions>作废</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="dataVisualize">
import { onMounted, ref } from "vue";
import { sysApp } from "@/api/interface/system1/sysApp";
import { useRouter } from "vue-router";
import Curve from "./components/curve.vue";
import Line from "./components/line.vue";
import { getLibraryList, getMediaList, getTerminalList } from "@/api/modules/player/dashboard";

onMounted(() => {
  getList();
  curveRef.value.initChart(curveData);
  lineRef.value.initChart(lineData);
});
const curveRef = ref();
const lineRef = ref();

const curveData = [
  { value: 10, spotName: "离线" },
  { value: 2, spotName: "在线" }
];
const lineData = [
  { value: 6, spotName: "06/27" },
  { value: 7, spotName: "06/28" },
  { value: 8, spotName: "06/29" },
  { value: 2, spotName: "06/30" },
  { value: 5, spotName: "07/01" },
  { value: 6, spotName: "07/02" }
];
const router = useRouter();

// 跳转详情页
const toDetail = (val: number) => {
  if (val == 1) {
    router.push(`/player/generalMedia`);
  } else if (val == 2) {
    router.push(`/player/planMedia`);
  } else if (val == 3) {
    router.push(`/player/quickStart`);
  } else if (val == 4) {
    router.push(`/mainData/diyLayout`);
  } else if (val == 5) {
    router.push(`/mainData/terminal`);
  } else if (val == 6) {
    router.push(`/mainData/terminalBind`);
  } else if (val == 7) {
    router.push(`/mainData/group`);
  } else {
    router.push(`/player/generalMedia`);
  }
};

let terminalList = ref<sysApp.Option[]>([]);
getTerminalList({ statusType: 1 }).then(res => {
  terminalList.value = res.data as sysApp.Option[];
  console.log(terminalList.value);
});
let fileList = ref<sysApp.Option[]>([]);
getLibraryList().then(res => {
  fileList.value = res.data as sysApp.Option[];
  console.log(fileList.value);
});
let MediaList = ref<sysApp.Option[]>([]);
let planList = ref<sysApp.Option[]>([]);

const getList = async () => {
  const { data } = await getMediaList({ statusType: 1 });
  data.forEach(item => {
    if (item.billType == 1) {
      planList.value.push(item);
    } else {
      MediaList.value.push(item);
    }
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
