export namespace SysMenu {
  export interface Menu {
    //导航Id
    menuId: bigint;

    //父级导航
    parentId: bigint;

    //导航名称
    menuName: string;

    //参数
    menuParam: string;

    //ICO图标
    menuIcon: string;

    //操作类型
    menuType: number;

    //控件器
    menuMethod: string;

    //
    menuAction: string;

    //状态0停用1启用
    menuStatus: number;

    //显示顺序
    menuSort: number;

    //路由
    menuRoute: string;

    //路径
    menuPath: string;

    //重定向地址
    menuRedirect: string;

    //导航前景图片地址
    foregroundUrl: string;

    //导航背景图片地址
    backgroundUrl: string;

    //描述
    menuDescr: string;

    //应用Id
    appId: string;

    //是否删除 0未删除1已删除
    deletedFlag: number;

    //创建时间
    createTime: string;

    //创建人Id
    createUserId: bigint;

    //创建人名称
    createUserName: string;

    //修改时间
    modifyTime: string;

    //修改人Id
    modifyUserId: bigint;

    //修改人名称
    modifyUserName: string;
  }

  // 菜单的树形结构
  export interface TreeMenu {
    //导航Id
    menuId: bigint;

    //父级导航
    parentId: bigint;

    //导航名称
    menuName: string;

    //参数
    menuParam: string;

    //ICO图标
    menuIcon: string;

    //操作类型
    menuType: number;

    //控件器
    menuMethod: string;

    //
    menuAction: string;

    //状态0停用1启用
    menuStatus: number;

    //显示顺序
    menuSort: number;

    //路由
    menuRoute: string;

    //路径
    menuPath: string;

    //重定向地址
    menuRedirect: string;

    //导航前景图片地址
    foregroundUrl: string;

    //导航背景图片地址
    backgroundUrl: string;

    //描述
    menuDescr: string;

    //应用Id
    appId: bigint;

    //是否删除 0未删除1已删除
    deletedFlag: number;

    //创建时间
    createTime: string;

    //创建人Id
    createUserId: bigint;

    //创建人名称
    createUserName: string;

    //修改时间
    modifyTime: string;

    //修改人Id
    modifyUserId: bigint;

    //修改人名称
    modifyUserName: string;

    //菜单子集
    children: Menu.MenuOptions[];
  }
}
