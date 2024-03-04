<script setup lang="ts" name="columnChart">
import * as echarts from "echarts";
import { ref, onMounted, defineComponent } from "vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import { DataScreenHttp } from "@/api/modules/dataScreen";
import { useGlobalStore } from "@/stores/modules/global";

const globalStore = useGlobalStore();
defineComponent({
  components: {
    Vue3SeamlessScroll
  }
});
type EChartsOption = echarts.EChartsOption;

let chartContainer = ref();
let infolist = ref([]);
let totalList = ref([]);
let chartsList: chartsListType; // 渲染用的数据
let time = new Date()
  .toLocaleString("zh", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
  .replace(/\//g, "-");
let option: EChartsOption;

onMounted(async () => {
  await init();
  option = {
    color: ["rgba(25, 118, 245, 1)", "#fff", "rgba(71, 241, 252, 1)", "rgba(249, 185, 47, 1)"],
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(11,11,11,0.9)",
      textStyle: {
        color: "#fff",
        fontFamily: "Microsoft YaHei",
        fontStyle: "normal",
        fontWeight: "normal"
      },
      borderWidth: 0,
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    legend: {
      textStyle: {
        color: "#fff"
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "value",

      splitNumber: 5, // 分成5段  自动推断
      minInterval: 1, // 最小刻度为1
      // 刻度
      axisLabel: {
        color: "#fff",
        fontSize: 12,
        showMinLabel: false
      }
    },
    yAxis: {
      type: "category",
      data: chartsList.nameList,
      nameTextStyle: {
        color: "#fff"
      },
      // 刻度
      axisLabel: {
        color: "#ffffff",
        fontSize: 12,
        lineHeight: 12
      }
    },
    series: [
      {
        name: "提示",
        type: "bar",
        stack: "total",
        label: {
          show: true
        },
        emphasis: {
          focus: "series"
        },
        data: chartsList.firstList
      },
      {
        name: "一般",
        type: "bar",
        stack: "total",
        label: {
          show: true
        },
        emphasis: {
          focus: "series"
        },
        data: chartsList.secondList
      },
      {
        name: "重要",
        type: "bar",
        stack: "total",
        label: {
          show: true
        },
        emphasis: {
          focus: "series"
        },
        data: chartsList.threeList
      },
      {
        name: "紧急",
        type: "bar",
        stack: "total",
        label: {
          show: true
        },
        emphasis: {
          focus: "series"
        },
        data: chartsList.fourList
      }
    ]
  };
  chartContainer.value.style.backgroundColor = "transparent";
  let dangerCharts = echarts.init(chartContainer.value); // 使用.value访问DOM元素
  option && dangerCharts.setOption(option);
});

async function init() {
  infolist.value = (await DataScreenHttp.getAlarmDetailListByType(time, time)).data;
  totalList.value = (await DataScreenHttp.getAlarmCountListByType(time, time)).data;
  chartsList = transData(totalList.value);
  console.log("告警", chartsList);
}

interface chartsListType {
  nameList: typeName[];
  firstList: numberNull[];
  secondList: numberNull[];
  threeList: numberNull[];
  fourList: numberNull[];
}

type numberNull = number | null;

interface typeName {
  value: string;
}

interface numTmp {
  first: number | null;
  second: number | null;
  three: number | null;
  four: number | null;
}

function transData(data: any[]): chartsListType {
  let list: chartsListType = { nameList: [], firstList: [], secondList: [], threeList: [], fourList: [] };
  let numList: numTmp[] = [];
  data.forEach(item => {
    let tmp = { value: item.dataType };
    list.nameList.push(tmp);
    let tmpChild = {
      first: null,
      second: null,
      three: null,
      four: null
    };
    if (item.children && item.children.length > 0) {
      item.children.forEach(child => {
        if (child.dataName === "紧急") {
          tmpChild.four = child.total;
        }
        if (child.dataName === "重要") {
          tmpChild.three = child.total;
        }
        if (child.dataName === "一般") {
          tmpChild.second = child.total;
        }
        if (child.dataName === "提示") {
          tmpChild.first = child.total;
        }
      });
    }
    numList.push(tmpChild);
  });
  numList.forEach(num => {
    list.firstList.push(num.first);
    list.secondList.push(num.second);
    list.threeList.push(num.three);
    list.fourList.push(num.four);
  });
  return list;
}
</script>
<template>
  <div id="danger-container">
    <div ref="chartContainer" style="height: 22vh"></div>
    <div class="" v-if="infolist.length > 0">
      <vue3-seamless-scroll :list="infolist" class="danger-list">
        <ul class="item">
          <li v-for="(item, index) in infolist" :key="index">
            <span class="roomName" v-text="item.roomName"></span>
            <span class="typeName" v-text="item.typeName"></span>
            <span class="alarmTypeName" v-text="item.alarmTypeName"></span>
            <span class="alarmLevel" v-text="item.alarmLevel"></span>
            <span class="date" v-text="item.createTime"></span>
          </li>
        </ul>
      </vue3-seamless-scroll>
    </div>
    <div class="empty-info" v-else>当日暂无告警信息</div>
  </div>
</template>

<style scoped lang="scss">
@import "../../index.scss";
#danger-container {
  height: 42vh;
  overflow: hidden;
  border-radius: 10px;
  .empty-info {
    width: 26vw;
    height: 18vh;
    padding: 1vh 0;
    margin: 0 auto;
    overflow: hidden;
    font-size: 0.9vw;
    line-height: 15vh;
    color: #ffffff;
    text-align: center;
    background-color: rgb(0 0 0 / 20%);
  }
  .danger-list {
    width: 26vw;
    height: 19vh;
    padding: 1vh 0;
    margin: 0 auto;
    overflow: hidden;
    color: #000000;
    background-color: rgb(0 0 0 / 20%);
    .item {
      li {
        display: flex;
        overflow: hidden;
        font-size: 0.7vw;
        text-overflow: ellipsis;
        white-space: nowrap;
        .roomName {
          width: 7em;
          color: #b7b7b7;
        }
        .typeName {
          width: 6.5em;
          color: #e2dede;
        }
        .alarmTypeName {
          width: 5em;
          color: #b7b7b7;
        }
        .alarmLevel {
          width: 2.5em;
          margin: 0 2px;
          color: $font-color-primary;
        }
        .date {
          color: #e2dede;
        }
      }
    }
  }
}
</style>
