<template>
  <div class="wrap">
    <video class="video" muted autoplay controls ref="videoPlayer" :style="'width:' + props.width + 'px;'"></video>
  </div>
</template>

<script setup lang="ts">
import flvjs from "flv.js";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { nodeBaseURLWs } from "@/api/nodeServer"; // 引入flvjs
const player = ref();
const videoPlayer = ref();

const props = defineProps({
  url: {
    type: String
  },
  width: {
    type: Number,
    default: 300
  }
});
watch(
  () => props.url,
  (newVal, oldVal) => {
    console.log(`播放地址从${oldVal}转到${newVal}`);
    videoPlay(newVal);
  }
);
// let rtspTransURL = import.meta.env.VITE_NODE_WEBSOCKET;

let rtspTransURL = nodeBaseURLWs;

function videoPlay(url) {
  // 如果浏览器支持flvjs，则执行相应的程序
  if (flvjs.isSupported()) {
    if (player.value) {
      player.value.destroy(); // 先销毁前面的
    }
    videoPlayer.value.removeEventListener("process", () => console.log("移除process监听事件"));
    videoPlayer.value.removeEventListener("play", () => console.log("移除play监听事件"));
    // 下面的ws://localhost:8888换成你搭建的websocket服务地址，后面加上设备流地址
    player.value = flvjs.createPlayer(
      {
        type: "flv",
        isLive: true,
        url: rtspTransURL + url
      },
      {
        enableWorker: false, // 启用分离的线程进行转换
        enableStashBuffer: false // 关闭IO隐藏缓冲区
        // stashInitialSize: 128 // 减少首帧显示等待时长
      }
    );

    player.value.on("error", e => {
      console.log(e);
    });

    // 将实例挂载到video元素上面
    player.value.attachMediaElement(videoPlayer.value);

    try {
      // 开始运行加载 只要流地址正常 就可以在h5页面中播放出画面了
      player.value.load();
      player.value.play();
      videoPlayer.value.addEventListener("progress", () => {
        if (player.value.buffered && player.value.buffered.length > 0) {
          // buffered 是一个 TimeRanges 对象，它表示音频/视频的缓冲时间范围。
          let end = player.value.buffered.end(0); //获取当前buffered值(缓冲区末尾)
          let delta = end - player.value.currentTime; //获取buffered与当前播放位置的差值
          // 延迟过大，通过跳帧的方式更新视频
          if (delta > 10 || delta < 0) {
            if (player.value.buffered.end(0) > 1) {
              player.value.currentTime = player.value.buffered.end(0) - 1;
            }
            return;
          }
          // 追帧
          if (delta > 1) {
            videoPlayer.value.playbackRate = 1.1;
          } else {
            videoPlayer.value.playbackRate = 1;
          }
        }
      });
      // 点击播放按钮后，更新视频
      videoPlayer.value.addEventListener("play", () => {
        if (player.value.buffered && player.value.buffered.length > 0 && player.value.buffered.end(0) > 1) {
          player.value.currentTime = player.value.buffered.end(0) - 1;
        }
      });

      // 网页重新激活后，更新视频
      window.onfocus = () => {
        if (player.value.e !== null) {
          if (player.value?.buffered && player.value.buffered.length > 0 && player.value.buffered.end(0) > 1) {
            player.value.currentTime = player.value.buffered.end(0) - 1;
          }
        }
      };
    } catch (error) {
      console.log(error);
    }
  }
}

onMounted(() => {
  videoPlay(props.url);
});
onBeforeUnmount(() => {
  // 页面销毁前 关闭flvjs  不然卡死服务器
  if (player.value) {
    player.value.destroy();
  }
  videoPlayer.value.removeEventListener("process", () => console.log("移除process监听事件"));
  videoPlayer.value.removeEventListener("play", () => console.log("移除play监听事件"));
});
</script>

<style lang="scss" scoped>
.wrap {
  .video {
    width: 300px;
  }
}
</style>
