import { useQuery } from "@tanstack/react-query";
import { locationApi, Region, District, Village } from "../endpoints/location";

/** Ключи для кэша */
export const REGIONS_QK = ["location", "regions"] as const;
export const DISTRICTS_QK = (regionId?: number) =>
  ["location", "districts", regionId ?? "none"] as const;
export const VILLAGES_QK = (districtId?: number) =>
  ["location", "villages", districtId ?? "none"] as const;


export type LocalizedName = {
  nameRu?: string;
  nameUz?: string;
  titleRu?: string;
  titleUz?: string;
  name?: string;
};

export function pickName(
  obj: LocalizedName | null | undefined,
  lang: 'ru' | 'uz' = 'ru',
  fallback = '—'
): string {
  if (!obj) return fallback;

  const ru = obj.nameRu || obj.titleRu || obj.name;
  const uz = obj.nameUz || obj.titleUz || obj.name;

  return lang === 'uz'
    ? uz || ru || fallback
    : ru || uz || fallback;
}
/** Регионы */
export const useRegions = () =>
  useQuery<Region[]>({
    queryKey: REGIONS_QK,
    queryFn: locationApi.getRegions,
    staleTime: 24 * 60 * 60 * 1000, // 24h
    gcTime: 24 * 60 * 60 * 1000,
    retry: 0,
  });

/** Районы по региону */
export const useDistricts = (regionId?: number) =>
  useQuery<District[]>({
    enabled: !!regionId,
    queryKey: DISTRICTS_QK(regionId),
    queryFn: () => locationApi.getDistricts(regionId as number),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 0,
  });

/** Посёлки/махалли по району */
export const useVillages = (districtId?: number) =>
  useQuery<Village[]>({
    enabled: !!districtId,
    queryKey: VILLAGES_QK(districtId),
    queryFn: () => locationApi.getVillages(districtId as number),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 0,
  });
