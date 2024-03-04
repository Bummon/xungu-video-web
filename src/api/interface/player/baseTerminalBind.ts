export namespace BaseTerminalBind {
  export interface TerminalBind {
    bindId: bigint;
    terminalId: bigint;
    bindLicense: string;
    bindSerialsno: string;
    bindStatus: number;
    bindDescr: string;
    terminalName: string;
  }

  export interface changeStatusById {
    typeId: number;
    typeStatus: 1 | 0;
  }
}
