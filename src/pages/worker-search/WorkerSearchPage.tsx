// src/features/worker-search/WorkerSearchPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CustomInput } from "../../components/custom-input/CustomInput";
import {
  HHAvatarImage,
  HHName,
  HHSub,
  HHStatuses,
  HHStatus,
  HHMeta,
  HHRating,
  IconBtn,
  OpenBtn,
  PageWrap,
  PageHeader,
  PageTitle,
  PageSubtitle,
  ResultsBar,
  ResultsCount,
  ToolbarShell,
  Toolbar,
  SearchInputWrap,
  ProfPickWrap,
  ProfPickBtn,
  ProfPickClear,
  ProfPickChevron,
  FilterBtn,
  SearchBtn,
  FiltersPanel,
  List,
  FilterField,
  FieldLabel,
  MapEmbed,
  GeoControls,
  GeoHint,
  GeoInput,
  GeoRemoveBtn,
  GeoRow,
  FindCard,
  FindCardTop,
  FindCardBody,
  FindCardFooter,
  CardIconRow,
  ProfBadge,
  PriceHighlight,
  EmptyWrap,
  ResultsStagger,
} from "./worker-search.style";
import { StaggerItem } from "../../components/Stagger";
import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";
import CustomSelect, {
  SelectOption,
} from "../../components/custom-select/CustomSelect";
import {
  getProfessions,
  Profession,
  ProfessionCategory,
} from "../../shared/modules/worker";
import { SearchWorker, searchWorkers } from "../../shared/endpoints/client";
import { Heart, Share2, SlidersHorizontal } from "lucide-react";
import { Rate } from "antd";
import {
  MapLocation,
  MapYandexLocations,
} from "../../components/map/MapYandexLocations";
import {
  District,
  locationApi,
  pickName,
  Region,
  Village,
} from "../../shared/endpoints/location";
import { FaChevronDown, FaXmark } from "react-icons/fa6";
import { ProfessionsModal } from "./ProfessionsModal";
import { useDistricts, useRegions, useVillages } from "../../shared/modules/location";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* ========== helpers ========== */
const useCompactLayout = () => {
  const [compact, setCompact] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return compact;
};

const fmtMoney = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("ru-RU") + " сум" : "—";

const fio = (u?: {
  name?: string;
  surname?: string;
  middleName?: string | null;
}) => [u?.surname, u?.name].filter(Boolean).join(" ") || "Мастер";

const AVATAR_CDN = "https://profibaza.uz/public/avatar/";
const ANON_AVATAR = "/avatar.png";

const workerAvatarSrc = (avatarId?: string | null) =>
  avatarId ? `${AVATAR_CDN}${avatarId}` : ANON_AVATAR;

const onAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = ANON_AVATAR;
};

