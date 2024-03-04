<script setup lang="ts">
import { ref, computed, watch } from "vue";

const period = ref<1 | 2 | 3>(1);
let arr = ref(["0", "0", "1", "*", "*", "?", "*"]);

const props = defineProps({
  cron: String,
  change: Function
});
/**
 * 监听切换类目后 初始值变化
 */
watch(period, (newVal, oldVal) => {
  console.log(`Message changed from "${oldVal}" to "${newVal}"`);
  if (newVal === 1) {
    // 选择每天后
    arr.value[5] = "?";
    arr.value[3] = "*";
  }
  if (newVal === 2) {
    arr.value[3] = "?";
    arr.value[5] = "1";
  }
  if (newVal === 3) {
    arr.value[5] = "?";
    arr.value[3] = "1";
  }
});
// 计算成cron表达式
let str = computed(() => {
  return arr.value.join(" ");
});
watch(str, (newVal, oldVal) => {
  console.log("监听到str数值变化", str.value);
  props.change(str.value);
});
let hourList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
let weekList = [1, 2, 3, 4, 5, 6, 7];
let monthList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
];
let weekArr = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"];

const initCron = (cron: string) => {
  if (!cron) {
    arr.value = ["0", "0", "1", "*", "*", "?", "*"];
  } else {
    arr.value = cron.split(" ");
    arr.value[0] = "0"; // 不允许设置秒数 默认0
    arr.value[1] = "0"; // 不允许设置分钟 默认0
    arr.value[4] = "*"; // 不允许设置月份
    arr.value[6] = "*"; // 不允许设置年份
    if (arr.value[5] !== "?" && arr.value[3] === "?") {
      // 每周  5号位是星期
      period.value = 2;
    } else if (arr.value[5] === "?" && arr.value[3] !== "?") {
      // 每月  3号位是 几号
      period.value = 3;
    } else {
      period.value = 1;
    }
  }
};

initCron(props.cron);
</script>

<template>
  <div class="select-container" id="corn">
    <el-row style="display: block">
      <el-radio-group v-model="period" style="display: flex">
        <el-radio :label="1">每天</el-radio>
        <el-radio :label="2">每周</el-radio>
        <el-radio :label="3">每月</el-radio>
      </el-radio-group>
    </el-row>
    <el-row>
      <div v-if="period === 1" class="period-detail">
        <div class="hour-list">
          <div
            class="hour-item"
            v-for="item in hourList"
            :key="item"
            @click="arr[2] = item.toString()"
            :class="item.toString() === arr[2] ? 'active' : ''"
          >
            {{ item }}点
          </div>
        </div>
      </div>
      <div v-if="period === 2" class="period-detail">
        选择星期
        <div class="week-list">
          <div
            class="week-item"
            v-for="(item, index) in weekList"
            :key="item"
            @click="arr[5] = item.toString()"
            :class="item.toString() === arr[5] ? 'active' : ''"
          >
            {{ weekArr[index] }}
          </div>
        </div>
        选择小时
        <div class="hour-list">
          <div
            class="hour-item"
            v-for="item in hourList"
            :key="item"
            @click="arr[2] = item.toString()"
            :class="item.toString() === arr[2] ? 'active' : ''"
          >
            {{ item }}点
          </div>
        </div>
      </div>
      <div v-if="period === 3" class="period-detail">
        <div class="month-list">
          <div
            class="month-item"
            v-for="item in monthList"
            :key="item"
            @click="arr[3] = item.toString()"
            :class="item.toString() === arr[3] ? 'active' : ''"
          >
            {{ item }}日
          </div>
        </div>
        选择小时
        <div class="hour-list">
          <div
            class="hour-item"
            v-for="item in hourList"
            :key="item"
            @click="arr[2] = item.toString()"
            :class="item.toString() === arr[2] ? 'active' : ''"
          >
            {{ item }}点
          </div>
        </div>
      </div>
      <div class="result-list">
        <p>
          表达式: <span style="color: red">{{ str }}</span>
        </p>
        <p class="result-text">
          执行时间：<span v-if="arr[5] !== '*' && arr[5] !== '?'">每周{{ weekArr[Number(arr[5]) - 1] }}</span>
          <span v-if="arr[3] === '*'">每天</span>
          <span v-if="arr[3] !== '*' && arr[3] !== '?'">每月{{ arr[3] }}号</span>
          <span>{{ arr[2] }}点钟执行</span>
        </p>
      </div>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
p,
div,
span {
  cursor: pointer;
}
.week-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .week-item {
    width: 6vh;
    height: 3vh;
    margin: 1px;
    color: #ffffff;
    text-align: center;
    background-color: var(--el-color-primary);
  }
}
.hour-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 15vh;
  .hour-item {
    width: 5vh;
    height: 3vh;
    margin: 1px;
    line-height: 3vh;
    color: #ffffff;
    text-align: center;
    background-color: var(--el-color-primary);
    border-radius: 5px;
  }
}
.month-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 15vh;
  .month-item {
    width: 5vh;
    height: 3vh;
    margin: 1px;
    color: #ffffff;
    text-align: center;
    background-color: var(--el-color-primary);
  }
}
#corn {
  .month-list .active,
  .hour-list .active,
  .week-list .active {
    background-color: #ffcd05;
  }
}
.result-list {
  display: block;
  p {
    display: block;
  }
  .result-text {
    span {
      margin: 0 5px;
      font-weight: bold;
      color: #0d9047;
      letter-spacing: 1px;
    }
  }
}
</style>
