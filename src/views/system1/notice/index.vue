<script setup lang="ts">
import { ref } from "vue";
import { ElNotification } from "element-plus";
import { noticeHttp } from "@/api/modules/system1/notice";
import { XGHandleClose } from "@/hooks/useHandleData";
import Drawer from "./Drawer.vue";

const drawerRef = ref();
const emailMode = ref({
  startTime: "", //	开始时间	string(date-time)
  endTime: "", // 	结束时间	string(date-time)
  isCustom: 0, //	是否自定义时间	integer(int32)
  sendId: 0, // 发送通知id	integer(int64)
  sendStatus: 1, //	状态0禁用1启用
  type: 0 //	类型0邮件1短信	integer(int32)
});
const messageMode = ref({
  startTime: "", //	开始时间	string(date-time)
  endTime: "", // 	结束时间	string(date-time)
  isCustom: 0, //	是否自定义时间	integer(int32)
  sendId: 0, // 发送通知id	integer(int64)
  sendStatus: 1, //	状态0禁用1启用
  type: 1 //	类型0邮件1短信	integer(int32)
});
const messageData = ref([]);

const emailData = ref([
  {
    emailId: 1,
    emailName: "zhongyinxungu@163.com",
    authorizeCode: 23740581,
    serverAddress: "47.106.213.55",
    serverPort: 19999,
    emailStatus: 0
  }
]);

async function handleNoticeMode() {
  let list = (await noticeHttp.getNoticeMode()).data;
  emailMode.value = list.filter(item => item.type === 0)[0] || { sendStatus: 1 };
  messageMode.value = list.filter(item => item.type === 1)[0] || { sendStatus: 1 };
  console.log("邮箱方式", emailMode.value);
  console.log("短信方式", messageMode.value);
}

async function init() {
  emailData.value = (await noticeHttp.getEmail()).data;
  messageData.value = (await noticeHttp.getMessage()).data;
  // 更新通知方式
  await handleNoticeMode();
}

function deleteRow(tag, row) {
  if (tag === "email") {
    XGHandleClose(
      async () => {
        return new Promise((resolve, reject) => {
          noticeHttp
            .deleteEmail({ ids: [row.emailId] })
            .then(res => {
              console.log(res.data);
              resolve(true);
            })
            .catch(() => {
              reject(false);
            });
        });
      },
      `删除该项邮箱配置`,
      "删除成功"
    ).then(() => init());
  } else if (tag === "message") {
    XGHandleClose(
      async () => {
        return new Promise((resolve, reject) => {
          noticeHttp
            .deleteMessage({ ids: [row.messageId] })
            .then(res => {
              console.log(res.data);
              resolve(true);
            })
            .catch(() => {
              reject(false);
            });
        });
      },
      `删除该项短信配置`,
      "删除成功"
    ).then(res => {
      init();
    });
  }
}

/**
 * 启用服务
 */
function startServer(name: string) {
  if (name === "email") {
    XGHandleClose(
      () => {
        return new Promise((resolve, reject) => {
          emailMode.value.sendStatus = 1;
          noticeHttp
            .updateNoticeMode(emailMode.value)
            .then(async () => {
              await handleNoticeMode();
              resolve(true);
            })
            .catch(() => reject(false));
        });
      },
      `确认启用邮件通知功能`,
      "短信通知功能启用成功"
    );
  } else if (name === "message") {
    XGHandleClose(
      () => {
        return new Promise((resolve, reject) => {
          messageMode.value.sendStatus = 1;
          noticeHttp
            .updateNoticeMode(messageMode.value)
            .then(async () => {
              await handleNoticeMode();
              resolve(true);
            })
            .catch(() => reject(false));
        });
      },
      `确认启用短信通知功能`,
      "短信通知功能启用成功"
    );
  } else {
    console.log("无参数");
  }
}

/**
 * 停用服务
 * @param {string} name "message" | "email"
 */
function stopServer(name: string) {
  if (name === "email") {
    XGHandleClose(
      () => {
        return new Promise((resolve, reject) => {
          emailMode.value.sendStatus = 0;
          noticeHttp
            .updateNoticeMode(emailMode.value)
            .then(async () => {
              // 更新数据
              await handleNoticeMode();
              resolve(true);
            })
            .catch(() => reject(false));
        });
      },
      `确认停用邮件通知功能`,
      "短信通知功能已停用"
    );
  } else if (name === "message") {
    XGHandleClose(
      () => {
        return new Promise((resolve, reject) => {
          messageMode.value.sendStatus = 0;
          noticeHttp
            .updateNoticeMode(messageMode.value)
            .then(async () => {
              await handleNoticeMode();
              resolve(true);
            })
            .catch(() => reject(false));
        });
      },
      `确认停用短信通知功能`,
      "短信通知功能已停用"
    );
  } else {
    console.log("无参数");
  }
}

