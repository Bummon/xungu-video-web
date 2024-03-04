export namespace BaseTerminal {
  export interface Terminal {
    terminalId?: bigint;

    terminalCode?: string;

    terminalName?: string;

    typeId?: bigint;

    groupId?: number;

    terminalIco?: string;

    roomId?: number;

    terminalStatus?: number;

    terminalSort?: number;

    terminalDescr?: string;

    typeName?: string;

    groupName?: string;

    roomName?: string;

    siteName?: string;
  }

  export interface Option {
    terminalName: string;
    terminalId: number;
  }
}