const fmtUpdated = (d?: string) => {
  if (!d) return "—";
  const dd = new Date(d);
  if (Number.isNaN(dd.getTime())) return "—";
  return dd.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ========== lightweight skeleton CSS ========== */
const skeletonCSS = `
.skel {
  position: relative;
  overflow: hidden;
  background: #f1f5f9;
  border-radius: 10px;
}
.skel::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, rgba(241,245,249,0) 0%, rgba(241,245,249,0) 20%, rgba(255,255,255,0.6) 40%, rgba(241,245,249,0) 60%, rgba(241,245,249,0) 100%);
  animation: skel 1.2s infinite;
}
@keyframes skel { 100% { transform: translateX(100%); } }
`;

type AppliedFilters = {
  professions?: string;
  minPrice?: number;
  maxPrice?: number;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
};

type PriceForm = { minPrice: string; maxPrice: string };

export const WorkerSearchPage: React.FC = () => {
  const { t } = useTranslation();
  const isCompact = useCompactLayout();
  const filterMapHeight = isCompact ? 240 : 320;
  const emptyMapHeight = isCompact ? 280 : 420;
  const lang = (localStorage.getItem("i18nextLng") || "ru").split("-")[0] as
    | "ru"
    | "uz";

  /* === Геозона === */
  const DEFAULT_RADIUS = 10; // км
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [useMyGeo, setUseMyGeo] = useState(false);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "ok" | "denied" | "error"
  >("idle");
  const [regionId, setRegionId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [villageId, setVillageId] = useState<number | null>(null);

  const { data: regions = [], isLoading: regionsLoading } = useRegions();
  const { data: districts = [], isLoading: districtsLoading } = useDistricts(
    regionId ?? undefined
  );
  const { data: villages = [], isLoading: villagesLoading } = useVillages(
    districtId ?? undefined
  );

  const onAddLoc = (loc: MapLocation) => setLocations([loc]);
  const onChangeLoc = (index: number, next: MapLocation) =>
    setLocations((prev) => {
      const cp = [...prev];
      cp[index] = next;
      return cp.slice(0, 1);
    });
  const onRemoveLoc = (_index: number) => setLocations([]);

  /* === Фильтры === */
  const [professionId, setProfessionId] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { control, getValues, setValue } = useForm<PriceForm>({
    defaultValues: { minPrice: "", maxPrice: "" },
  });

  /* === Справочник профессий === */
  const { data: profCats = [], isLoading: profLoading } = useQuery<
    ProfessionCategory[]
  >({
    queryKey: ["opt", "professions"],
    queryFn: ({ signal }) => getProfessions(signal),
    staleTime: 5 * 60 * 1000,
  });

  const flatProfs: Profession[] = useMemo(
    () =>
      profCats.flatMap((c) =>
        (c.professions || []).map((p) => ({
          ...p,
          categoryId: p.categoryId ?? c.id,
        }))
      ),
    [profCats]
  );

  const profOptions: SelectOption[] = useMemo(
    () =>
      flatProfs.map((p) => ({
        value: p.id,
        label: lang === "uz" ? (p as any).nameUz : (p as any).nameRu,
      })),
    [flatProfs, lang]
  );

  const profLabelById = (id?: string) => {
    const found = flatProfs.find((p) => p.id === id);
    if (!found) return "—";
    return lang === "uz" ? (found as any).nameUz : (found as any).nameRu;
  };

  const regionOptions: SelectOption[] = useMemo(
    () =>
      (regions ?? []).map((r) => ({ value: r.id, label: pickName(r, lang) })),
    [regions, lang]
  );

  const districtOptions: SelectOption[] = useMemo(
    () =>
      (districts ?? []).map((d) => ({
        value: d.id,
        label: pickName(d, lang),
      })),
    [districts, lang]
  );

  const villageOptions: SelectOption[] = useMemo(
    () =>
      (villages ?? []).map((v) => ({
        value: v.id,
        label: pickName(v, lang),
      })),
    [villages, lang]
  );

  /* === Применённые фильтры === */
  const [applied, setApplied] = useState<AppliedFilters | null>(null);

  const regionName = useMemo(() => {
    if (regionId == null) return null;
    const obj = regions.find((r) => r.id === regionId);
    return obj ? pickName(obj, lang) : null;
  }, [regions, regionId, lang]);

  const districtName = useMemo(() => {
    if (districtId == null) return null;
    const obj = districts.find((d) => d.id === districtId);
    return obj ? pickName(obj, lang) : null;
  }, [districts, districtId, lang]);

  const villageName = useMemo(() => {
    if (villageId == null) return null;
    const obj = villages.find((v) => v.id === villageId);
    return obj ? pickName(obj, lang) : null;
  }, [villages, villageId, lang]);

  /* Геолокация браузера (опционально) */
  useEffect(() => {
    if (!useMyGeo) return;
    if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("idle");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocations([{ latitude, longitude, radius: DEFAULT_RADIUS }]);
        setGeoStatus("ok");

        if (professionId) {
          const { mn, mx } = parseNums();
          setApplied((prev) => ({
            ...(prev ?? {}),
            ...(professionId ? { professions: professionId } : {}),
            ...(mn > 0 ? { minPrice: mn } : {}),
            ...(mx > 0 ? { maxPrice: mx } : {}),
            address1: regionName,
            address2: districtName,
            address3: villageName,
          }));
        }
      },
      (err) =>
        setGeoStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 10_000 }
    );
  }, [useMyGeo, professionId]);

  /* Парс чисел */
  const parseNums = () => {
    const { minPrice, maxPrice } = getValues();
    const min = Number((minPrice || "").replace(/\D/g, "")) || 0;
    const max = Number((maxPrice || "").replace(/\D/g, "")) || 0;
    const [mn, mx] = min <= max ? [min, max] : [max, min];
    return { mn, mx };
  };

  /* Текущая гео-зона для запроса */
  const currentGeo = () => {
    const first = locations[0];
    if (!first) return null;
    return { long: first.longitude, lat: first.latitude, radius: first.radius };
  };

  /* Управление фильтрами */
  const onSearch = () => {
    const { mn, mx } = parseNums();
    const payload: AppliedFilters = {};
    if (professionId) payload.professions = professionId;
    if (mn > 0) payload.minPrice = mn;
    if (mx > 0) payload.maxPrice = mx;
    if (regionName) payload.address1 = regionName;
    if (districtName) payload.address2 = districtName;
    if (villageName) payload.address3 = villageName;
    setApplied(payload);
  };

  // <<< add: resetAll
  const resetAll = () => {
    // сбрасываем локальные стейты фильтров
    setProfessionId("");
    setRegionId(null);
    setDistrictId(null);
    setVillageId(null);
    setLocations([]);
    // сбрасываем цены в форме
    setValue("minPrice", "");
    setValue("maxPrice", "");
    // applied -> пустой объект, чтобы дернулся запрос без фильтров
    setApplied({});
  };
  // >>> end add

  useEffect(() => {
    // первый запрос без фильтров
    setApplied({});
  }, []);

  const findById = <T extends { id: unknown }>(
    arr: T[],
    id: string | number | null | undefined
  ) => (id == null ? undefined : arr.find((x) => String(x.id) === String(id)));

  const onChangeProfession = (v: string | number | null) => {
    const id = String(v ?? "");
    setProfessionId(id);
    const { mn, mx } = parseNums();

    setApplied((prev) => {
      const base: AppliedFilters = { ...(prev ?? {}) };
      if (professionId) base.professions = professionId;
      else delete base.professions;

      if (!prev?.minPrice) delete base.minPrice;
      if (!prev?.maxPrice) delete base.maxPrice;

      const region = findById(regions, id);
      base.address1 = region ? pickName(region, lang) : null;
      base.address2 = null;
      base.address3 = null;
      return base;
    });
  };

  /* Результаты */
  const { data: results = [], isFetching } = useQuery<SearchWorker[]>({
    queryKey: ["opt", "order-search", applied, locations],
    queryFn: ({ signal }) => {
      if (!applied) return Promise.resolve([]);
      const geo = currentGeo();

      const params: any = {};
      if (professionId) params.professions = professionId;
      if (typeof applied.minPrice === "number" && applied.minPrice > 0) {
        params.minPrice = applied.minPrice;
      }
      if (typeof applied.maxPrice === "number" && applied.maxPrice > 0) {
        params.maxPrice = applied.maxPrice;
      }
      if (geo)
        Object.assign(params, {
          long: geo.long,
          lat: geo.lat,
          radius: geo.radius,
        });
      if (applied.address1) params.address1 = applied.address1;
      if (applied.address2) params.address2 = applied.address2;
      if (applied.address3) params.address3 = applied.address3;

      return searchWorkers(params, signal);
    },
    enabled: Boolean(applied),
  });

  /* Скелетоны */
  const showToolbarSkeleton = profLoading;
  const showListSkeleton = isFetching && !results.length;

  const [profModalOpen, setProfModalOpen] = useState(false);
  const selectedProfLabel = useMemo(() => {
    const found = flatProfs.find((p) => p.id === professionId);
    return found
      ? lang === "uz"
        ? (found as any).nameUz
        : (found as any).nameRu
      : "";
  }, [flatProfs, professionId, lang]);

  return (
    <PageWrap>
      <style>{skeletonCSS}</style>

      <motion.div initial="hidden" animate="show" variants={fadeUp(0)}>
      <PageHeader>
        <PageTitle>{t("nav.find")}</PageTitle>
        <PageSubtitle>{t("searchPlaceholder")}</PageSubtitle>
      </PageHeader>
      </motion.div>

      <ToolbarShell>
      {/* ===== Тулбар ===== */}
      <Toolbar>
        {showToolbarSkeleton ? (
          <SearchInputWrap>
            <div className="select-wrap" style={{ width: "100%" }}>
              <div className="skel" style={{ height: 44, borderRadius: 12 }} />
            </div>
          </SearchInputWrap>
        ) : (
          <SearchInputWrap>
            <ProfPickWrap>
              <ProfPickBtn
                type="button"
                $filled={!!selectedProfLabel}
                onClick={() => setProfModalOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={profModalOpen}
              >
                <SlidersHorizontal
                  style={{
                    color: selectedProfLabel ? "#2563eb" : "#cbd5e1",
                    flexShrink: 0,
                  }}
                  size={16}
                />
                <span className="label">
                  {selectedProfLabel ||
                    (profLoading ? "Загрузка…" : "Выберите профессию")}
                </span>

                {selectedProfLabel && (
                  <ProfPickClear
                    role="button"
                    title="Очистить"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfessionId("");
                      setApplied((prev) => {
                        const next = { ...(prev ?? {}) } as any;
                        delete next.professions;
                        return next;
                      });
                    }}
                  >
                    <FaXmark />
                  </ProfPickClear>
                )}

                <ProfPickChevron>
                  <FaChevronDown size={12} />
                </ProfPickChevron>
              </ProfPickBtn>
            </ProfPickWrap>
          </SearchInputWrap>
        )}

        <FilterBtn
          onClick={() => setShowFilters((v) => !v)}
          disabled={showToolbarSkeleton}
        >
          Фильтры
        </FilterBtn>
        <FilterBtn
            onClick={resetAll}
        >
          Сбросить
        </FilterBtn>

        <SearchBtn onClick={onSearch}>Найти</SearchBtn>

        {/* <<< add: кнопка сброса фильтров */}
       
        {/* >>> end add */}
      </Toolbar>
      </ToolbarShell>

      {/* ===== Панель фильтров ===== */}
      <FiltersPanel $open={showFilters}>
   
        <div className="field">
          <CustomInput
            control={control}
            name="minPrice"
            label="Минимальная цена *"
            placeholder="0"
            rules={{
              required: "Укажите минимальную цену",
              validate: (v: string) => /^\d*$/.test(v ?? "") || "Только цифры",
            }}
          />
        </div>

        <FilterField className="field">
          <FieldLabel>Область</FieldLabel>
          <CustomSelect
            id="region"
            placeholder={regionsLoading ? "Загрузка…" : "Выберите область"}
            options={regions.map((r) => ({
              value: r.id,
              label: pickName(r, lang),
            }))}
            value={regionId ?? null}
            loading={regionsLoading}
            onChange={(v) => {
              const id = v === null ? null : Number(v);
              setRegionId(id);
              setDistrictId(null);
              setVillageId(null);

              const selectedRegion =
                id == null ? null : regions.find((r) => r.id === id);
              setApplied((prev) => ({
                ...(prev ?? {}),
                ...(professionId ? { professions: professionId } : {}),
                address1: selectedRegion ? pickName(selectedRegion, lang) : null,
                address2: null,
                address3: null,
              }));
            }}
            width="100%"
          />
        </FilterField>

        <FilterField className="field">
          <FieldLabel>Район</FieldLabel>
          <CustomSelect
            id="district"
            placeholder={
              regionId == null
                ? "Сначала выберите область"
                : districtsLoading
                ? "Загрузка…"
                : "Выберите район"
            }
            disabled={regionId == null}
            options={districts.map((d) => ({
              value: d.id,
              label: pickName(d, lang),
            }))}
            value={districtId ?? null}
            loading={districtsLoading}
            onChange={(v) => {
              const id = v === null ? null : Number(v);
              setDistrictId(id);
              setVillageId(null);

              const selectedRegion =
                regionId == null
                  ? null
                  : regions.find((r) => r.id === regionId);
              const selectedDistrict =
                id == null ? null : districts.find((d) => d.id === id);
              const { mn, mx } = parseNums();

              setApplied({
                ...(professionId ? { professions: professionId } : {}),
                ...(mn > 0 ? { minPrice: mn } : {}),
                ...(mx > 0 ? { maxPrice: mx } : {}),
                address1: selectedRegion ? pickName(selectedRegion, lang) : null,
                address2: selectedDistrict
                  ? pickName(selectedDistrict, lang)
                  : null,
                address3: null,
              });
            }}
            width="100%"
          />
        </FilterField>

        <FilterField className="field">
          <FieldLabel>Махалля</FieldLabel>
          <CustomSelect
            id="village"
            placeholder={
              districtId == null
                ? "Сначала выберите район"
                : villagesLoading
                ? "Загрузка…"
                : "Выберите махаллю"
            }
            disabled={districtId == null}
            options={villages.map((v) => ({
              value: v.id,
              label: pickName(v, lang),
            }))}
            value={villageId ?? null}
            loading={villagesLoading}
            onChange={(v) => {
              const id = v === null ? null : Number(v);
              setVillageId(id);

              const selectedRegion =
                regionId == null
                  ? null
                  : regions.find((r) => r.id === regionId);
              const selectedDistrict =
                districtId == null
                  ? null
                  : districts.find((d) => d.id === districtId);
              const selectedVillage =
                id == null ? null : villages.find((vl) => vl.id === id);
              const { mn, mx } = parseNums();

              setApplied({
                ...(professionId ? { professions: professionId } : {}),
                ...(mn > 0 ? { minPrice: mn } : {}),
                ...(mx > 0 ? { maxPrice: mx } : {}),
                address1: selectedRegion ? pickName(selectedRegion, lang) : null,
                address2: selectedDistrict
                  ? pickName(selectedDistrict, lang)
                  : null,
                address3: selectedVillage
                  ? pickName(selectedVillage, lang)
                  : null,
              });
            }}
            width="100%"
          />
        </FilterField>

        <div className="field">
          <CustomInput
            control={control}
            name="maxPrice"
            label="Максимальная цена *"
            placeholder="1000000000"
            rules={{
              required: "Укажите максимальную цену",
              validate: (v: string) => /^\d*$/.test(v ?? "") || "Только цифры",
            }}
          />
        </div>

        {/* === Карта локации === */}
        <FilterField className="field">
          <FieldLabel>Локация (по желанию)</FieldLabel>

          <MapEmbed>
            <MapYandexLocations
              apiKey={import.meta.env.VITE_YMAPS_KEY}
              locations={locations}
              onAdd={onAddLoc}
              onChange={onChangeLoc}
              onRemove={onRemoveLoc}
              height={filterMapHeight}
            />
          </MapEmbed>

          {!!locations.length && (
            <GeoControls>
              <GeoHint>
                Долгота: <b>{locations[0].longitude}</b> | Широта:{" "}
                <b>{locations[0].latitude}</b>
              </GeoHint>
              <GeoRow>
                <span style={{ fontSize: 12, opacity: 0.8 }}>Радиус:</span>
                <GeoInput
                  type="number"
                  step="0.001"
                  min={0}
                  value={locations[0].radius}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onChangeLoc(0, {
                      ...locations[0],
                      radius: Number.isFinite(val) ? val : 0,
                    });
                  }}
                />
                <GeoHint>единицы как в бек (см. примеры)</GeoHint>
              </GeoRow>

              <GeoRemoveBtn type="button" onClick={() => onRemoveLoc(0)}>
                Удалить зону
              </GeoRemoveBtn>
            </GeoControls>
          )}
        </FilterField>
      </FiltersPanel>

      {!showListSkeleton && results.length > 0 && (
        <ResultsBar>
          <ResultsCount>
            {results.length}{" "}
            <span>
              {results.length === 1
                ? "специалист"
                : results.length < 5
                ? "специалиста"
                : "специалистов"}
            </span>
          </ResultsCount>
        </ResultsBar>
      )}

      {/* ===== Список ===== */}
      <List>
        {showListSkeleton ? (
          <>
            {Array.from({ length: isCompact ? 3 : 6 }).map((_, i) => (
              <FindCard key={`skel-${i}`}>
                <FindCardTop>
                  <div
                    className="skel"
                    style={{ width: 64, height: 64, borderRadius: "50%" }}
                  />
                  <div
                    className="skel"
                    style={{ width: 72, height: 24, borderRadius: 999 }}
                  />
                </FindCardTop>
                <FindCardBody>
                  <div
                    className="skel"
                    style={{ width: "72%", height: 18, borderRadius: 6 }}
                  />
                  <div
                    className="skel"
                    style={{ width: "48%", height: 12, borderRadius: 6 }}
                  />
                  <div
                    className="skel"
                    style={{ width: 110, height: 26, borderRadius: 999 }}
                  />
                  <div
                    className="skel"
                    style={{ width: "85%", height: 14, borderRadius: 6 }}
                  />
                  <div
                    className="skel"
                    style={{ width: "62%", height: 16, borderRadius: 6 }}
                  />
                </FindCardBody>
                <FindCardFooter>
                  <div
                    className="skel"
                    style={{ width: 76, height: 36, borderRadius: 10 }}
                  />
                  <div
                    className="skel"
                    style={{ width: 104, height: 40, borderRadius: 11 }}
                  />
                </FindCardFooter>
              </FindCard>
            ))}
          </>
        ) : results.length === 0 ? (
          <EmptyWrap role="status" aria-live="polite">
            <h3>В выбранном регионе не нашлось специалистов</h3>
            <p>
              Попробуйте расширить радиус поиска, снять часть фильтров или
              выбрать другую профессию.
            </p>

            <MapEmbed>
              <MapYandexLocations
                apiKey={import.meta.env.VITE_YMAPS_KEY}
                locations={locations}
                onAdd={onAddLoc}
                onChange={onChangeLoc}
                onRemove={onRemoveLoc}
                height={emptyMapHeight}
              />
            </MapEmbed>

            <div className="actions">
              {/* теперь эта кнопка реально работает */}
              <button
                type="button"
                className="btn"
                onClick={resetAll} // <<< add
              >
                Сбросить фильтры
              </button>

              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  if (locations[0]) {
                    const r = locations[0].radius ?? 10;
                    onChangeLoc(0, {
                      ...locations[0],
                      radius: Math.max(r * 2, 10),
                    });
                    if (professionId) {
                      const min =
                        Number(
                          (getValues().minPrice || "").replace(/\D/g, "")
                        ) || 0;
                      const max =
                        Number(
                          (getValues().maxPrice || "").replace(/\D/g, ""
                          )) || 1_000_000_000;
                      const [mn, mx] = min <= max ? [min, max] : [max, min];
                      setApplied({
                        professions: professionId,
                        minPrice: mn,
                        maxPrice: mx,
                        address1: regionName,
                        address2: districtName,
                        address3: villageName,
                      });
                    }
                  } else {
                    setShowFilters(true);
                  }
                }}
              >
                Увеличить радиус
              </button>
            </div>

            <div className="hint">
              Совет: отметьте точку на карте или включите геолокацию — так мы
              покажем специалистов рядом.
            </div>
          </EmptyWrap>
        ) : (
          <ResultsStagger>
          {results.map((row: SearchWorker) => (
            <StaggerItem key={row.id}>
            <FindCard
              role="article"
              aria-label={`${fio(row.worker?.user)} — ${profLabelById(
                row.professionId
              )}`}
            >
              <FindCardTop>
                <HHAvatarImage
                  src={workerAvatarSrc(row.worker?.user?.avatar)}
                  alt=""
                  onError={onAvatarError}
                />

                <HHStatuses>
                  {row.isBusy ? (
                    <HHStatus $tone="red" title="Мастер сейчас занят на заказе">
                      Занят
                    </HHStatus>
                  ) : (
                    <HHStatus $tone="green" title="Готов принимать заказы">
                      Свободен
                    </HHStatus>
                  )}

                  {typeof (row as any).inArea === "boolean" && (
                    <HHStatus $tone={row.inArea ? "blue" : "gray"}>
                      {row.inArea ? "В радиусе" : "Далеко"}
                    </HHStatus>
                  )}
                </HHStatuses>
              </FindCardTop>

              <FindCardBody>
                <div>
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to={{
                      pathname: `/find/worker/${encodeURIComponent(row.id)}`,
                    }}
                  >
                    <HHName>{fio(row.worker?.user)}</HHName>
                  </Link>
                  <HHSub>
                    {fmtUpdated(row.updatedAt) !== "—"
                      ? "Обновлено " + fmtUpdated(row.updatedAt)
                      : ""}
                  </HHSub>
                </div>

                <ProfBadge title={profLabelById(row.professionId)}>
                  {profLabelById(row.professionId)}
                </ProfBadge>

                <HHRating>
                  <Rate
                    allowHalf
                    disabled
                    value={row.rating ?? 0}
                    style={{ fontSize: isCompact ? 11 : 13 }}
                  />
                  <strong>{(row.rating ?? 0).toFixed(1)}</strong>
                </HHRating>

                <HHMeta>
                  <li>
                    <span className="k">Занятость:</span>
                    <span className="v">
                      {t(`worker.jobTypes.${row.jobType}`)}
                    </span>
                  </li>
                  <li>
                    <span className="k">Формат:</span>
                    <span className="v">на объекте</span>
                  </li>
                </HHMeta>

                <PriceHighlight>
                  {fmtMoney(row.minPrice)} — {fmtMoney(row.maxPrice)}
                </PriceHighlight>
              </FindCardBody>

              <FindCardFooter>
                <CardIconRow>
                  <IconBtn title="Поделиться" aria-label="Поделиться">
                    <Share2 size={17} />
                  </IconBtn>
                  <IconBtn title="В избранное" aria-label="В избранное">
                    <Heart size={17} />
                  </IconBtn>
                </CardIconRow>

                <OpenBtn
                  type="button"
                  $compact
                  onClick={() => {
                    const url = new URL(
                      "/app/client/create-order",
                      window.location.origin
                    );
                    url.searchParams.set("workerProfessionId", row.id);
                    window.location.href = url.toString();
                  }}
                >
                  Заказать
                </OpenBtn>
              </FindCardFooter>
            </FindCard>
            </StaggerItem>
          ))}
          </ResultsStagger>
        )}
      </List>

      <ProfessionsModal
        open={profModalOpen}
        onClose={() => setProfModalOpen(false)}
        categories={profCats}
        lang={lang}
        popularIds={[]}
        selectedId={professionId}
        onSelect={(p: any) => {
          setProfessionId(p.id);
          setApplied((prev) => ({ ...(prev ?? {}), professions: p.id }));
          setProfModalOpen(false);
        }}
      />
    </PageWrap>
  );
};

export default WorkerSearchPage;
