export namespace BaseTerminalTemplate {
  export interface Template {
    templateId: bigint;
    templateKey: string;
    templateContext: string;
    templateDataType: string;
    templateValue: string;
    templateStatus: number;
    templateSort: number;
    templateDescr: string;
  }

  export interface changeStatusById {
    templateId: bigint;
    templateStatus: 1 | 0;
  }
}
