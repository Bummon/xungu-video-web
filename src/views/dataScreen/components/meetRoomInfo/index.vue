<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
import { DataScreenHttp } from "@/api/modules/dataScreen";
import { useGlobalStore } from "@/stores/modules/global";
import { RoomHttp } from "@/api/modules/control/meetRoom";

type EChartsOption = echarts.EChartsOption;
let roomCharts = ref();
const globalStore = useGlobalStore();
let option: EChartsOption;
let topThreeList = ref();
const data = ref();

onMounted(() => {
  init();
});

async function init() {
  data.value = (await DataScreenHttp.getMeetingRoomCountListByType()).data;
  console.log("会议室", data.value);
  data.value.forEach(item => {
    item.value = item.total;
    item.name = item.dataType;
  });
  option = {
    color: [globalStore.primary, "#4E93F9", "#5EFDB2", "#fff", "rgba(39,179,222,0.9)", "#ad3826"],
    title: {
      text: "会议室类型统计",
      left: "center",
      top: 0,
      textStyle: {
        color: "#fff",
        fontFamily: "Microsoft YaHei",
        fontStyle: "normal",
        fontWeight: "normal"
      }
    },

    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0,0,0,.9)",
      textStyle: {
        color: "#fff",
        fontFamily: "Microsoft YaHei",
        fontStyle: "normal",
        fontWeight: "normal"
      }
    },
    legend: {
      orient: "vertical",
      left: "0",
      textStyle: {
        color: "#fff"
      }
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: [50, 100],
        center: ["50%", "50%"],
        roseType: "area",
        data: data.value,
        left: "auto",
        top: "auto",
        label: {
          color: "#fff",
          show: true,
          formatter: "{b}: {c}" // {b} 表示名称，{c} 表示数值
        },
        // 高亮状态的扇区和标签样式。
        emphasis: {
          itemStyle: {
            shadowBlur: 2,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.9)" // 圆饼的阴影
          }
        }
      }
    ]
  };
  let myChart = echarts.init(roomCharts.value);
  option && myChart.setOption(option);
  // 获取近三十天  会议室使用率排行榜
  let params = getDateParams();
  topThreeList.value = (await RoomHttp.getTopThree(params)).data;
  console.log("tipthree", topThreeList.value);
}

function getDateParams() {
  // 获取当前日期
  const currentDate = new Date();

  // 获取30天前的日期
  const thirtyDaysAgoDate = new Date();
  thirtyDaysAgoDate.setDate(currentDate.getDate() - 30);

  // 将日期格式化为字符串（如果需要）
  const currentDateStr = currentDate.toISOString().slice(0, 10); // 格式：YYYY-MM-DD
  const thirtyDaysAgoDateStr = thirtyDaysAgoDate.toISOString().slice(0, 10); // 格式：YYYY-MM-DD
  return { start: thirtyDaysAgoDateStr, end: currentDateStr };
}
</script>

<template>
  <div id="room-info">
    <div class="room-charts" ref="roomCharts"></div>
    <div class="top-three">
      <div>热门会议室</div>
      <ul>
        <!--        <li><span class="roomName-text">会议室</span><span class="roomTime-text">近三十天次数</span></li>-->
        <li v-for="item in topThreeList" :key="item.roomName">
          <span class="roomName-text">{{ item.roomName }}</span
          ><span class="roomTime-text">{{ item.timesOfUse }}次</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../index.scss";
#room-info {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36vw;
  height: 33vh;
  padding-bottom: 2vh;
  margin: 0 auto;
  .room-charts {
    width: 25vw;
    height: 30vh;
    margin: 0 auto;
  }
  .top-three {
    width: 12vw;
    height: 100%;
    color: #ffffff;
    text-align: center;
    background-color: rgb(255 255 255 / 10%);
    div {
      height: 5vh;
      line-height: 5vh;
      background: #2992af;
    }
    ul {
      padding: 0;
      margin-top: 0.5vh;
    }
    li {
      display: flex;
      justify-content: space-around;
      margin: 0.5vh auto;
      font-size: 14px;
      .roomName-text {
        width: 60%;
        padding: 1vh 0;
        margin-right: 2%;
        background: #276791;
      }
      .roomTime-text {
        width: 35%;
        padding: 1vh 0;
        background: #276791;
      }
    }
  }
}
</style>
