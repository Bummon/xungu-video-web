<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref, onUnmounted } from "vue";
import $node from "@/api/nodeServer.ts";
import { useGlobalStore } from "@/stores/modules/global";

const globalStore = useGlobalStore();
type EChartsOption = echarts.EChartsOption;
const cpu1 = ref();
const cpu2 = ref();
let option1: EChartsOption;
let option2: EChartsOption;
const memory = ref(50); // 内存使用率
const cpuData = ref(20); // cpu使用率
const usedProcess = ref(); // 磁盘使用率
const diskUsed = ref(0); //磁盘已使用
const diskTotal = ref(0); // 磁盘总储量
let timer = null; // 定时器
let myChart2;
let myChart1;
onMounted(async () => {
  myChart2 = echarts.init(cpu2.value);
  myChart1 = echarts.init(cpu1.value);
  await init();

  timer = setInterval(async () => {
    await init();
  }, 3000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

async function init() {
  let res = await $node.get("/api/serverStatus");
  if (res?.code === 200) {
    // 赋值 cpu  内存
    cpuData.value = res.data.cpu.toFixed(1);
    memory.value = res.data.mem.usedMemPercentage.toFixed(1);
    // 赋值 磁盘
    let useDisk = 0;
    let totalDisk = 0;
    if (res.data?.drive && res.data.drive.constructor === Array && res.data.drive.length > 0) {
      res.data.drive.forEach(item => {
        useDisk += item.used / 1024 / 1024 / 1024;
        totalDisk += item.size / 1024 / 1024 / 1024;
      });
      diskUsed.value = Number(useDisk.toFixed(2));
      diskTotal.value = Number(totalDisk.toFixed(2));
      let diskPercentage = Math.floor((useDisk / totalDisk) * 100) / 100;
      if (usedProcess.value?.style) {
        usedProcess.value.style.width = `${diskPercentage * 20}vw`; // 满额度是二十
      }
    }

    option2 = {
      series: [
        {
          type: "gauge",
          radius: "100%",
          center: ["50%", "80%"],
          // 主数据颜色
          itemStyle: {
            color: globalStore.primary
          },
          progress: {
            show: true,
            width: 25,
            itemStyle: {
              color: "rgba(71, 241, 252, .5)"
            }
          },

          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 1
            }
          },
          axisTick: {
            distance: -1,
            splitNumber: 5,
            lineStyle: {
              width: 1,
              color: "#47f1fc" // 最外圈的齿轮
            }
          },
          // 长柱子刻度
          splitLine: {
            distance: 40,
            length: 1
          },
          // 外圈的文字
          axisLabel: {
            distance: -22,
            color: "#fff",
            fontSize: 10
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: "60%",
            lineHeight: 20,
            borderRadius: 8,
            offsetCenter: [0, "-15%"],
            fontSize: 23,
            fontWeight: "normal",
            formatter: "{value}%",
            color: "inherit"
          },
          data: [
            {
              value: memory.value
            }
          ]
        },

        {
          type: "gauge",
          center: ["50%", "80%"],
          startAngle: -180,
          endAngle: 0,
          min: 0,
          max: 100,
          // itemStyle: {
          //   color: "rgb(163,163,163)"
          // },
          // progress: {
          //   show: true,
          //   width: 4
          // },

          pointer: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value: 100
            }
          ]
        }
      ]
    };
    option1 = {
      series: [
        {
          type: "gauge",
          radius: "100%",
          center: ["50%", "80%"],
          // 主数据颜色
          itemStyle: {
            color: globalStore.primary
          },
          progress: {
            show: true,
            width: 25,
            itemStyle: {
              color: "rgba(71, 241, 252, .5)"
            }
          },

          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 1
            }
          },
          axisTick: {
            distance: -1,
            splitNumber: 5,
            lineStyle: {
              width: 1,
              color: "#47f1fc" // 最外圈的齿轮
            }
          },
          // 长柱子刻度
          splitLine: {
            distance: 40,
            length: 1
          },
          // 外圈的文字
          axisLabel: {
            distance: -22,
            color: "#fff",
            fontSize: 10
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: "60%",
            lineHeight: 20,
            borderRadius: 8,
            offsetCenter: [0, "-15%"],
            fontSize: 23,
            fontWeight: "normal",
            formatter: "{value}%",
            color: "inherit"
          },
          data: [
            {
              value: cpuData.value
            }
          ]
        },

        {
          type: "gauge",
          center: ["50%", "80%"],
          startAngle: -180,
          endAngle: 0,
          min: 0,
          max: 100,
          // itemStyle: {
          //   color: "rgb(163,163,163)"
          // },
          // progress: {
          //   show: true,
          //   width: 4
          // },

          pointer: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value: 100
            }
          ]
        }
      ]
    };

    if (option2 && typeof option2 === "object") {
      myChart2.setOption(option2);
    }
    if (option1 && typeof option1 === "object") {
      myChart1.setOption(option1);
    }
  }
}
</script>

<template>
  <div id="server-equipment">
    <div class="cpu_container">
      <div class="cpu">
        <p>CPU</p>
        <div ref="cpu1" class="cpu-chart"></div>
      </div>
      <div class="cpu">
        <p>内存</p>
        <div ref="cpu2" class="cpu-chart"></div>
      </div>
    </div>
    <div class="dask-container">
      <p class="dask-title">磁盘</p>
      <p class="dask-detail">已使用：{{ diskUsed }}G / 总计：{{ diskTotal }}G</p>
      <div class="dask-process">
        <div class="process-background">
          <div class="process-used" ref="usedProcess">
            <!-- <span class="cloud"></span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../index.scss";
#server-equipment {
  height: 33vh;
  p {
    font-size: 0.9vw;
    color: #ffffff;
    text-shadow: 1px 1px 0 #0e0e0e;
  }
  .cpu_container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 21vh;
    color: #ffffff;

    // background-color: rgb(13 9 9 / 15%);
    .cpu {
      width: 10vw;
      p {
        width: 3vw;
        height: 4vh;
        color: #47f1fc;
        text-align: center;
        background: url("../../assets/images/cpu.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .cpu-chart {
      height: 16vh;
    }
  }
  .dask-container {
    height: 18vh;
    .dask-title {
      width: 3vw;

      // color: #ffffff;
      height: 4vh;
      color: #47f1fc;
      text-align: center;
      background: url("../../assets/images/cpu.png") no-repeat;
      background-size: 100% 100%;
    }
    .dask-detail {
      font-family: ROBOT;
      font-size: 0.8vw;
      text-align: right;
      letter-spacing: 2px;
    }
    .dask-process {
      display: flex;
      align-items: center;
      width: 25vw;
      height: 2vh;
      margin: 0 auto;

      // background-color: rgb(0 0 0 / 80%);
      border-radius: 2.5vh;
      .process-background {
        position: relative;
        width: 25vw;
        height: 2vh;
        margin: 0 auto;
        background-color: transparent;

        // box-shadow: 2px 2px 2px 0 #000000;
        border: 2px solid #47f1fc;
        border-radius: 2vh;
        .process-used {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          height: 100%;
          background-color: $main-color-primary;
          border-top-left-radius: 2vh;
          border-bottom-left-radius: 2vh;
          .cloud {
            position: absolute;
            top: -3vh;
            right: -2vh;
            z-index: 999;
            width: 4vh;
            height: 4vh;
            background-image: url("../../assets/png/cloud.png");
            background-repeat: no-repeat;
            background-size: 100%;
          }
        }
      }
    }
  }
}
:deep(.el-progress) {
  .el-progress-bar__outer {
    background-color: rgb(0 0 0 / 60%);
  }
}
</style>
