export namespace BaseComponent {
  /**
   * @interface
   * @description 基础组件数据
   * @property {number} componentId 组件ID
   * @property {string} componentName 组件名
   * @property {string} componentKey 关联Key
   * @property {string} componentScript 脚本？ 不知道啥
   * @property {string} componentDesign 设计？ 应该暂时没用
   * @property {string} componentIco 组件的图标
   * @property {string} componentType 组件的类型
   * @property {0|1} componentStatus 是否可用
   * @property {0|1} componentSort 排序 没啥用非要放出来
   * @property {string} componentDescr 关于组件的描述
   */
  export interface Component {
    componentId: number;
    componentName: string;
    componentKey: string;
    componentScript: string;
    componentDesign: string;
    componentIco: string;
    componentType: number;
    componentStatus: number;
    componentSort: number;
    componentDescr: string;
  }
  /**
   * @namespace BaseComponent
   * @interface
   * @description 通过ID切换组件状态时的入参
   * @property {number} componentId 组件ID
   * @property {1 | 0} componentStatus 组件状态
   */
  export interface changeStatusById {
    componentId: number;
    componentStatus: 1 | 0;
  }
}
