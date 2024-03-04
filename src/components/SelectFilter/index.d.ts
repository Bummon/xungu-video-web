export namespace SelectFilterType {
  /**
   * @description 选择数据
   * @property {string} title 列表标题
   * @property {string} key 当前筛选项的Key值
   * @property {boolean} multiple? 是否多选
   * @property {OptionsProps[]} options 筛选数据
   */
  export interface SelectDataProps {
    title: string; // 列表标题
    key: string; // 当前筛选项 key 值
    multiple?: boolean; // 是否为多选
    options: OptionsProps[]; // 筛选数据
  }
  export interface SelectFilterProps {
    data?: SelectDataProps[]; // 选择的列表数据
    defaultValues?: { [key: string]: any }; // 默认值
  }
  export interface OptionsProps {
    value: string | number;
    label: string;
    icon?: string;
  }
}
