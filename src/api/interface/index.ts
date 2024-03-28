/**

 * @author 党亚南20230712
 * @description 基础请求响应体
 * @property {number} code 响应码
 * @property {string} msg 响应消息
 */
export interface Result {
  code: number;
  msg: string;
}

/**
 * @author 党亚南20230712
 * @description 通用请求响应体
 * @extends Result
 * @property {T} data 返回结果data可以是任意类型
 */
export interface ResultData<T> extends Result {
  data: T;
}

/**
 * @author 党亚南
 * @description 分页响应数据
 * @property {number} pageNum 查询的是第几页
 * @property {number} pageSize 每页几个数据
 * @property {T} data 泛型接收具体数据
 * @property {number} total 泛型接收具体数据
 */
export interface ResPage<T> {
  data: T;
  pageNum: number;
  pageSize: number;
  total: number;
}

/**
 * @author 党亚南
 * @description 分页查询数据类型
 * @property {number} pageNum 查询的是第几页
 * @property {number} pageSize 每页几个数据
 */
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

export interface ReqPagePlus extends ReqPage {
  [key: string]: any;
}

/**
 * @namespace Upload
 */
export namespace Upload {
  /**
   * @author 党亚南20230712
   * @description 文件上传后响应的数据
   * @property {string} fileUrl 返回文件保存地址
   */
  export interface ResFileUrl {
    fileUrl: string;
    fileType: string;
    fileName: string;
    fileSize: string;
  }
}

/**
 * @description 登录模块
 */
export namespace Login {
  /**
   * @author 党亚南20230712
   * @description 登录请求表单
   * @property {string} userName 用户名
   * @property {string} password 密码  暂时关掉md5加密
   * @property {number} type 登录类型 1-后台 2-移动端
   */
  export interface ReqLoginForm {
    username: string;
    password: string;
    type?: number;
  }

  /**
   * @author 党亚南20230712
   * @description 登录成功后响应体
   * @property {string} nickName 昵称
   * @property {string} token 主要取这个
   */
  export interface ResLogin {
    nickname: string;
    userId: number | bigint;
    token: string;

    avatar: string;
  }

  /**
   * @author 党亚南20230712
   * @description 按钮权限集
   * @property {string[]} data 权限数组
   */
  export interface ResAuthButtons {
    data: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface SysUserRoleBo {
    userId: bigint;
    roleId: bigint | null;
  }

  export interface ReqUserParams extends ReqPage {
    userAccount: string;
    gender: number;
    email: string;
    phone: string;
    type: number;
    createTime: string[];
    enabled: number;
  }

  export interface ResUserList {
    userId: bigint; //用户id
    userAccount: string; //用户账户
    password: string; //登录密码
    nickname: string; //用户昵称
    email: string; //邮箱
    phone: string; //手机号
    deptId: bigint; //部门ID
    deptName: string; //部门名称
    gender: number; //性别
    avatar: string; //头像
    type: number; //用户类型 1-用户 2-人员
    enabled: number; //活动状态0初始化1已激活2已锁定
    sort: number; //排序
    remark: string; //备注
    createTime: number; //创建时间
    createUserId: bigint; //创建用户id
    createUsername: string; //创建用户姓名
    modifyTime: number; //最后修改时间
    modifyUserId: bigint; //最够修改用户id
    modifyUserName: string; //最后修改用户名字
    roleId: bigint; //角色id
    //children: SysUserRoleBo[];
  }

  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }

  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }

  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }

  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}
