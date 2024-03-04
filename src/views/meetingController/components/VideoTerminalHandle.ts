import axios from "axios";

export class VideoTerminalHandle {
  ip: String;
  username: String;
  password: String;

  constructor(ip, username, password) {
    this.ip = ip;
    this.username = username;
    this.password = password;
    this.service = axios.create({
      auth: {
        username: this.username,
        password: this.password
      }
    });
  }

  async getAddressBook() {
    return new Promise((resolve, reject) => {
      this.service
        .get("http://192.168.1.111/api/v1/simplebook/contacts/get")
        .then(res => {
          resolve(res.data.v);
        })
        .catch(error => {
          reject([]);
        });
    });
  }

  async getAudioIn() {
    return new Promise((resolve, reject) => {
      this.service
        .get(`http://${this.ip}/api/v1/preferences/audioin/get/1/`)
        .then(res => {
          res.data.v.forEach(item => {
            if (item.k === "input-gain") {
              resolve(item.v);
            }
          });
        })
        .catch(error => {
          reject([]);
        });
    });
  }

  async getAudioOut() {
    return new Promise((resolve, reject) => {
      this.service
        .get(`http://${this.ip}/api/v1/preferences/audioout/get/1/`)
        .then(res => {
          res.data.v.forEach(item => {
            if (item.k === "output-gain") {
              resolve(item.v);
            }
          });
        })
        .catch(error => {
          reject([]);
        });
    });
  }

  async setAudioOut(val) {
    return new Promise((resolve, reject) => {
      this.service
        .post(`http://${this.ip}/api/v1/preferences/audioout/set/`, [
          {
            k: "output-gain",
            v: val
          }
        ])
        .then(res => {
          res.data.v.forEach(item => {
            if (item.k === "output-gain") {
              resolve(item.v);
            }
          });
        })
        .catch(error => {
          reject([]);
        });
    });
  }

  async setAudioIn(val) {
    return new Promise((resolve, reject) => {
      this.service
        .post(`http://${this.ip}/api/v1/preferences/audioin/set/`, [
          {
            k: "input-gain",
            v: val
          }
        ])
        .then(res => {
          res.data.v.forEach(item => {
            if (item.k === "output-gain") {
              resolve(item.v);
            }
          });
        })
        .catch(error => {
          reject([]);
        });
    });
  }

  /**
   * 获取输入音量 是否静音
   */
  async getAudioInMute() {
    return new Promise((resolve, reject) => {
      this.service
        .get(`http://${this.ip}/api/v1/preferences/audioin/mute/`)
        .then(res => {
          resolve(res.data.v["mute-in"]);
        })
        .catch(error => {
          reject(false);
        });
    });
  }

  /**
   * 设置输入音量是否静音
   * @param status
   * @return {}
   */
  async setAudioInMute(status) {
    return new Promise((resolve, reject) => {
      this.service
        .post(`http://${this.ip}/api/v1/preferences/audioin/mute/`, [
          {
            k: "mute-in",
            v: status
          }
        ])
        .then(res => {
          resolve(res.data.v["mute-in"]);
        })
        .catch(error => {
          reject(false);
        });
    });
  }

  /**
   * 设置输出音量是否静音
   * @param {boolean} status
   * @return {boolean}
   */
  async setAudioOutMute(status) {
    return new Promise((resolve, reject) => {
      this.service
        .post(`http://${this.ip}/api/v1/preferences/audioout/mute/`, [
          {
            k: "mute-out",
            v: status
          }
        ])
        .then(res => {
          resolve(res.data.v["mute-out"]);
        })
        .catch(error => {
          reject(false);
        });
    });
  }

  /**
   * 获取当前布局
   */
  async getLayout() {
    return new Promise((resolve, reject) => {
      this.service
        .get(`http://${this.ip}/api/v1/layout/1/get/0/`)
        .then(res => {
          resolve(res.data.v[0].v);
        })
        .catch(error => {
          reject(false);
        });
    });
  }

  /**
   * 设置布局
   */
  async setLayout(layout) {
    return new Promise((resolve, reject) => {
      this.service
        .post(`http://${this.ip}/api/v1/layout/1/set/`, {
          layout: layout,
          save: true
        })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(false);
        });
    });
  }

  async startCall(uri) {
    return new Promise((resolve, reject) => {
      try {
        this.service
          .post(`http://${this.ip}/api/v1/call/dial/`, {
            rate: 1920,
            url: uri
          })
          .then(res => {
            if (res.data.code === 0) {
              resolve(true);
            } else {
              reject(false);
            }
          })
          .catch(error => {
            console.log(error);
            reject(false);
          });
      } catch (e) {
        console.log(e);
        reject(true);
      }
    });
  }

  async hangup(id) {
    return new Promise((resolve, reject) => {
      this.service
        .post(`http://${this.ip}/api/v1/call/hangup/`, {
          id: id
        })
        .then(res => {
          if (res.code === 0) {
            resolve(true);
          } else {
            reject(false);
          }
        })
        .catch(error => {
          reject(false);
        });
    });
  }

  async getCallList() {
    return new Promise((resolve, reject) => {
      this.service
        .get(`http://${this.ip}/api/v1/call/list/get/0/`)
        .then(res => {
          resolve(res.data.v);
        })
        .catch(error => {
          reject([]);
        });
    });
  }
}

const layoutEnum = ["full-far", "full-near", "large-far-small-near", "large-near-small-far", "far-and-near-equal"];
