<template>
  <div class="message">
    <el-popover placement="bottom" :width="'18vw'" trigger="click">
      <template #reference>
        <el-badge :value="len" class="item" :hidden="len === 0">
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <div class="check-all">
        <el-button type="primary" link @click="changeStatus">一键已读</el-button>
      </div>
      <el-tabs v-model="page">
        <el-tab-pane :label="label" name="first" style="position: relative">
          <div class="message-list">
            <div class="message-item" v-for="item in noticeList" :key="item" @click="jumpToOrder(item)" style="cursor: pointer">
              <img src="@/assets/images/msg01.png" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">{{ item.content.replace("工单号[", "").replace("(", "").replace("]）", "") }}</span>
                <div class="message-item-bottom">
                  <span class="message-date">{{ item.createTime }}</span>
                  <span class="message-status" :style="item.noticeStatus === 1 ? 'color:gray;' : 'color:#950409;'">{{
                    item.noticeStatus === 1 ? "已读" : "未读"
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";

import { WorkOrder } from "@/api/interface/work";
import { useRouter } from "vue-router";
import { OrderHttp } from "@/api/modules/work/order";

interface NoticeProps {
  noticeList: WorkOrder.notice[];
  label?: string;
  len: number;
  update: Function;
}

const router = useRouter();

const props = withDefaults(defineProps<NoticeProps>(), {
  noticeList: () => [],
  label: "通知",
  len: 0,
  update: () => {}
});

const page = ref("first");

/**
 * 跳往工单页面
 * @param val
 */
async function jumpToOrder(val) {
  console.log("val", val);
  await OrderHttp.changeNoticeStatus({ noticeId: val.noticeId, noticeStatus: 1 });
  router.push("/work/order");
}

/**
 * 一键已读
 * @description 把所有的未读消息全部变成已读
 */
async function changeStatus() {
  let list = props.noticeList.filter(n => n.noticeStatus === 0);
  if (list.constructor === Array && list.length > 0) {
    /**
     *  forEach是异步循环  渲染主线程不会等待它异步全部执行完 再执行它后面的语句 而是丢到微队列中等待  所以需要网络请求的地方 不能使用forEach
     *  for of 可以遍历【可迭代】对象  允许插入await异步等待  串行的所有请求都完成后  再执行后面的语句
     */
    for (let item of list) {
      await OrderHttp.changeNoticeStatus({ noticeId: item.noticeId, noticeStatus: 1 });
    }
    props.update();
  }
}
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}
.check-all {
  position: absolute;
  top: 2vh;
  right: 1vw;
  z-index: 22;
}
.message-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 50vh;
  padding: 0 0.5vw;
  overflow-x: hidden;
  overflow-y: scroll;
  .message-item {
    display: flex;
    align-items: center;
    padding: 1vh 0;
    border-bottom: 1px solid var(--el-border-color-light);
    &:last-child {
      border: none;
    }
    .message-icon {
      width: 2vw;
      height: 2vw;
      margin: 0 1vw 0 5px;
    }
    .message-content {
      display: flex;
      flex-direction: column;
      .message-title {
        width: 10vw;
        margin-bottom: 5px;
        font-size: 13px;
        color: #0e0e0e;
      }
      .message-item-bottom {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 12vw;
        font-size: 12px;
        .message-date {
          width: 10vw;
          color: var(--el-text-color-secondary);
        }
        .message-status {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
</style>
