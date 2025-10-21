// src/features/worker-search/WorkerSearchPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CustomInput } from "../../components/custom-input/CustomInput";
import {
  HHCard,
  HHLeft,
  HHAvatar,
  HHMid,
  HHHead,
  HHName,
  HHSub,
  HHStatuses,
  HHStatus,
  HHChips,
  HHChip,
  HHMeta,
  HHDivider,
  HHBottom,
  HHPrice,
  HHRating,
  HHRight,
  IconBtn,
  OpenBtn,
  PageWrap,
  Toolbar,
  SearchInputWrap,
  FilterBtn,
  SearchBtn,
  FiltersPanel,
  List,
} from "./worker-search.style";
import CustomSelect, {
  SelectOption,
} from "../../components/custom-select/CustomSelect";
import {
  getProfessions,
  Profession,
  ProfessionCategory,
} from "../../shared/modules/worker";
import { SearchWorker, searchWorkers } from "../../shared/endpoints/client";
import { Heart, Share2 } from "lucide-react";
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

/* ========== helpers ========== */
const fmtMoney = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("ru-RU") + " сум" : "—";

const fio = (u?: {
  name?: string;
  surname?: string;
  middleName?: string | null;
}) => [u?.surname, u?.name].filter(Boolean).join(" ") || "Мастер";

const initials = (u?: { name?: string; surname?: string }) =>
  ((u?.surname?.[0] ?? "") + (u?.name?.[0] ?? "")).toUpperCase() || "M";

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

/* ========== lightweight skeleton CSS (одноразовая вставка на странице) ========== */
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

/* ========== empty state CSS ========== */
const emptyCSS = `
.empty {
  background: #f1f4f9;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
}
.empty h3 {
  margin: 10px 0 6px;
  font-size: 23px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}
.empty p {
  margin: 0;
  color: #64748b;
  margin-bottom: 14px;
  font-size: 14px;
}
.empty .actions {
  margin-top: 14px;
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
.empty .btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e7ecf3;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
}
.empty .btn.primary {
  background: #1e5cfb;
  border-color: #1e5cfb;
  color: #fff;
}
.empty .hint {
  margin-top: 10px;
  font-size: 12px;
  color: #94a3b8;
}
`;

type PriceForm = { minPrice: string; maxPrice: string };