const openDrawer = (title: string, row = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api:
      title === "新增邮箱"
        ? noticeHttp.addEmail
        : title === "编辑邮箱"
        ? noticeHttp.updateEmail
        : title === "编辑短信"
        ? noticeHttp.updateMessage
        : title === "新增短信"
        ? noticeHttp.addMessage
        : undefined,
    updateData: init
  };
  drawerRef.value?.acceptParams(params);
};

/**
 * 切换启用停用状态
 * @param {"email"||"message"} tag
 * @param row
 */
async function changeStatus(tag: string, row) {
  if (tag === "email") {
    let res = await noticeHttp.changeEmailStatusById({ emailId: row.emailId, emailStatus: row.emailStatus });
    if (res.code === 200) {
      emailData.value = (await noticeHttp.getEmail()).data;
    }
  }
  if (tag === "message") {
    let res = await noticeHttp.changeMessageStatusById({
      messageId: row.messageId,
      messageStatus: row.messageStatus
    });
    if (res.code === 200) {
      messageData.value = (await noticeHttp.getMessage()).data;
    }
  }
}

/**
 * 修改通知类型
 * @param tag
 */
async function modifyNoticeMode(tag) {
  let res = await noticeHttp.updateNoticeMode(tag === "message" ? messageMode.value : tag === "email" ? emailMode.value : {});
  if (res.code === 200) {
    ElNotification({
      title: "温馨提示",
      dangerouslyUseHTMLString: true,
      message: `修改成功！`,
      duration: 10000,
      type: "success"
    });
    await handleNoticeMode();
  }
}

init();
</script>

