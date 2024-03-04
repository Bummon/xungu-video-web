<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, defineProps } from "vue";
import { useGlobalStore } from "@/stores/modules/global";
import { RoomHttp } from "@/api/modules/control/meetRoom";

const props = defineProps({
  id: Number
});

const globalStore = useGlobalStore();
type EChartsOption = echarts.EChartsOption;
let roomCharts = ref();

let option: EChartsOption;

onMounted(async () => {
  if (props.id) {
    let { contents } = (await RoomHttp.getCountRoomsBySourceType({ roomId: props.id })).data;
    let resultArray = [];
    if (contents && contents.constructor === Array && contents.length > 0) {
      resultArray = Object.keys(contents[0]).map(key => {
        if (["会议室名称", "会议室ID", "设备总数"].includes(key)) {
          return;
        }
        return {
          name: key,
          value: contents[0][key]
        };
      });
    }
    let myChart = echarts.init(roomCharts.value);

    option = {
      color: [
        globalStore.primary,
        "#8e8e8e",
        "rgb(3,162,3)",
        "#4ff0d0",
        "rgba(5,8,5,0.9)",
        "#b2c745",
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#287eee",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc"
      ],
      title: {
        text: "会议类型统计",
        left: "center",
        textStyle: {
          color: "#fff",
          fontFamily: "Microsoft YaHei",
          fontStyle: "normal",
          fontWeight: "normal"
        }
      },

      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(0,0,0,.7)",
        textStyle: {
          color: "#fff",
          fontFamily: "Microsoft YaHei",
          fontStyle: "normal",
          fontWeight: "normal"
        }
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          color: "#fff"
        }
      },
      series: [
        {
          name: "Nightingale Chart",
          type: "pie",
          radius: [50, 90],
          center: ["50%", "50%"],

          itemStyle: {
            borderRadius: 1
          },
          // radius: "50%",
          data: resultArray,
          label: {
            color: "#fff",
            formatter: "{b}: {c}" // {b} 表示名称，{c} 表示数值
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 2,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.9)"
            }
          }
        }
      ]
    };
    option && myChart.setOption(option);
  }
});
</script>

<template>
  <div id="room-vip">
    <div class="room-charts" ref="roomCharts"></div>
  </div>
</template>

<style scoped lang="scss">
@import "../../index.scss";
#room-vip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38vw;
  height: 33vh;
  margin: 0 auto;
  border-radius: 8px;
  .room-charts {
    width: 35vw;
    height: 33vh;
    margin: 0 10px;
  }
}
</style>
