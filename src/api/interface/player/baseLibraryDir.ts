export namespace BaseLibraryDir {
  /**
   * @description 媒体资源列表
   * @property {bigint} dirId 文件夹ID
   * @property {bigint} parentId 父目录ID
   * @property {bigint} dirName 文件夹名
   * @property {0|1}    dirStatus 文件夹状态
   * @property {number} dirSort 排序
   * @property {string} dirDescr 描述
   * @property {string} createTime 创建时间
   * @property {string} terminalName 终端名称
   * @property {string} terminalNum 终端数量
   */
  export interface LibraryDir {
    dirId: bigint;

    parentId: bigint;

    dirName: string;

    dirStatus: 0 | 1;

    dirSort: number;

    dirDescr: string;

    createTime: string;

    terminalName: string;

    terminalNum: number;
  }

  export interface TreeLibraryDir {
    dirId: bigint;

    parentId: bigint;

    dirName: string;

    dirStatus: number;

    dirSort: number;

    dirDescr: string;

    createTime: string;

    terminalName: string;

    terminalNum: number;

    children: Menu.MenuOptions[];
  }

  export interface Option {
    dirId: bigint;
    dirName: string;
  }
}
