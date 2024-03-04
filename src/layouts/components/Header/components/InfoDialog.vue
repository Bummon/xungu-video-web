<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { UserHttp } from "@/api/modules/system1/user";
import { useUserStore } from "@/stores/modules/user";
import avatarDefault from "@/assets/avatar/avatar1.png";
import { sysApp } from "@/api/modules/control/meetRoom";
import { TerminalHandle } from "@/views/source/terminal/index"; // 默认头像

const userStore = useUserStore();
const dialogVisible = ref(false);
const modifyFormRef = ref(); // 修改密码的表单
const loading = ref(false); // 模态框
const userInfo = ref();
const modifyFormFlag = ref(false); // 修改密码表单显示
const isEnterAvatar = ref(false); // 鼠标是否进入头像框
const meetRoomOptions = ref<sysApp.meeting[] | []>([]); //选择会议室的列表
const addRoomFormRef = ref(); // 添加vip会议室的表单
const addRoomFlag = ref(false); // 是否打开添加会议室页面
const addRoomFormData = reactive<{ addRoomId: number }>({}); // 添加vip会议室的表单数据对象
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
    // password 是表单上绑定的字段
  } else if (value !== formData.value.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
// 表单校验
const rules = reactive({
  oldPassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
  newPassword: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
  newPassword2: [{ required: true, validator: validatePass2, trigger: "blur" }]
});
const addRoomRules = reactive({
  addRoomId: [{ required: true, message: "请选择会议室", trigger: "blur" }]
});
const formData = ref({
  oldPassword: "",
  newPassword: "",
  newPassword2: ""
});
const openDialog = async () => {
  await init();
  dialogVisible.value = true;
};

/**
 * 提交修改密码
 * @param modifyFormRef 表单DOM
 */
function handleSubmit(modifyFormRef: FormInstance | undefined) {
  if (!modifyFormRef) return;
  modifyFormRef.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行请求
      const res = await UserHttp.updatePassword({
        loginPassword: formData.value.oldPassword,
        newPassword: formData.value.newPassword,
        userId: userStore.userInfo.userId
      });
      if (res.code === 200) {
        ElNotification({
          title: "操作",
          message: `密码修改成功!`,
          type: "success",
          duration: 2000
        });
        formData.value = {
          oldPassword: "",
          newPassword: "",
          newPassword2: ""
        };
        modifyFormFlag.value = false;
      } else {
        ElNotification({
          title: "操作",
          message: `修改失败！请稍后再试!`,
          type: "error",
          duration: 2000
        });
      }
    } finally {
      loading.value = false;
    }
  });
}

/**
 * 上传头像成功后
 */
function uploadSuccess() {
  console.log("上传成功");
}

/**
 * 单个上传的方法
 * @param param
 */
async function uploadAttachment(param: UploadRequestOptions) {
  let excelFormData = new FormData();
  excelFormData.append("file", param.file);
  excelFormData.append("id", userInfo.value.userId);
  try {
    const res = await UserHttp.updateAvatar(excelFormData);
    if (res.code === 200) {
      ElNotification({
        title: "温馨提示",
        dangerouslyUseHTMLString: true,
        message: `上传成功`,
        duration: 10000,
        type: "success"
      });
      console.log(res.data);
      userInfo.value = await UserHttp.getDetailById(userStore.userInfo.userId);
    }
  } catch (e) {
    console.log("上传失败", e);
    ElNotification({
      title: "温馨提示",
      dangerouslyUseHTMLString: true,
      message: `上传失败,请稍后尝试`,
      duration: 10000,
      type: "error"
    });
  }
}

/**
 * 增加会议室
 */
function addVipRoom() {
  console.log("切换到添加会议室");
  addRoomFlag.value = true;
}

async function removeVip(item) {
  let res = await UserHttp.deleteVIPRoom({
    userId: userStore.userInfo.userId,
    roomId: item.roomId
  });
  if (res.code === 200) {
    ElNotification({
      title: "操作",
      message: `删除成功!`,
      type: "success",
      duration: 2000
    });
    userInfo.value = await UserHttp.getDetailById(userStore.userInfo.userId);
  }
}

