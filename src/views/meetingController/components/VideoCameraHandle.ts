export class VideoCameraHandle {
  /**
   * 取出包含预置位的命令
   * @param list
   */
  static getSetPresetBit(list) {
    if (list && list.constructor === Array && list.length > 0) {
      let PresetBitResult = [];
      list.forEach(item => {
        if (item.commandName && item.commandName.includes("预置位")) {
          PresetBitResult.push(item);
        }
      });
      return PresetBitResult;
    } else {
      return [];
    }
  }

  /**
   * 调整到预置位的命令
   * @param list
   */
  static getPresetBit(list) {
    if (list && list.constructor === Array && list.length > 0) {
      let PresetBitResult = [];
      list.forEach(item => {
        if (item.commandName && item.commandName.includes("调用预置")) {
          PresetBitResult.push(item);
        }
      });
      return PresetBitResult;
    } else {
      return [];
    }
  }

  static getOperation(list) {
    console.log(list);
    let operations = {
      zoomIn: [],
      zoomOut: [],
      up: [],
      down: [],
      left: [],
      right: [],
      ok: [],
      stopZoom: []
    };
    if (list && list.constructor === Array && list.length > 0) {
      operations.zoomIn = list.filter(item => item.commandName === "拉近") || [];
      operations.zoomOut = list.filter(item => item.commandName === "拉远") || [];
      operations.up = list.filter(item => item.commandName === "上") || [];
      operations.down = list.filter(item => item.commandName === "下") || [];
      operations.left = list.filter(item => item.commandName === "左") || [];
      operations.right = list.filter(item => item.commandName === "右") || [];
      operations.ok = list.filter(item => item.commandName === "ok") || [];
      operations.stopZoom = list.filter(item => item.commandName === "焦距停") || [];
    }
    return operations;
  }
}
