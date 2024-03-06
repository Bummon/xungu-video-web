export namespace sysMenu {
  export interface Menu {
    menuId: number | bigint;
    menuName: string;
    parentId: number | bigint;
    menuParam?: string;
    menuIco?: string;
    menuType?: number;
    menuMethod?: string;
    menuAction?: string;
    enabled?: number;
    menuSort?: number;
    menuRoute?: string;
    menuPath?: string;
    menuRedirect?: string;
    remark?: string;
    createUserId?: number | bigint;
    createUsername?: string;
    createTime?: string;
    modifyUserId?: number | bigint;
    modifyUsername?: string;
    modifyTime?: string;
  }
}
