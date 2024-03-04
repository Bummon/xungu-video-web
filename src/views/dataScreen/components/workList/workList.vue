<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { DataScreenHttp, DataScreenType } from "@/api/modules/dataScreen";
import { useGlobalStore } from "@/stores/modules/global";

const globalStore = useGlobalStore();
type EChartsOption = echarts.EChartsOption;
const workCharts = ref();
let data = ref<DataScreenType.workList>({
  addTotal: 0,
  finishTotal: 0,
  personTotal: 0,
  repairTotal: 0,
  systemTotal: 0,
  total: 0
});
let option: EChartsOption;

async function init() {
  let time = new Date()
    .toLocaleString("zh", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/\//g, "-");
  data.value = (await DataScreenHttp.getOrderCountList(time, time)).data[0];
  option = {
    backgroundColor: "rgba(0,0,0,0)",
    color: [globalStore.primary, "#FFFB67", "#ffcd05", "rgba(5,8,5,0.9)", "rgba(165,166,165,0.9)", "#ad3826"],
    title: {
      text: "工单来源",
      left: 10,
      top: 10,
      textStyle: {
        color: "#FFFB67",
        fontSize: 18,
        fontWeight: "normal"
      }
    },

    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0,0,0,.7)",
      borderWidth: 0,
      textStyle: {
        color: "#02d2bf",
        fontFamily: "Microsoft YaHei",
        fontStyle: "normal",
        fontWeight: "normal"
      }
    },
    series: [
      {
        name: "组成部分",
        type: "pie",
        roseType: "area",
        left: "-45%",
        data: [
          { value: data.value.systemTotal, name: "系统生成" },
          { value: data.value.personTotal, name: "人工录入" }
        ].sort(function (a, b) {
          return a.value - b.value;
        }),
        radius: ["40%", "80%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: "#fff",
          borderWidth: 1
        },
        label: {
          color: "fff"
        }
      }
    ]
  };
  let workChart = await echarts.init(workCharts.value);
  option && workChart.setOption(option);
}
onMounted(() => {
  init();
});
</script>
<template>
  <div id="work-list">
    <div class="work-info">
      <div style="display: flex; flex-direction: column; width: 100%; text-align: center">
        <span style="margin: 0.5vh 0; margin-left: 0.3vw; font-size: 1.2vw; color: #fffb67">{{
          Math.round((data.finishTotal / data.total) * 100) || 0
        }}</span>
        <span style="font-size: 0.9vw; color: #ffffff">完成率</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 3vh">
        <div style="width: 100%; padding-right: 2vw; text-align: center">
          <span style="font-size: 1.2vw; color: #fffb67">{{ data.addTotal }}</span>
        </div>
        <div style="width: 100%; text-align: center">
          <span style="font-size: 1.2vw; color: #fffb67">{{ data.total }}</span>
        </div>
        <div style="width: 100%; padding-left: 2vw; text-align: center">
          <span style="font-size: 1.2vw; color: #fffb67">{{ data.finishTotal }}</span>
        </div>
      </div>
      <!-- <p>
        <span class="info-label">今日新增：</span><span class="info-number">{{ data.total }}</span> 件
      </p>
      <p>
        <span class="info-label">待维修：</span><span class="info-number">{{ data.addTotal }}</span> 件
      </p>
      <p>
        <span class="info-label">已完成：</span><span class="info-number">{{ data.finishTotal }}</span> 件
      </p>
      <p>
        <span class="info-label">完成率：</span
        ><span class="info-number">{{ Math.round((data.finishTotal / data.total) * 100) }}</span> %
      </p> -->
    </div>
    <div style="display: flex; justify-content: space-between; height: 2vh; font-size: 0.9vw">
      <div style="margin-left: 1.5vw; color: #d1dd5f">今日新增</div>
      <div style="color: #00baba">待维修</div>
      <div style="margin-right: 2vw; color: #00a2da">已完成</div>
    </div>
    <div class="work-charts" ref="workCharts" style="height: 25vh"></div>
  </div>
</template>

<style scoped lang="scss">
@import "../../index.scss";
#work-list {
  width: 100%;
  height: 42vh;
  .work-info {
    // display: flex;
    // flex-wrap: wrap;
    // align-items: center;
    // justify-content: center;
    width: 100%;
    height: 15vh;

    // overflow: hidden;
    background: url("../../assets/images/Group.png") no-repeat;
    background-size: 100% 100%;
    p {
      display: flex;
      flex: 50%;
      align-items: center;
      justify-content: flex-start;
      height: 5vh;
      padding: 1vh 0.5vw;
      font-size: 0.9vw;
      line-height: 5vh;
      color: #b2b2b2;
      .info-label {
        width: 5vw;
        text-align: right;
      }
      .info-number {
        margin-right: 0.5vw;
        font-family: "DSI2";
        font-size: 1.5vw;
        font-weight: bolder;
        color: var(--el-color-primary-light-2);
        text-shadow: 1px 1px 1px 1px #000000;
      }
    }
  }
  .work-charts {
    width: 50vw;
    height: 23vh;
    background-color: transparent;
  }
}
</style>
