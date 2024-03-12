import http from "@/api";
import { TEquipment } from "@/api/interface/base/tEquipment";
import { EQUIPMENT } from "@/api/config/servicePort";
import { ResPage } from "@/api/interface";

export const getEquipmentList = (params: TEquipment.Equipment) => {
  return http.post<TEquipment.Equipment[]>(EQUIPMENT + `/list`, params);
};

export const getEquipmentPage = (params: TEquipment.Equipment) => {
  return http.post<ResPage<TEquipment.Equipment[]>>(EQUIPMENT + `/page`, params);
};

export const getEquipmentInfo = (equipmentId: number | bigint) => {
  return http.post(EQUIPMENT + `/info`, { id: equipmentId });
};

export const addEquipment = (params: TEquipment.Equipment) => {
  return http.post(EQUIPMENT + `/add`, params);
};

export const updateEquipment = (params: TEquipment.Equipment) => {
  return http.post(EQUIPMENT + `/edit`, params);
};

export const deleteEquipment = (equipmentIds: number | bigint) => {
  return http.post(EQUIPMENT + `/remove`, { ids: equipmentIds });
};