<template>
  <div class="table-box" id="notice-container">
    <div class="card">
      <div class="card-title">
        邮箱配置
        <p @click="openDrawer('新增邮箱')">新增邮箱</p>
      </div>
      <div class="card-main">
        <el-table :data="emailData" style="width: 70%" height="32vh">
          <el-table-column prop="emailId" label="序号" width="140" />
          <el-table-column prop="emailName" label="邮箱" />
          <el-table-column prop="authorizeCode" label="邮件授权码" width="220" />
          <el-table-column prop="serverAddress" label="服务器地址" width="180" />
          <el-table-column prop="serverPort" label="服务器端口" width="120" />
          <el-table-column label="默认" width="120" prop="emailStatus">
            <template #default="scope">
              <el-switch
                v-model="scope.row.emailStatus"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus('email', scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" align="center">
            <template #default="scope">
              <el-button link @click="openDrawer('编辑邮箱', scope.row)" type="primary">编辑</el-button>
              <el-button link @click="deleteRow('email', scope.row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="setting">
          <div class="email-stop" v-if="emailMode.sendStatus === 0">
            <!--            <div class="border-yellow"></div>-->
            <!--            <div class="border-yellow2"></div>-->
            <p class="stop-icon"></p>
            <p class="current-status">当前邮件通知：<span style="color: red">未启用</span></p>
            <p @click="startServer('email')" class="start-button xg-button">开启邮件通知</p>
          </div>
          <div class="email-start" v-else>
            <div class="email-text">
              <p class="current-status">当前状态：<span>启用中 ...</span></p>
            </div>
            <div class="form">
              <p>允许系统发送通知的时间段：</p>
              <el-form>
                <div class="">
                  <el-radio-group v-model="emailMode.isCustom" class="ml-4" label="允许发送时间段">
                    <el-radio :label="0" size="large">无限制</el-radio>
                    <el-radio :label="1" size="large">选择时间段</el-radio>
                  </el-radio-group>
                </div>

                <div class="" v-if="emailMode.isCustom === 1" style="display: flex; align-items: center; justify-content: center">
                  <el-time-select
                    v-model="emailMode.startTime"
                    :max-time="emailMode.endTime"
                    class="mr-4"
                    placeholder="开始时间"
                    start="00:00:00"
                    step="00:30:00"
                    end="23:00:00"
                    format="HH:mm:ss"
                  />
                  <el-time-select
                    v-model="emailMode.endTime"
                    :min-time="emailMode.startTime"
                    placeholder="终止时间"
                    start="00:30:00"
                    step="00:30:00"
                    end="23:30:00"
                    format="HH:mm:ss"
                  />
                </div>
              </el-form>
            </div>

            <div class="button-box">
              <p class="modify-button xg-button" @click="modifyNoticeMode('email')">保存修改</p>
              <p class="stop-button xg-button" @click="stopServer('email')">停用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">
        短信配置
        <p @click="openDrawer('新增短信')">新增短信</p>
      </div>
      <div class="card-main">
        <el-table :data="messageData" style="width: 70%" height="32vh">
          <el-table-column prop="messageId" label="序号" width="180" />
          <el-table-column prop="signature" label="阿里云短信签名" width="180" />
          <el-table-column prop="accessKey" label="阿里云 Access key" width="180" />
          <el-table-column prop="accessKeySecret" label="阿里云 Access Secret" width="180" />
          <el-table-column prop="templateId" label="模板编号" width="180" />
          <el-table-column label="默认" prop="messageStatus">
            <template #default="scope">
              <el-switch
                v-model="scope.row.messageStatus"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus('message', scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button link @click="openDrawer('编辑短信', scope.row)" type="primary">编辑</el-button>
              <el-button link @click="deleteRow('message', scope.row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="setting">
          <div class="email-stop" v-if="messageMode.sendStatus === 0">
            <!--            <div class="border-yellow"></div>-->
            <!--            <div class="border-yellow2"></div>-->
            <p class="stop-icon"></p>
            <p class="current-status">当前短信通知：<span style="color: red">未启用</span></p>
            <p @click="startServer('message')" class="start-button xg-button">开启短信通知</p>
          </div>
          <div class="email-start" v-else>
            <div class="email-text">
              <p class="current-status">当前状态：<span>启用中 ...</span></p>
            </div>
            <div class="form">
              <p style="font-size: 16px">允许系统发送通知的时间段：：</p>
              <el-form>
                <div class="">
                  <el-radio-group v-model="messageMode.isCustom" label="允许发送时间段">
                    <el-radio :label="0" size="large">无限制</el-radio>
                    <el-radio :label="1" size="large">选择时间段</el-radio>
                  </el-radio-group>
                </div>
                <div
                  class=""
                  v-if="messageMode.isCustom === 1"
                  style="display: flex; align-items: center; justify-content: center"
                >
                  <el-time-select
                    v-model="messageMode.startTime"
                    :max-time="messageMode.endTime"
                    class="mr-4"
                    placeholder="开始时间"
                    start="00:00:00"
                    step="00:30:00"
                    end="23:00:00"
                    format="HH:mm:ss"
                  />
                  <el-time-select
                    v-model="messageMode.endTime"
                    :min-time="messageMode.startTime"
                    placeholder="终止时间"
                    start="00:30:00"
                    step="00:30:00"
                    end="23:30:00"
                    format="HH:mm:ss"
                  />
                </div>
              </el-form>
            </div>
            <div class="button-box">
              <p class="modify-button xg-button" @click="modifyNoticeMode('message')">保存修改</p>
              <p class="stop-button xg-button" @click="stopServer('message')">停用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Drawer ref="drawerRef" />
  </div>
</template>

<style scoped lang="scss">
#notice-container {
  .card {
    height: 44vh;
    margin: 1vh 0;

    .card-title {
      position: relative;
      height: 3vh;
      font-size: 18px;

      p {
        position: absolute;
        top: 0;
        right: 30%;
        padding: 0 0.5vw;
        font-size: 16px;
        color: var(--el-color-primary);
        cursor: pointer;
        border: 1px solid var(--el-color-primary);
        border-radius: 3px;

        &:hover {
          color: var(--el-color-primary);
          border-color: rgb(98 98 98 / 50%);
        }
      }
    }

    .card-main {
      display: flex;

      .setting {
        width: 30%;
        height: 35vh;
        background-color: rgb(193 196 196 / 39%);

        .email-stop {
          position: relative;
          padding-top: 5vh;
          text-align: center;

          .border-yellow {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 1vw;
            height: 32vh;
            background-image: url("@/assets/notice/border.png");
            background-size: auto 100%;
          }

          .border-yellow2 {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 1;
            width: 1vw;
            height: 32vh;
            background-image: url("@/assets/notice/border.png");
            background-size: auto 100%;
          }

          .stop-icon {
            width: 3vw;
            height: 3vw;
            margin: 0 auto;
            background-image: url("@/assets/notice/email.png");
            background-repeat: no-repeat;
            background-size: 100%;
          }

          .current-status {
            width: 10vw;
            margin: 2vh auto;
            font-size: 1vw;
          }

          .start-button {
            width: 8vw;
            padding: 1vh 1vw;
            margin: 4vh auto 0;
          }
        }

        .email-start {
          padding: 1vh 1vw;

          .current-status {
            width: 100%;
            font-size: 18px;
            text-indent: 1em;

            span {
              font-weight: bold;
              color: $main-color-primary;
            }
          }

          .form {
            height: 20vh;
            padding: 0 0.5vw;
          }

          .email-text {
            width: 100%;
            height: 5vh;
            margin: 1vh auto;
            background-color: rgb(178 175 175 / 23%);

            p {
              height: 5vh;
              line-height: 5vh;
            }
          }

          .button-box {
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin: 0 auto;

            .modify-button {
              padding: 0.5vh 1vw;
              margin: 0 1vw;
            }

            .stop-button {
              padding: 0.5vh 1vw;
              margin: 0 1vw;

              &:hover {
                background-color: var(--el-color-primary-light-4);
              }
            }
          }
        }
      }
    }
  }
}
</style>
