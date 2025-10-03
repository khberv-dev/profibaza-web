import { api } from "../api/client";

/** Сырые элементы из бэка */
export type LocationRaw = {
  id: number;
  nameUz: string;
  nameRu: string;
  parent: number | null;
};

type ListResponse = {
  ok: boolean;
  data: LocationRaw[];
};

/** Нормализованные типы */
export type Region = {
  id: number;
  nameUz: string;
  nameRu: string;
};
export type District = {
  id: number;
  nameUz: string;
  nameRu: string;
  parent: number; // regionId
};
export type Village = {
  id: number;
  nameUz: string;
  nameRu: string;
  parent: number; // districtId
};


type ListResponseFlat = { ok: boolean; data: LocationRaw[] };
type ListResponseNested = { ok: boolean; data: ListResponseFlat };

// Нормализаторы
export const mapRegion   = (r: LocationRaw) => ({ id: r.id, nameUz: r.nameUz, nameRu: r.nameRu });
export const mapDistrict = (r: LocationRaw) => ({ id: r.id, nameUz: r.nameUz, nameRu: r.nameRu, parent: r.parent as number });
export const mapVillage  = (r: LocationRaw) => ({ id: r.id, nameUz: r.nameUz, nameRu: r.nameRu, parent: r.parent as number });
/** Вспомогалка: выбрать имя по языку */


const extractList = (payload: any): LocationRaw[] => {
  // axios: resp.data === payload
  // Вариант 1: { ok, data: [] }
  if (Array.isArray(payload?.data)) return payload.data as LocationRaw[];
  // Вариант 2: { ok, data: { ok, data: [] } }
  if (Array.isArray(payload?.data?.data)) return payload.data.data as LocationRaw[];
  // На всякий случай: если вдруг пришёл сразу массив
  if (Array.isArray(payload)) return payload as LocationRaw[];
  return [];
};

export const pickName = (
  item: { nameRu: string; nameUz: string },
  lng: string | undefined
) => (lng?.startsWith("uz") ? item.nameUz : item.nameRu);

/** API */
export const locationApi = {
  getRegions: async () => {
    const { data } = await api.get<ListResponseFlat | ListResponseNested>("/opt/location/regions");
    const list = extractList(data);
    return list.map(mapRegion);
  },

  getDistricts: async (regionId: number) => {
    const { data } = await api.get<ListResponseFlat | ListResponseNested>(`/opt/location/districts/${regionId}`);
    const list = extractList(data);
    return list.map(mapDistrict);
  },

  getVillages: async (districtId: number) => {
    const { data } = await api.get<ListResponseFlat | ListResponseNested>(`/opt/location/villages/${districtId}`);
    const list = extractList(data);
    return list.map(mapVillage);
  },
};
