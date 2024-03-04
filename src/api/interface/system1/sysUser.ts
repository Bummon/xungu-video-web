export namespace SysUser {
  export interface User {
    //用户id
    userId: bigint;

    //用户昵称
    nickName: string;

    //登录密码
    loginPassword: string;

    //用户账户
    userAccount: string;

    //密码加盐值
    salt: string;

    //职员id
    empId: bigint;

    //活动状态0初始化1已激活2已锁定
    activeStatus: number;

    //是否逻辑删除0正常未删除1已删除
    deletedFlag: number;

    //创建时间
    createTime: number;

    //创建用户id
    createUserid: bigint;

    //创建用户姓名
    createUsername: string;

    //最后修改时间
    modifyTime: number;

    //最够修改用户id
    modifyUserId: bigint;

    //最后修改用户名字
    modifyUserName: string;
  }

  export interface checkName {
    userId: number | undefined;
    nickName: string;
    userAccount: string;
  }

  /**
   * @property {string} avatar url地址
   * @property {string} nickName url地址
   * @property {string} orgName 组织名
   * @property {string} nickName 昵称
   * @property {string} jobName 岗位;
   * @property {string} deptName 部门名称;
   */
  export interface UserDetail {
    activeStatus: 0 | 1;
    avatar: string;
    deletedFlag: 0 | 1;
    empId: 0;
    jobName: string;
    meetingRooms: any[];
    nickName: string;
    deptName: string;
    orgName: string;
    token: null;
    type: null;
    userAccount: string;
    userId: bigint | number;
    userStatus: 0 | 1;
  }
}
