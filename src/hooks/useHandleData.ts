import { ElMessageBox, ElMessage, ElNotification } from "element-plus";
import { HandleData } from "./interface";

/**
 * @description 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法 (必传)
 * @param {Object} params 携带的操作数据参数 {id,params} (必传)
 * @param {String} message 提示信息 (必传)
 * @param {String} confirmType icon类型 (不必传,默认为 warning)
 * @returns {Promise}
 */
export const useHandleData = (
  api: (params: any) => Promise<any>,
  params: any = {},
  message: string,
  confirmType: HandleData.MessageType = "warning"
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`是否${message}?`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: confirmType,
      draggable: true
    }).then(async () => {
      const res = await api(params);
      if (!res) return reject(false);
      ElNotification({
        title: "操作",
        message: `${message}成功!`,
        type: "success",
        duration: 2000
      });
      resolve(true);
    });
  });
};
// 关闭按钮的提示
/**
 *
 * @param fn  处理函数
 * @param message 提示消息
 * @param confirmType 类型
 */
export const XGHandleClose = (
  fn: () => Promise<any>, // 确认后操作函数
  message: string, //提示词
  callbackMessage: string = "操作", //成功词
  confirmType: HandleData.MessageType = "warning"
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`是否${message}?`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: confirmType,
      draggable: true
    })
      .then(async () => {
        try {
          await fn();
          ElNotification({
            title: "操作",
            message: `${callbackMessage}!`,
            type: "success",
            duration: 2000
          });
          resolve(true);
        } catch (e) {
          ElNotification({
            title: "操作",
            message: e.msg,
            type: "error",
            duration: 2000
          });
        }
      })
      .catch(e => {
        reject(false);
      });
  });
};

/** 上传 发布等等
 * @description 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法 (必传)
 * @param {Object} params 携带的操作数据参数 {id,params} (必传)
 * @param {String} message 提示信息 (必传)
 * @param {String} confirmType icon类型 (不必传,默认为 warning)
 * @returns {Promise}
 */
export const XGHandleEnsure = (
  api: (params: any) => Promise<any>,
  params: any = {},
  message: string,
  confirmType: HandleData.MessageType = "warning"
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`是否${message}?`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: confirmType,
      draggable: true
    }).then(async () => {
      const res = await api(params);
      if (!res) return reject(false);
      ElMessage({
        type: "success",
        message: `${message}成功!`
      });
      resolve(true);
    });
  });
};
/**
 * 迅谷确认框
 * @param fn  执行的请求
 * @param message   提示信息
 * @param callbackMessage  成功后的信息
 * @param confirmType  提示类型
 * @constructor
 */
export const XGConfirmBox = (
  api: (params: any) => Promise<any>, // 确认后操作函数
  argument: any = {}, // 接口的参数
  message: string = "确认执行？", //提示词
  callbackMessage: string = "操作成功", //成功词
  confirmType: HandleData.MessageType = "warning"
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`${message}`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: confirmType,
      draggable: true
    }).then(async () => {
      try {
        await api(argument);
        ElNotification({
          title: "提示",
          message: `${callbackMessage}!`,
          type: "success",
          duration: 2000
        });
        resolve(true);
      } catch (e) {
        console.log(e);
        reject(false);
      }
    });
  });
};
