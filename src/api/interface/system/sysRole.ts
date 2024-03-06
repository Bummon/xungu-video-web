export namespace sysRole {
  export interface Role {
    roleId: bigint; //角色ID
    roleCode?: string; //角色编码
    roleName: string; //角色名称
    enabled: number; //0停用 1启用
    roleSort?: number; //排序
    remark?: string; //备注
    createUserId?: bigint;
    createUsername?: string;
    createTime?: number;
    modifyUserId?: bigint;
    modifyUsername?: string;
    modifyTime?: number;
  }
}