function handleAddVipRoom(addRoomFormRef: FormInstance | undefined) {
  console.log("提交添加会议室");
  if (!addRoomFormRef) return;
  addRoomFormRef.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const res = await UserHttp.addVIPRoom({
        roomId: addRoomFormData.addRoomId,
        userId: userStore.userInfo.userId
      });
      if (res.code === 200) {
        ElNotification({
          title: "操作",
          message: `添加成功!`,
          type: "success",
          duration: 2000
        });
        addRoomFormData.addRoomId = null;
        addRoomFlag.value = false;
        //   刷新数据
        userInfo.value = await UserHttp.getDetailById(userStore.userInfo.userId);
      } else {
        ElNotification({
          title: "操作",
          message: `修改失败！请稍后再试!`,
          type: "error",
          duration: 2000
        });
      }
    } catch (e) {
      console.log(e);
      if (e.msg === "会议室id不能为空") {
        ElNotification({
          title: "操作",
          message: e.msg,
          type: "error",
          duration: 2000
        });
      } else {
        ElNotification({
          title: "操作",
          message: "该会议室已在关注列表",
          type: "error",
          duration: 2000
        });
      }
    } finally {
      loading.value = false;
    }
  });
}

async function init() {
  let userId = userStore.userInfo.userId;
  userInfo.value = await UserHttp.getDetailById(userId);
  console.log("userInfo", userInfo.value);
  //   选择会议室的列表
  meetRoomOptions.value = await TerminalHandle.getMeetRoomList();
}

