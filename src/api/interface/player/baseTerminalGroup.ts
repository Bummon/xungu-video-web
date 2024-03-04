export namespace BaseTerminalGroup {
  export interface Group {
    groupId: bigint;

    parentId: bigint;

    groupName: string;

    groupStatus: number;

    groupSort: number;

    groupDescr: string;

    createTime: string;

    terminalName: string;

    terminalNum: number;
  }

  export interface Option {
    groupId: bigint;
    groupName: string;
  }

  export interface changeStatusById {
    groupId: number;
    groupStatus: 1 | 0;
  }
}
