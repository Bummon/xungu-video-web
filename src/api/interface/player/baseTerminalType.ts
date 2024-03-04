export namespace BaseTerminalType {
  export interface Option {
    typeId: bigint;
    typeName: string;
  }

  export interface Type {
    typeId: bigint;
    typeName: string;
    typeIco: string;
    typeStatus: number;
    typeSort: number;
    typeDescr: string;
  }

  export interface changeStatusById {
    typeId: number;
    typeStatus: 1 | 0;
  }
}
