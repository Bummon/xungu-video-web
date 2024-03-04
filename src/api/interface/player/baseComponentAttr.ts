export namespace BaseComponentAttr {
  export interface ComponentAttr {
    attrId: number;
    componentId: number;
    attrName: string;
    attrKey: string;
    attrIco: string;
    attrDataType: string;
    attrValue: string;
    attrStatus: number;
    attrSort: number;
    attrDescr: string;
  }

  export interface changeStatusById {
    attrId: number;
    attrStatus: 1 | 0;
  }
}
