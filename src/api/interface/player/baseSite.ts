import { BaseRoom } from "@/api/interface/player/baseRoom";

export namespace BaseSite {
  export interface Site {
    siteId: bigint;

    parentId: bigint;

    siteName: string;

    siteStatus: number;

    siteSort: number;

    siteDescr: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;
  }

  export interface TreeSite {
    siteId: bigint;

    parentId: bigint;

    siteName: string;

    siteStatus: number;

    siteSort: number;

    siteDescr: string;

    deletedFlag: number;

    createTime: number;

    createUserId: bigint;

    createUserName: string;

    modifyTime: number;

    modifyUserId: bigint;

    modifyUserName: string;

    children: BaseRoom.Room[];
  }

  export interface Option {
    siteId: bigint;
    siteName: string;
  }

  export interface changeStatusById {
    siteId: number;
    siteStatus: 1 | 0;
  }
}
