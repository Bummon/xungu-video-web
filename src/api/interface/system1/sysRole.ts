export namespace sysRoles {
  export interface ReqRoles {
    pageNum: number;
    pageSize: number;
  }

  export interface SysRole {
    type: number; // 0是子系统创建  1是内部平台创建 2是管理员
    roleId: number;

    parentId?: bigint;

    roleName?: string;

    groupId?: bigint;

    roleStatus?: number;

    roleSort?: number;

    roleDescr?: string;

    deletedFlag?: number;

    createTime?: number;

    createUserId?: bigint;

    createUserName?: string;

    modifyTime?: number;

    modifyUserId?: bigint;

    modifyUserName?: string;
  }

  //   角色绑定的菜单树
  export interface roleMenuTree {
    appId: number;
    menuId: bigint;
    menuName: string;
    status: 1 | 2; //是否选中
    backgroundUrl: string;
    children?: [
      {
        appId: number;
        menuId: number;
        backgroundUrl: string;
        children?: [{}];
        foregroundUrl?: string;
        menuAction?: string;
        menuDescr?: string;
        menuIcon?: string;
        menuMethod: string;
        menuName: string;
        menuParam: string;
        menuPath: string;
        menuRedirect: string;
        menuRoute: string;
        menuSort: number;
        menuStatus: number;
        menuType: number;
        parentId: number;
        status: 2 | 1;
      }
    ];
    foregroundUrl?: string;
    menuAction?: string;
    menuDescr?: string;
    menuIcon?: string;
    menuMethod?: string;
    menuParam?: string;
    menuPath?: string;
    menuRedirect?: string;
    menuRoute?: string;
    menuSort?: number;
    menuStatus: number;
    menuType: number;
    parentId: number;
  }

  export interface changeStatusById {
    roleId: number;
    roleStatus: 1 | 0;
  }
}
