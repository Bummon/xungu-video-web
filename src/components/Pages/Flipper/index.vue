<template>
  <div class="go-flipper" :class="[flipType, { go: isFlipping }]">
    <div class="digital front" :data-front="frontTextFromData"></div>
    <div class="digital back" :data-back="backTextFromData"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType, watch, nextTick } from "vue";
import { FlipType } from "./index";

const props = defineProps({
  flipType: {
    type: String as PropType<FlipType>,
    default: () => {
      return "down";
    }
  },
  count: {
    type: [Number, String],
    default: 0
  },
  duration: {
    type: Number,
    default: 600
  },
  width: {
    type: Number,
    default: 60
  },
  height: {
    type: Number,
    default: 100
  },
  radius: {
    type: Number,
    default: 10
  },
  frontColor: {
    type: String,
    default: "#ffffff"
  },
  backColor: {
    type: String,
    default: "#000000"
  },
  borderWidth: {
    type: Number,
    default: 2
  }
});

const isFlipping = ref(false);
const frontTextFromData = ref(props.count || 0);
const backTextFromData = ref(props.count || 0);

let timeoutID: any = 0;

// 翻牌
const flip = async (front: string | number, back: string | number) => {
  // 如果处于翻转中，则不执行
  if (isFlipping.value) {
    isFlipping.value = false; // 立即结束此次动画
    clearTimeout(timeoutID); // 清除上一个计时器任务
    await nextTick();
    await flip(front, back); // 开始最后一次翻牌任务
    return;
  }

  // 设置翻盘前后数据
  backTextFromData.value = back;
  frontTextFromData.value = front;
  // 设置翻转状态为true
  isFlipping.value = true;

  // 翻牌结束的行为
  timeoutID = setTimeout(() => {
    isFlipping.value = false; // 设置翻转状态为false
    frontTextFromData.value = back;
  }, props.duration);
};

watch(
  () => props.count,
  (newVal, oldVal) => {
    flip(oldVal as string | number, newVal as string | number);
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
$front-color: v-bind("props.frontColor");
$back-color: v-bind("props.backColor");
$radius: v-bind("`${props.radius}px`");
$width: v-bind("`${props.width}px`");
$height: v-bind("`${props.height}px`");
$perspective: v-bind("`${props.height * 2}px`");
$border-width: v-bind("`${props.borderWidth * 2}px`");
$speed: v-bind("`${props.duration / 1000}s`");
$shadow-color: #000000;
$line-color: #4a9ef8;

// #region 动画效果
@keyframes front-flip-down {
  0% {
    transform: perspective($perspective) rotateX(0deg);
  }
  100% {
    transform: perspective($perspective) rotateX(-180deg);
  }
}

@keyframes back-flip-down {
  0% {
    transform: perspective($perspective) rotateX(180deg);
  }
  100% {
    transform: perspective($perspective) rotateX(0deg);
  }
}

@keyframes front-flip-up {
  0% {
    transform: perspective($perspective) rotateX(0deg);
  }
  100% {
    transform: perspective($perspective) rotateX(180deg);
  }
}

@keyframes back-flip-up {
  0% {
    transform: perspective($perspective) rotateX(-180deg);
  }
  100% {
    transform: perspective($perspective) rotateX(0deg);
  }
}

// #endregion
.go-flipper {
  position: relative;
  display: inline-block;
  width: $width;
  height: $height;
  font-size: $width;
  line-height: $height;
  color: $front-color;
  text-align: center;
  background: $front-color;
  border-radius: $radius;
  box-shadow: 0 0 6px rgba($color: $shadow-color, $alpha: 50%); // 阴影部分

  // font-family: 'Helvetica Neue';
  &::after {
    position: absolute;
    inset: 0;
    z-index: 10;
    content: "";
    border-radius: $radius;
    box-shadow: inset 0 0 $border-width 0 $front-color; // 内测阴影部分
  }
  .digital::before,
  .digital::after {
    position: absolute;
    right: 0;
    left: 0;
    box-sizing: border-box;
    overflow: hidden;
    content: "";
    background: $back-color;
  }
  .digital.front::before,
  .digital.front::after {
    content: attr(data-front) !important;
  }
  .digital.back::before,
  .digital.back::after {
    content: attr(data-back) !important;
  }
  .digital::before {
    top: 0;
    bottom: 50%;
    border-bottom: solid 1px rgba($color: $line-color, $alpha: 30%); // 中间线颜色
    border-radius: $radius $radius 0 0;
  }
  .digital::after {
    top: 50%;
    bottom: 0;
    line-height: 0;
    border-radius: 0 0 $radius $radius;
  }

  /* 向下翻 */
  &.down .front::before {
    z-index: 3;
  }
  &.down .back::after {
    z-index: 2;
    transform: perspective($perspective) rotateX(180deg);
    transform-origin: 50% 0%;
  }
  &.down .front::after,
  &.down .back::before {
    z-index: 1;
  }
  &.down.go .front::before {
    box-shadow: 0 -2px $border-width 0 $front-color;
    transform-origin: 50% 100%;
    animation: front-flip-down $speed ease-in-out both;
    backface-visibility: hidden;
  }
  &.down.go .back::after {
    box-shadow: 0 2px $border-width 0 $front-color;
    animation: back-flip-down $speed ease-in-out both;
    backface-visibility: hidden;
  }

  /* 向上翻 */
  &.up .front::after {
    z-index: 3;
  }
  &.up .back::before {
    z-index: 2;
    transform: perspective($perspective) rotateX(-180deg);
    transform-origin: 50% 100%;
  }
  &.up .front::before,
  &.up .back::after {
    z-index: 1;
  }
  &.up.go .front::after {
    box-shadow: 0 2px $border-width 0 $front-color;
    transform-origin: 50% 0;
    animation: front-flip-up $speed ease-in-out both;
    backface-visibility: hidden;
  }
  &.up.go .back::before {
    box-shadow: 0 -2px $border-width 0 $front-color;
    animation: back-flip-up $speed ease-in-out both;
    backface-visibility: hidden;
  }
}
</style>
