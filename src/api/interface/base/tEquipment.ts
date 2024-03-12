export namespace TEquipment {
  export interface Equipment {
    equipmentId: number | bigint;
    equipmentCode: string;
    eqipmentName: string;
    ip: string;
    remark: string;
    createUserId?: number | bigint;
    createUsername?: string;
    createTime?: string;
    modifyUserId: number | bigint;
    modifyUsername: string;
    modifyTime?: string;
  }
}
