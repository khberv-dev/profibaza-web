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

/** Мапперы */
const mapRegion = (r: LocationRaw): Region => ({
  id: r.id,
  nameUz: r.nameUz,
  nameRu: r.nameRu,
});
const mapDistrict = (r: LocationRaw): District => ({
  id: r.id,
  nameUz: r.nameUz,
  nameRu: r.nameRu,
  parent: r.parent as number,
});
const mapVillage = (r: LocationRaw): Village => ({
  id: r.id,
  nameUz: r.nameUz,
  nameRu: r.nameRu,
  parent: r.parent as number,
});

/** Вспомогалка: выбрать имя по языку */
export const pickName = (
  item: { nameRu: string; nameUz: string },
  lng: string | undefined
) => (lng?.startsWith("uz") ? item.nameUz : item.nameRu);

/** API */
export const locationApi = {
  getRegions: async (): Promise<Region[]> => {
    const { data } = await api.get<ListResponse>("/opt/location/regions");
    return (data.data || []).map(mapRegion);
  },

  getDistricts: async (regionId: number): Promise<District[]> => {
    const { data } = await api.get<ListResponse>(
      `/opt/location/districts/${regionId}`
    );
    return (data.data || []).map(mapDistrict);
  },

  getVillages: async (districtId: number): Promise<Village[]> => {
    const { data } = await api.get<ListResponse>(
      `/opt/location/villages/${districtId}`
    );
    return (data.data || []).map(mapVillage);
  },
};