defineExpose({ openDialog });
</script>
<template>
  <el-dialog v-model="dialogVisible" title="个人中心" width="45vw" draggable :close-on-click-modal="false" :top="'5vh'">
    <div id="personal-center">
      <div class="main-left">
        <div class="top-slot"></div>
        <div class="main-left-top" @mouseenter="isEnterAvatar = true" @mouseleave="isEnterAvatar = false">
          <div class="avatar-img-box">
            <div class="avatar-img" :style="`background-image:url(${userInfo?.avatar || avatarDefault});`"></div>
            <!--            <img :src="userInfo?.avatar || avatarDefault" alt="" />-->
            <div class="modify-avatar" v-if="isEnterAvatar">
              <el-upload :multiple="false" :on-success="uploadSuccess" action="#" :http-request="uploadAttachment">
                <p>修改头像</p>
                <template> s</template>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="userInfo">
          <div class="userInfo-left">
            <p>
              <span class="label">姓名：</span><span class="value">{{ userInfo?.nickName }}</span>
            </p>
            <p><span class="label">手机：</span><span class="value">15588888888</span></p>

            <p>
              <span class="label">岗位：</span><span class="value">{{ userInfo?.jobName || "无" }}</span>
            </p>
            <p>
              <span class="label">组织：</span><span class="value">{{ userInfo?.orgName || "无" }}</span>
            </p>
          </div>
          <div class="userInfo-right">
            <p>
              <span class="label">工号：</span><span class="value">{{ userInfo?.empCode || "无" }}</span>
            </p>
            <p><span class="label">邮箱：</span><span class="value">597974450@qq.com</span></p>
            <p><span class="label">角色：</span><span class="value">admin</span></p>
            <p>
              <span class="label">部门：</span>
              <span class="value">{{ userInfo?.deptName || "无" }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="main-right">
        <div class="main-right-top">
          <p style="font-weight: bold">修改密码</p>
          <div class="modify-password">
            <div class="openModify-box" v-if="!modifyFormFlag">
              <img src="@/assets/avatar/icon.png" width="5vw" alt="" />
              <el-button type="warning" @click="modifyFormFlag = true">修改个人密码</el-button>
            </div>

            <div class="modify-form" v-else>
              <el-form ref="modifyFormRef" :rules="rules" :model="formData">
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input type="password" placeholder="请输入旧密码" v-model.trim="formData.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input type="password" placeholder="请输入新密码" v-model.trim="formData.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword2">
                  <el-input type="password" placeholder="请再次输入新密码" v-model.trim="formData.newPassword2"></el-input>
                </el-form-item>
              </el-form>
              <div class="form-footer">
                <el-button @click="modifyFormFlag = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit(modifyFormRef)" :loading="loading">确定</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="main-right-bottom">
          <div class="vip-header">关注的VIP会议室</div>
          <div class="vip-add" v-if="addRoomFlag">
            <div class="add-room-form">
              <el-form ref="addRoomFormRef" :rules="addRoomRules" :model="addRoomFormData">
                <el-form-item prop="addRoomId">
                  <template #default>
                    <div class="">
                      <p style="font-size: 1.5vh; font-weight: bold">选择会议室</p>
                      <el-select v-model="addRoomFormData.addRoomId" class="m-2" placeholder="请配置会议室" size="default">
                        <el-option v-for="item in meetRoomOptions" :key="item.roomId" :label="item.roomName" :value="item.roomId">
                          {{ item.roomName }}
                        </el-option>
                      </el-select>
                    </div>
                  </template>
                </el-form-item>
              </el-form>
            </div>

            <div class="btn-box">
              <el-button @click="addRoomFlag = false">取消</el-button>
              <el-button @click="handleAddVipRoom(addRoomFormRef)" type="primary">确认添加</el-button>
            </div>
          </div>
          <div class="vip-table" v-else>
            <div
              class="addBtn"
              @click="addVipRoom"
              v-if="userInfo?.meetingRooms?.constructor === Array && userInfo?.meetingRooms.length < 3"
            >
              添加VIP
            </div>
            <table>
              <thead>
                <tr>
                  <td class="meet-name">会议室名称</td>
                  <td class="meet-handle">操作</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in userInfo.meetingRooms" :key="item.roomId">
                  <td class="meet-name">{{ item.roomName }}</td>
                  <td class="meet-handle">
                    <el-button type="danger" text @click="removeVip(item)">移除关注</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
#personal-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 75vh;

  .main-left {
    position: relative;
    width: 22vw;
    height: 100%;
    overflow: hidden;
    border: 8px solid $main-color-primary;
    border-radius: 2vh;

    .top-slot {
      position: absolute;
      top: 0;
      left: 30%;
      width: 40%;
      height: 2vh;
      background-color: $main-color-primary;
      border-bottom-right-radius: 2vh;
      border-bottom-left-radius: 2vh;
      box-shadow: -1px 1px 1px #3d3d3d, 1px 1px 1px #3d3d3d;
    }

    .main-left-top {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 25vh;
      background-color: rgb(146 148 147 / 39%);

      .avatar-img-box {
        position: relative;
        width: 16vh;
        height: 16vh;
        padding: 0;
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 50%;

        .modify-avatar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 0;
          line-height: 3vh;
          color: #ffffff;
          text-align: center;
          cursor: pointer;
          background-color: $main-color-primary;
        }

        .avatar-img {
          width: 16vh;
          height: 16vh;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100%;
          border-radius: 50%;
        }
      }
    }

    .userInfo {
      display: flex;
      align-items: flex-start;
      justify-content: space-around;
      width: 100%;
      height: 45vh;
      color: #0e0e0e;

      .label {
        font-weight: bold;
      }

      .value {
        text-overflow: ellipsis;
      }

      .userInfo-left {
        flex: 1;
        padding: 1vh 0.5vw;

        p {
          padding: 1vh 0;
        }
      }

      .userInfo-right {
        flex: 1;
        padding: 1vh 0.5vw;

        p {
          padding: 1vh 0;
        }
      }
    }
  }

  .main-right {
    width: 16vw;
    height: 75vh;
    margin-left: 1vw;

    .main-right-bottom {
      .vip-header {
        height: 3vh;
        font-weight: bold;
        color: #0e0e0e;
      }

      .vip-add {
        width: 16vw;
        height: 42vh;
        padding: 5% 0;
        margin: 0 auto;
        background-color: rgb(0 0 0 / 10%);

        .add-room-form {
          display: flex;
          justify-content: center;
          width: 16vw;
          height: 30vh;
          margin: 0 auto;
        }

        .btn-box {
          display: flex;
          justify-content: center;
          width: 16vw;
          margin-top: 2vh;
        }
      }

      .vip-table {
        position: relative;
        width: 16vw;
        height: 42vh;
        margin: 0 auto;
        background-color: rgb(0 0 0 / 10%);

        .addBtn {
          position: absolute;
          top: -3vh;
          right: 0;
          height: 2.8vh;
          padding: 0 8px;
          line-height: 2.8vh;
          color: $main-color-primary;
          cursor: pointer;
          border-radius: 3px;

          &:hover {
            background-color: rgb(0 0 0 / 10%);
          }
        }

        table {
          padding: 1vh 0;
          margin: 0 auto;
          text-align: center;

          thead {
            font-weight: bold;
          }

          tbody {
            tr {
              background-color: #cac9c9;
            }
          }

          .meet-name {
            width: 10vw;
          }

          .meet-handle {
            width: 5vw;
            padding: 0.5vh 1vw;
          }
        }
      }
    }

    .main-right-top {
      height: 30vh;
      color: #0e0e0e;

      .modify-password {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16vw;
        height: 24vh;
        margin: 1vh auto;
        background-color: rgb(0 0 0 / 10%);

        .openModify-box {
          img {
            display: block;
            width: 4vw;
            margin: 1vh auto;
          }
        }

        .form-footer {
          display: flex;
          justify-content: center;
          width: 100%;
          height: 5vh;
        }
      }
    }
  }
}
</style>