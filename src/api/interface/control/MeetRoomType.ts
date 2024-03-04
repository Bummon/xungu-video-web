/**
 * 会议室类型的 接口
 * @author 20230727
 */
export namespace RoomTypeType {
  /**
   * @property {string} createTime 创建时间	string(date-time)
   * @property {string} createUserName 创建人名称	string
   * @property {string} modifyTime  修改时间	string(date-time)
   * @property {string} modifyUserName 修改人名称	string
   * @property {string} typeDescr 描述	string
   * @property {string} typeName    类型名称
   * @property {number |bigint} createUserId  创建人Id	integer(int64)
   * @property {number |bigint} modifyUserId  修改人Id	integer(int64)
   * @property {number |bigint} typeId 会议室类型id	integer(int64)
   */
  export interface RoomType {
    createTime: string;
    createUserId: number | bigint;
    createUserName: number;
    modifyTime: string;
    modifyUserId: number;
    modifyUserName: string;
    typeDescr: string;
    typeId: number | bigint;
    typeName: string;
  }
}
