export namespace BaseDiyLayout {
  /**
   * @description 分页查询布局的响应体
   * @author 党亚南
   * @property {DiyLayout[]} data 布局的数据列表
   * @property {number} pageNum 当前查询的是第几页
   * @property {number} pageSize 当前页有几条数据
   * @property {number} total 总共有几条数据
   */
  export interface DiyLayoutList {
    data: DiyLayout[];
    pageNum: number;
    pageSize: number;
    total: number;
  }
  /**
   * @description 布局的具体数据
   * @property {string} createTime 创建时间
   * @property {bigint} createUserId 创建人ID
   * @property {string} createUserName 创建人
   * @property {0 | 1}  deletedFlag 是否删除 0未删除1已删除
   * @property {string} layoutDescr 描述
   * @property {string} layoutDesign 存储JSON
   * @property {bigint} layoutId 布局ID
   * @property {string} layoutScript 脚本
   * @property {number} layoutSort 排序
   * @property {0|1}    layoutStatus 状态0停用1启用
   * @property {string} layoutTitle 标题
   * @property {1 | 2}  layoutType      类型1默认2自定义
   * @property {string} modifyTime      修改日期
   * @property {bigint} modifyUserId    修改人的ID
   * @property {string} modifyUserName  修改人名字
   */
  export interface DiyLayout {
    createTime: string;
    createUserId: bigint;
    createUserName: string;
    deletedFlag: 0 | 1;
    layoutDescr: string;
    layoutDesign: string;
    layoutId: bigint;
    layoutScript: string;
    layoutSort: number;
    layoutStatus: 0 | 1;
    layoutTitle: string;
    layoutType: 1 | 2;
    modifyTime: string;
    modifyUserId: bigint;
    modifyUserName: string;
  }

  /**
   * @description 删除布局的接口入参
   * @property  {bigint[]} ids 选中的行的布局ID数组
   */
  export interface deleteLayoutParams {
    ids: bigint[];
  }

  export interface Option {
    layoutId: bigint;
    layoutTitle: string;
  }

  /**
   * @description 改变布局的状态
   * @property {bigint} layoutId 布局ID
   * @property {1|0} layoutStatus 当前状态
   */
  export interface changeStatusById {
    layoutId: bigint;
    layoutStatus: 1 | 0;
  }
}