export const WorkerSearchPage: React.FC = () => {
  const lang = (localStorage.getItem("i18nextLng") || "ru").split("-")[0] as
    | "ru"
    | "uz";

  /* === Геозона === */
  const DEFAULT_RADIUS = 10; // км
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [useMyGeo, setUseMyGeo] = useState(true);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "ok" | "denied" | "error"
  >("idle");
  const [regionId, setRegionId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [villageId, setVillageId] = useState<number | null>(null);

  const { data: regions = [], isLoading: regionsLoading } = useQuery<Region[]>({
    queryKey: ["opt", "regions"],
    queryFn: () => locationApi.getRegions(),
    staleTime: 5 * 60 * 1000,
  });

  // Районы (зависит от выбранной области)
  const { data: districts = [], isLoading: districtsLoading } = useQuery<
    District[]
  >({
    queryKey: ["opt", "districts", regionId],
    queryFn: () =>
      regionId ? locationApi.getDistricts(regionId) : Promise.resolve([]),
    enabled: regionId != null,
    staleTime: 5 * 60 * 1000,
  });

  // Махалли (зависит от выбранного района)
  const { data: villages = [], isLoading: villagesLoading } = useQuery<
    Village[]
  >({
    queryKey: ["opt", "villages", districtId],
    queryFn: () =>
      districtId ? locationApi.getVillages(districtId) : Promise.resolve([]),
    enabled: districtId != null,
    staleTime: 5 * 60 * 1000,
  });

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
    defaultValues: { minPrice: "0", maxPrice: "1000000000" },
  });

  /* === Справочник профессий === */
  const { data: profCats = [], isLoading: profLoading } = useQuery<
    ProfessionCategory[]
  >({
    queryKey: ["opt", "professions"],
    queryFn: ({ signal }) => getProfessions(signal), // -> ProfessionCategory[]
    staleTime: 5 * 60 * 1000,
  });

  const flatProfs: Profession[] = useMemo(
    () =>
      profCats.flatMap((c) =>
        (c.professions || []).map((p) => ({
          ...p,
          // гарантируем наличие categoryId: если вдруг нет — ставим id категории
          categoryId: p.categoryId ?? c.id,
        }))
      ),
    [profCats]
  );

  // 4) Опции селекта строим из flatProfs
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
      regions.map((r) => ({
        value: r.id,
        label: pickName(r, lang),
      })),
    [regions, lang]
  );

  const districtOptions: SelectOption[] = useMemo(
    () =>
      districts.map((d) => ({
        value: d.id,
        label: pickName(d, lang),
      })),
    [districts, lang]
  );

  const villageOptions: SelectOption[] = useMemo(
    () =>
      villages.map((v) => ({
        value: v.id,
        label: pickName(v, lang),
      })),
    [villages, lang]
  );

  /* === Применённые фильтры === */
  const [applied, setApplied] = useState<{
    professions: string;
    minPrice: number;
    maxPrice: number;
    address1?: string | null; // область
    address2?: string | null; // район
    address3?: string | null; // махалля/улица (если понадобится)
  } | null>(null);

  const regionName = useMemo(
    () =>
      regions.find((r) => r.id === regionId)
        ? pickName(regions.find((r) => r.id === regionId)!, lang)
        : null,
    [regions, regionId, lang]
  );
  const districtName = useMemo(
    () =>
      districts.find((d) => d.id === districtId)
        ? pickName(districts.find((d) => d.id === districtId)!, lang)
        : null,
    [districts, districtId, lang]
  );
  const villageName = useMemo(
    () =>
      villages.find((v) => v.id === villageId)
        ? pickName(villages.find((v) => v.id === villageId)!, lang)
        : null,
    [villages, villageId, lang]
  );

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
          setApplied({
            professions: professionId,
            minPrice: mn,
            maxPrice: mx,
            address1: regionName,
            address2: districtName,
            address3: villageName,
          });
        }
      },
      (err) =>
        setGeoStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 10_000 }
    );
  }, [useMyGeo, professionId]);

  /* Автоинициализация: выбрать первую профессию и запустить поиск */
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    if (profOptions.length) {
      const first = String(profOptions[0].value);
      setProfessionId(first);
      const { minPrice, maxPrice } = getValues();
      setApplied({
        professions: first,
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 1_000_000_000,
      });
      didInit.current = true;
    }
  }, [profOptions, getValues]);

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
    if (!professionId) return;
    const { mn, mx } = parseNums();
    setApplied({
      professions: professionId,
      minPrice: mn,
      maxPrice: mx,
      address1: regionName,
      address2: districtName,
      address3: villageName, // можешь не отправлять, если бек это не использует
    });
  };

  const onChangeProfession = (v: string | number | null) => {
    const id = String(v || "");
    setProfessionId(id);
    if (!id) return;
    const { mn, mx } = parseNums();
    setApplied({
      professions: id,
      minPrice: mn,
      maxPrice: mx,
      address1: regionName,
      address2: districtName,
      address3: villageName,
    });
  };

  const resetAll = () => {
    setValue("minPrice", "0");
    setValue("maxPrice", "1000000000");
    setLocations([]);

    // сброс каскада локаций
    setRegionId(null);
    setDistrictId(null);
    setVillageId(null);

    if (flatProfs.length) {
      const first = String(flatProfs[0].id);
      setProfessionId(first);
      setApplied({
        professions: first,
        minPrice: 0,
        maxPrice: 1_000_000_000,
        address1: regionName,
        address2: districtName,
        address3: villageName,
      });
    } else {
      setProfessionId("");
      setApplied(null);
    }
  };

  /* Результаты */
  const { data: results = [], isFetching } = useQuery<SearchWorker[]>({
    queryKey: ["opt", "order-search", applied, locations],
    queryFn: ({ signal }) => {
      if (!applied) return Promise.resolve([]);
      const geo = currentGeo();
      return searchWorkers(
        {
          professions: applied.professions,
          minPrice: applied.minPrice,
          maxPrice: applied.maxPrice,
          ...(geo ? { long: geo.long, lat: geo.lat, radius: geo.radius } : {}),
          ...(applied.address1 ? { address1: applied.address1 } : {}),
          ...(applied.address2 ? { address2: applied.address2 } : {}),
          ...(applied.address3 ? { address3: applied.address3 } : {}),
        },
        signal
      );
    },
    enabled: Boolean(applied),
  });

  /* Скелетоны: тулбар и список */
  const showToolbarSkeleton = profLoading;
  const showListSkeleton = isFetching && !results.length;

  return (
    <PageWrap>
      {/* одноразовая вставка стилей */}
      <style>{skeletonCSS}</style>
      <style>{emptyCSS}</style>

      {/* ===== Тулбар ===== */}
      <Toolbar>
        {showToolbarSkeleton ? (
          <SearchInputWrap>
            <div className="select-wrap" style={{ width: 280 }}>
              <div className="skel" style={{ height: 40, borderRadius: 12 }} />
            </div>
          </SearchInputWrap>
        ) : (
          <SearchInputWrap>
            <div className="select-wrap">
              <CustomSelect
                id="prof-search"
                options={profOptions}
                value={professionId || null}
                onChange={(v) => onChangeProfession(v)}
                placeholder={profLoading ? "Загрузка…" : "Профессия"}
                loading={profLoading}
                width="100%"
              />
            </div>
          </SearchInputWrap>
        )}

        <FilterBtn
          onClick={() => setShowFilters((v) => !v)}
          disabled={showToolbarSkeleton}
        >
          Фильтры
        </FilterBtn>

        <SearchBtn
          onClick={onSearch}
          disabled={!professionId || showToolbarSkeleton}
        >
          Найти
        </SearchBtn>
      </Toolbar>

      {/* ===== Панель фильтров (цены + карта) ===== */}
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

        <div className="field" style={{ minWidth: 240 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Область
          </label>
          <CustomSelect
            id="region"
            placeholder={regionsLoading ? "Загрузка…" : "Выберите область"}
            options={regionOptions}
            value={regionId ?? null}
            loading={regionsLoading}
            onChange={(v) => {
              const id = v === null ? null : Number(v);
              setRegionId(id);
              // сбрасываем ниже по каскаду
              setDistrictId(null);
              setVillageId(null);
              // обновляем applied (если уже есть профессия)
              if (professionId) {
                const { mn, mx } = parseNums();
                setApplied({
                  professions: professionId,
                  minPrice: mn,
                  maxPrice: mx,
                  address1: regionName,
                  address2: districtName,
                  address3: villageName,
                });
              }
            }}
            width="100%"
          />
        </div>

        <div className="field" style={{ minWidth: 240 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Район
          </label>
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
            options={districtOptions}
            value={districtId ?? null}
            loading={districtsLoading}
            onChange={(v) => {
              const id = v === null ? null : Number(v);
              setDistrictId(id);
              setVillageId(null);
              if (professionId) {
                const { mn, mx } = parseNums();
                setApplied({
                  professions: professionId,
                  minPrice: mn,
                  maxPrice: mx,
                  address1: regionName,
                  address2: districtName,
                  address3: villageName,
                });
              }
            }}
            width="100%"
          />
        </div>

        <div className="field" style={{ minWidth: 240 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Махалля
          </label>
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
            options={villageOptions}
            value={villageId ?? null}
            loading={villagesLoading}
            onChange={(v) => {
              const id = v === null ? null : Number(v);
              setVillageId(id);
              if (professionId) {
                const { mn, mx } = parseNums();
                setApplied({
                  professions: professionId,
                  minPrice: mn,
                  maxPrice: mx,
                  address1: regionName,
                  address2: districtName,
                  address3: villageName,
                });
              }
            }}
            width="100%"
          />
        </div>

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
        <div className="field" style={{ width: "100%" }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Локация (по желанию)
          </label>

          <MapYandexLocations
            apiKey={import.meta.env.VITE_YMAPS_KEY}
            locations={locations}
            onAdd={onAddLoc}
            onChange={onChangeLoc}
            onRemove={onRemoveLoc}
            height={320}
          />
          {!!locations.length && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <small style={{ opacity: 0.8 }}>
                Долгота: <b>{locations[0].longitude}</b> | Широта:{" "}
                <b>{locations[0].latitude}</b>
              </small>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.8 }}>Радиус:</span>
                <input
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
                  style={{
                    width: 120,
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #e7ecf3",
                    outline: "none",
                  }}
                />
                <span style={{ fontSize: 12, opacity: 0.8 }}>
                  единицы как в бек (см. примеры)
                </span>
              </div>

              <button
                type="button"
                onClick={() => onRemoveLoc(0)}
                style={{
                  marginLeft: "auto",
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #e7ecf3",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Удалить зону
              </button>
            </div>
          )}
        </div>
      </FiltersPanel>

      {/* ===== Список ===== */}
      <List>
        {showListSkeleton ? (
          /* Скелетон карточек */
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <HHCard key={`skel-${i}`}>
                <HHLeft>
                  <div
                    className="skel"
                    style={{ width: 64, height: 64, borderRadius: "50%" }}
                  />
                </HHLeft>

                <HHMid>
                  <HHHead>
                    <div>
                      <div
                        className="skel"
                        style={{
                          width: 220,
                          height: 16,
                          borderRadius: 6,
                          marginBottom: 8,
                        }}
                      />
                      <div
                        className="skel"
                        style={{ width: 140, height: 12, borderRadius: 6 }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div
                        className="skel"
                        style={{ width: 72, height: 20, borderRadius: 999 }}
                      />
                      <div
                        className="skel"
                        style={{ width: 90, height: 20, borderRadius: 999 }}
                      />
                    </div>
                  </HHHead>

                  <HHChips>
                    <div
                      className="skel"
                      style={{ width: 120, height: 22, borderRadius: 999 }}
                    />
                    <div
                      className="skel"
                      style={{ width: 100, height: 22, borderRadius: 999 }}
                    />
                    <div
                      className="skel"
                      style={{ width: 80, height: 22, borderRadius: 999 }}
                    />
                  </HHChips>

                  <HHMeta>
                    <li>
                      <span className="k">Занятость:</span>
                      <span className="v">
                        <span
                          className="skel"
                          style={{
                            width: 80,
                            height: 12,
                            borderRadius: 6,
                            display: "inline-block",
                          }}
                        />
                      </span>
                    </li>
                    <li>
                      <span className="k">Формат:</span>
                      <span className="v">
                        <span
                          className="skel"
                          style={{
                            width: 70,
                            height: 12,
                            borderRadius: 6,
                            display: "inline-block",
                          }}
                        />
                      </span>
                    </li>
                  </HHMeta>

                  <HHDivider />

                  <HHBottom>
                    <div
                      className="skel"
                      style={{ width: 180, height: 18, borderRadius: 6 }}
                    />
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        className="skel"
                        style={{ width: 100, height: 16, borderRadius: 6 }}
                      />
                      <div
                        className="skel"
                        style={{ width: 34, height: 16, borderRadius: 6 }}
                      />
                    </div>
                  </HHBottom>
                </HHMid>

                <HHRight>
                  <div
                    className="skel"
                    style={{ width: 36, height: 36, borderRadius: 10 }}
                  />
                  <div
                    className="skel"
                    style={{ width: 36, height: 36, borderRadius: 10 }}
                  />
                  <div
                    className="skel"
                    style={{ width: 96, height: 36, borderRadius: 10 }}
                  />
                </HHRight>
              </HHCard>
            ))}
          </>
        ) : results.length === 0 ? (
          /* ===== EMPTY STATE ===== */
          <div className="empty" role="status" aria-live="polite">
            <h3>В выбранном регионе не нашлось специалистов</h3>
            <p>
              Попробуйте расширить радиус поиска, снять часть фильтров или
              выбрать другую профессию.
            </p>

            <MapYandexLocations
              apiKey={import.meta.env.VITE_YMAPS_KEY}
              locations={locations}
              onAdd={onAddLoc}
              onChange={onChangeLoc}
              onRemove={onRemoveLoc}
              height={600}
            />

            <div className="actions">
              {/* <button type="button" className="btn" onClick={resetAll}>
                Сбросить фильтры
              </button> */}

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
                          (getValues().maxPrice || "").replace(/\D/g, "")
                        ) || 1_000_000_000;
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
          </div>
        ) : (
          /* ===== Обычные карточки ===== */
          results.map((row: SearchWorker) => (
            <HHCard
              key={row.id}
              role="article"
              aria-label={`${fio(row.worker?.user)} — ${profLabelById(
                row.professionId
              )}`}
            >
              {/* LEFT */}
              <HHLeft>
                <HHAvatar
                  $src={
                    row.worker?.user?.avatar
                      ? `https://pointer.uz/public/avatar/${row.worker?.user?.avatar}`
                      : null
                  }
                >
                  {!row.worker?.user?.avatar && initials(row.worker?.user)}
                </HHAvatar>
              </HHLeft>

              {/* CENTER */}
              <HHMid>
                <HHHead>
                  <div>
                    <HHName>{fio(row.worker?.user)}</HHName>
                    <HHSub>
                      {fmtUpdated(row.updatedAt) !== "—"
                        ? "Обновлено " + fmtUpdated(row.updatedAt)
                        : ""}
                    </HHSub>
                  </div>

                  <HHStatuses>
                    {row.isBusy ? (
                      <HHStatus
                        $tone="red"
                        title="Мастер сейчас занят на заказе"
                      >
                        Занят
                      </HHStatus>
                    ) : (
                      <HHStatus $tone="green" title="Готов принимать заказы">
                        Свободен
                      </HHStatus>
                    )}

                    {/* необязательно, но удобно показывать попадание в зону */}
                    {typeof (row as any).inArea === "boolean" && (
                      <HHStatus $tone={row.inArea ? "blue" : "gray"}>
                        {row.inArea ? "В радиусе" : "Далеко"}
                      </HHStatus>
                    )}
                  </HHStatuses>
                </HHHead>

                <HHChips>
                  <HHChip>{profLabelById(row.professionId)}</HHChip>
                  <HHChip>
                    {row.jobType === "SOLO" ? "Сантехник" : "Электрик"}
                  </HHChip>
                </HHChips>

                <HHMeta>
                  <li>
                    <span className="k">Занятость:</span>
                    <span className="v">
                      {row.jobType === "SOLO" ? "подряд" : "команда"}
                    </span>
                  </li>
                  <li>
                    <span className="k">Формат:</span>
                    <span className="v">на объекте</span>
                  </li>
                </HHMeta>

                <HHDivider />

                <HHBottom>
                  <HHPrice>
                    {fmtMoney(row.minPrice)} — {fmtMoney(row.maxPrice)}{" "}
                    <span> / за работу</span>
                  </HHPrice>

                  <HHRating>
                    <Rate
                      allowHalf
                      disabled
                      value={row.rating ?? 0}
                      style={{ fontSize: 18 }}
                    />
                    <strong>{(row.rating ?? 0).toFixed(1)}</strong>
                  </HHRating>
                </HHBottom>
              </HHMid>

              {/* RIGHT */}
              <HHRight>
                <IconBtn title="Поделиться" aria-label="Поделиться">
                  <Share2 size={18} />
                </IconBtn>

                <IconBtn title="В избранное" aria-label="В избранное">
                  <Heart size={18} />
                </IconBtn>

                <OpenBtn
                  type="button"
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
              </HHRight>
            </HHCard>
          ))
        )}
      </List>
    </PageWrap>
  );
};

export default WorkerSearchPage;
