export namespace DataType {
  /**
   * 级联选择器
   * @property {string} label  标签名字
   * @property {number|bigint} value 值
   * @property {[]} children 子元素
   */
  export interface Cascade {
    label: string;
    value: number | bigint | string;
    children: children[];
  }

  interface children {
    label: string;
    value: number | bigint | string;
    children?: children[];
  }
}
