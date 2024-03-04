export namespace sysRoleMenu {
  export interface roleMenu {
    roleId: bigint;
    menuId: bigint;
  }

  // 根据roleId查菜单树  这是参数
  export interface getMenuByRoleId {
    id: bigint;
  }

  // 根据roleId查菜单树  这是返回值
  export interface reqMenuByRoleId {
    appId: number;
    backgroundUrl: "";
    children?: [
      {
        appId: number;
        backgroundUrl: string;
        children: [{}];
        createUserId: number;
        createUserName: string;
        deletedFlag: number;
        foregroundUrl: string;
        menuAction: string;
        menuDescr: string;
        menuIcon: string;
        menuId: number;
        menuMethod: string;
        menuName: string;
        menuParam: string;
        menuPath: string;
        menuRedirect: string;
        menuRoute: string;
        menuSort: number;
        menuStatus: number;
        menuType: number;
        modifyTime: string;
        modifyUserId: number;
        modifyUserName: string;
        parentId: number;
        status: number;
      }
    ];
  }
}
