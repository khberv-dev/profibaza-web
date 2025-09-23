import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import {
  YMaps,
  Map,
  Placemark,
  Circle,
  GeolocationControl,
  ZoomControl,
} from "@pbe/react-yandex-maps";

import {
  Shell,
  Toolbar,
  SearchWrap,
  Input,
  SearchBtn,
  Content,
  Aside,
  Sticky,
  FilterCard,
  SectionTitle,
  Pills,
  Chip,
  RangeRow,
  CheckRow,
  Main,
  Split,
  Left,
  Right,
  SortWrap,
  ViewToggle,
  Counter,
  ResultList,
  Card,
  Avatar,
  ColMain,
  Title,
  Subtitle,
  Meta,
  Tag,
  TagRow,
  StatRow,
  Stat,
  Price,
  Actions,
  GhostBtn,
  PrimaryBtn,
  FavBtn,
  Badge,
  Dot,
  Divider,
  MapBlock,
  MapRow,
  SmallBtn,
  RadiusWrap,
  MapPreview,
  FilterActions,
  FieldRow,
  ThinSep,
} from "../masters-search.style";
import CustomSelect from "./components/CustomSelect";
import { CustomInput } from "../../../components/custom-input";
import Rating from "./components/Rating";
import { FiHeart, FiShare2 } from "react-icons/fi";

/* ===== Demo data ===== */
type Master = {
  id: string;
  name: string;
  avatar?: string | null;
  age?: number;
  city: string;
  distanceKm?: number;
  professions: string[];
  experienceYears: number;
  lastWork?: string;
  priceFrom?: number;
  priceTo?: number;
  priceUnit?: string;
  rating: number;
  reviews: number;
  isOnline?: boolean;
  isAvailable?: boolean;
  verified?: boolean;
  employment?: "full" | "part" | "contract";
  workFormat?: "on-site" | "remote" | "mixed";
};
const MOCK: Master[] = [
  {
    id: "1",
    name: "Феруза Юсупова",
    avatar: "https://i.pravatar.cc/120?img=15",
    age: 26,
    city: "Ташкент",
    distanceKm: 2.3,
    professions: ["Электрик", "Сантехник"],
    experienceYears: 4,
    lastWork: 'ООО "Свет-Сервис"',
    priceFrom: 150000,
    priceTo: 350000,
    priceUnit: "час",
    rating: 4.8,
    reviews: 57,
    isOnline: true,
    isAvailable: true,
    verified: true,
    employment: "contract",
    workFormat: "on-site",
  },
  {
    id: "2",
    name: "Жасур Каримов",
    avatar: "https://i.pravatar.cc/120?img=3",
    age: 31,
    city: "Самарканд",
    distanceKm: 6.1,
    professions: ["Отделочник"],
    experienceYears: 7,
    priceFrom: 200000,
    priceTo: 300000,
    priceUnit: "м²",
    rating: 4.6,
    reviews: 24,
    isOnline: false,
    isAvailable: true,
    verified: false,
    employment: "full",
    workFormat: "mixed",
  },
  {
    id: "3",
    name: "Нодира Олимова",
    avatar: "https://i.pravatar.cc/120?img=47",
    age: 28,
    city: "Бухара",
    distanceKm: 1.1,
    professions: ["Дизайнер"],
    experienceYears: 5,
    lastWork: "Фриланс",
    priceFrom: 900000,
    priceTo: 2400000,
    priceUnit: "объект",
    rating: 4.9,
    reviews: 81,
    isOnline: true,
    isAvailable: false,
    verified: true,
    employment: "part",
    workFormat: "remote",
  },
];

type LatLng = { lat: number; lng: number };
const CITY_COORDS: Record<string, LatLng> = {
  Ташкент: { lat: 41.3111, lng: 69.2797 },
  Самарканд: { lat: 39.6542, lng: 66.9597 },
  Бухара: { lat: 39.7747, lng: 64.4286 },
  Навои: { lat: 40.0844, lng: 65.3792 },
  Наманган: { lat: 41.0011, lng: 71.6683 },
};

/* ===== Helpers ===== */
const formatUZS = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("ru-RU") + " сум" : "—";
const mkUnit = (f?: number, t?: number, u?: string) => {
  if (!f && !t) return "Цена по договоренности";
  if (f && t) return `${formatUZS(f)} – ${formatUZS(t)}${u ? " / " + u : ""}`;
  if (f) return `${formatUZS(f)}${u ? " / " + u : ""}`;
  return `${formatUZS(t)}${u ? " / " + u : ""}`;
};
const Stars: React.FC<{ value: number }> = ({ value }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const items = Array.from({ length: 5 }, (_, i) =>
    i < full ? "★" : i === full && half ? "☆" : "☆"
  );
  return <span aria-label={`Рейтинг ${value}`}>{items.join(" ")}</span>;
};

/* ===== Page ===== */
type FiltersForm = {
  priceMin?: string;
  priceMax?: string;
  expMin?: string;
  ratingMin?: string;
  dateFrom?: string; // yyyy-mm-dd
  dateTo?: string; // yyyy-mm-dd
  employment?: "full" | "part" | "contract" | "";
  workFormat?: "on-site" | "remote" | "mixed" | "";
  verifiedOnly?: boolean;
  withReviewsOnly?: boolean;
};

const MastersSearchPage: React.FC = () => {
  // top search
  const [query, setQuery] = useState("");

  // sticky map state
  const [centerCity, setCenterCity] = useState<string>("Ташкент");
  const [center, setCenter] = useState<LatLng>(CITY_COORDS["Ташкент"]);
  const [radiusKm, setRadiusKm] = useState<number>(10);

  // view/sort
  const [sort, setSort] = useState<
    "relevance" | "rating" | "price" | "distance"
  >("relevance");
  const [view, setView] = useState<"list" | "grid">("list");

  // chips state (профессия/регион/махалля)
  const [profession, setProfession] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [mahalla, setMahalla] = useState<string | null>(null);

  // demo options
  const PROF = [
    "Электрик",
    "Сантехник",
    "Строитель",
    "Дизайнер",
    "Сварщик",
    "Отделочник",
    "Плотник",
    "Инженер-прораб",
  ];
  const REGIONS = ["Ташкент", "Самарканд", "Бухара", "Навои", "Наманган"];
  const MAHALLA = ["Мирзо Улугбек", "Чиланзар", "Юнусабад", "Алмазар"];

  // ===== react-hook-form для фильтров
  const methods = useForm<FiltersForm>({
    defaultValues: {
      priceMin: "",
      priceMax: "",
      expMin: "",
      ratingMin: "",
      dateFrom: "",
      dateTo: "",
      employment: "",
      workFormat: "",
      verifiedOnly: false,
      withReviewsOnly: false,
    },
    mode: "onChange",
  });
  const { control, reset, watch } = methods;

  // watcher для синхронизации (фильтрация идет по watch)
  const fv = useWatch({ control });

  // карта: смена центра по городу
  useEffect(() => {
    if (centerCity && CITY_COORDS[centerCity])
      setCenter(CITY_COORDS[centerCity]);
  }, [centerCity]);

  // гео расстояние
  const haversine = (a: LatLng, b: LatLng) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const s =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  };

  // список
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return MOCK.filter((m) => {
      const passQ =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.professions.some((p) => p.toLowerCase().includes(q));

      const passProf = !profession || m.professions.includes(profession);
      const passRegion = !region || m.city === region;

      const priceMin = Number((fv.priceMin || "").replace(/\D/g, "")) || 0;
      const priceMax = Number((fv.priceMax || "").replace(/\D/g, "")) || 0;

      const passMin = !priceMin || (m.priceFrom ?? 0) >= priceMin;
      const passMax = !priceMax || (m.priceTo ?? m.priceFrom ?? 0) <= priceMax;

      const expMin = Number((fv.expMin || "").replace(/\D/g, "")) || 0;
      const ratingMin = Number((fv.ratingMin || "").replace(",", ".")) || 0;

      const passExp = !expMin || m.experienceYears >= expMin;
      const passRating = !ratingMin || m.rating >= ratingMin;

      const cityCoord = CITY_COORDS[m.city];
      const passGeo = cityCoord
        ? haversine(center, cityCoord) <= radiusKm
        : true;

      const passVerified = !fv.verifiedOnly || !!m.verified;
      const passReviews = !fv.withReviewsOnly || m.reviews > 0;

      const passEmployment = !fv.employment || m.employment === fv.employment;

      const passWorkFmt = !fv.workFormat || m.workFormat === fv.workFormat;

      // dateFrom/dateTo — обычно нужна проверка по расписанию мастера; в демо нет данных, поэтому не фильтруем

      return (
        passQ &&
        passProf &&
        passRegion &&
        passMin &&
        passMax &&
        passExp &&
        passRating &&
        passGeo &&
        passVerified &&
        passReviews &&
        passEmployment &&
        passWorkFmt
      );
    }).sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating;
        case "price":
          return (a.priceFrom ?? 0) - (b.priceFrom ?? 0);
        case "distance":
          return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
        default:
          return 0;
      }
    });
  }, [query, profession, region, fv, center, radiusKm, sort]);

  const osmIframe = useMemo(() => {
    const dLat = radiusKm / 111;
    const dLng = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180));
    const bb = `${center.lng - dLng},${center.lat - dLat},${
      center.lng + dLng
    },${center.lat + dLat}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bb}&layer=mapnik&marker=${center.lat},${center.lng}`;
  }, [center, radiusKm]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setCenterCity("Моё местоположение");
    });
  };

  const centerCityOptions = [
    { value: "Моё местоположение", label: "Моё местоположение" },
    ...REGIONS.map((r) => ({ value: r, label: r })),
  ];

  return (
    <Shell>
      <Toolbar>
        <SearchWrap>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по мастерам и навыкам"
            aria-label="Поиск"
          />
          <SearchBtn type="button">Найти</SearchBtn>
        </SearchWrap>
      </Toolbar>

      <Content>
        {/* ===== Left: Filters ===== */}
        <Aside>
          <Sticky>
            <FormProvider {...methods}>
              {/* — Карта и гео — */}
              <FilterCard>
                <SectionTitle>Поиск на карте</SectionTitle>

                <MapBlock>
                  <MapRow>
                    <CustomSelect<string>
                      options={centerCityOptions}
                      value={centerCity}
                      onChange={(v) => setCenterCity(v)}
                      placeholder="Моё местоположение"
                      width="100%"
                    />
                    <SmallBtn onClick={useMyLocation}>Определить</SmallBtn>
                  </MapRow>

                  <RadiusWrap>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                    />
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value || 0))}
                    />
                  </RadiusWrap>

                  <MapPreview>
                    <YMaps query={{ apikey: "ВАШ_КЛЮЧ" }}>
                      <Map
                        state={{ center: [center.lat, center.lng], zoom: 11 }}
                        options={{ suppressMapOpenBlock: true }}
                        onClick={(e: any) => {
                          const [lat, lng] = e.get("coords");
                          setCenter({ lat, lng });
                        }}
                        width="100%"
                        height="100%"
                      >
                        <GeolocationControl
                          options={{ position: { top: 10, left: 10 } }}
                          // instanceRef={(c:any)=> c?.options?.set("size","small")} // если нужен “small”
                        />
                        <ZoomControl
                          options={{ position: { top: 10, right: 10 } }}
                          // instanceRef={(c:any)=> c?.options?.set("size","small")}
                        />

                        <Placemark
                          geometry={[center.lat, center.lng]}
                          options={{
                            preset: "islands#blueDotIcon",
                            draggable: true,
                          }}
                          onDragEnd={(e: any) => {
                            const [lat, lng] = e
                              .get("target")
                              .geometry.getCoordinates();
                            setCenter({ lat, lng });
                          }}
                        />

                        <Circle
                          geometry={[[center.lat, center.lng], radiusKm * 1000]}
                          options={{
                            fillColor: "rgba(44, 100, 255, 0.12)",
                            strokeColor: "rgba(44, 100, 255, 0.6)",
                            strokeWidth: 2,
                          }}
                        />
                      </Map>
                    </YMaps>
                  </MapPreview>
                </MapBlock>
              </FilterCard>

              {/* — Профессия — */}
              <FilterCard>
                <SectionTitle>Профессия</SectionTitle>
                <Pills>
                  {PROF.map((p) => (
                    <Chip
                      key={p}
                      aria-pressed={profession === p}
                      onClick={() => setProfession(profession === p ? null : p)}
                    >
                      {p}
                    </Chip>
                  ))}
                </Pills>
              </FilterCard>

              {/* — Регион/Махалля — */}
              <FilterCard>
                <SectionTitle>Регион</SectionTitle>
                <Pills>
                  {REGIONS.map((r) => (
                    <Chip
                      key={r}
                      aria-pressed={region === r}
                      onClick={() => setRegion(region === r ? null : r)}
                    >
                      {r}
                    </Chip>
                  ))}
                </Pills>

                <SectionTitle style={{ marginTop: 12 }}>Махалля</SectionTitle>
                <Pills>
                  {MAHALLA.map((m) => (
                    <Chip
                      key={m}
                      aria-pressed={mahalla === m}
                      onClick={() => setMahalla(mahalla === m ? null : m)}
                    >
                      {m}
                    </Chip>
                  ))}
                </Pills>
              </FilterCard>

              {/* — Цена/Опыт/Рейтинг — через CustomInput */}
              <FilterCard>
                <SectionTitle>Диапазон цен (сум)</SectionTitle>
                <FieldRow>
                  <CustomInput
                    control={control}
                    name="priceMin"
                    placeholder="от"
                    rules={{
                      pattern: { value: /^\d*$/, message: "Только цифры" },
                    }}
                  />
                  <CustomInput
                    control={control}
                    name="priceMax"
                    placeholder="до"
                    rules={{
                      pattern: { value: /^\d*$/, message: "Только цифры" },
                    }}
                  />
                </FieldRow>

                <ThinSep />

                <SectionTitle>Опыт работы</SectionTitle>
                <CustomInput
                  control={control}
                  name="expMin"
                  placeholder="от, лет"
                  rules={{
                    pattern: { value: /^\d*$/, message: "Только цифры" },
                  }}
                />

                <ThinSep />

                <SectionTitle>Рейтинг</SectionTitle>
                <CustomInput
                  control={control}
                  name="ratingMin"
                  placeholder="минимум, напр. 4.5"
                  rules={{
                    pattern: {
                      value: /^[0-9]*[.,]?[0-9]*$/,
                      message: "Число, напр. 4.5",
                    },
                  }}
                />
              </FilterCard>

              {/* — Доступность по датам — */}
              <FilterCard>
                <SectionTitle>Доступность по датам</SectionTitle>
                <FieldRow>
                  <Controller
                    control={control}
                    name="dateFrom"
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        style={{
                          height: 40,
                          border: "1px solid #E7ECF3",
                          borderRadius: 10,
                          padding: "0 10px",
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="dateTo"
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        style={{
                          height: 40,
                          border: "1px solid #E7ECF3",
                          borderRadius: 10,
                          padding: "0 10px",
                        }}
                      />
                    )}
                  />
                </FieldRow>
              </FilterCard>

              {/* — Тип занятости / Формат работ — кастомный селект */}
              <FilterCard>
                <SectionTitle>Занятость и формат</SectionTitle>
                <FieldRow>
                  <Controller
                    control={control}
                    name="employment"
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value || ""}
                        onChange={field.onChange}
                        options={[
                          { value: "", label: "Любая занятость" },
                          { value: "full", label: "Полная" },
                          { value: "part", label: "Частичная" },
                          { value: "contract", label: "Подряд" },
                        ]}
                        placeholder="Занятость"
                        width="100%"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="workFormat"
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value || ""}
                        onChange={field.onChange}
                        options={[
                          { value: "", label: "Любой формат" },
                          { value: "on-site", label: "На объекте" },
                          { value: "remote", label: "Удалённо" },
                          { value: "mixed", label: "Смешанный" },
                        ]}
                        placeholder="Формат"
                        width="100%"
                      />
                    )}
                  />
                </FieldRow>

                <ThinSep />

                <CheckRow>
                  <Controller
                    control={control}
                    name="verifiedOnly"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span>Только верифицированные</span>
                  <small />
                </CheckRow>

                <CheckRow>
                  <Controller
                    control={control}
                    name="withReviewsOnly"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span>Только с отзывами</span>
                  <small />
                </CheckRow>

                <FilterActions>
                  <GhostBtn type="button" onClick={() => reset()}>
                    Сбросить
                  </GhostBtn>
                  <PrimaryBtn type="button">Применить</PrimaryBtn>
                </FilterActions>
              </FilterCard>
            </FormProvider>
          </Sticky>
        </Aside>

        {/* ===== Right: Results ===== */}
        <Main>
          <Split>
            <Left>
              <Counter>{filtered.length} кандидатов</Counter>
            </Left>
            <Right>
              <SortWrap>
                <label>Сортировка:</label>
                <CustomSelect
                  value={sort}
                  onChange={(val) => setSort(val)}
                  options={[
                    { value: "relevance", label: "По соответствию" },
                    { value: "rating", label: "По рейтингу" },
                    { value: "price", label: "По цене" },
                    { value: "distance", label: "По расстоянию" },
                  ]}
                />
              </SortWrap>
              <ViewToggle>
                <button
                  data-active={view === "list"}
                  onClick={() => setView("list")}
                  aria-label="Список"
                >
                  ▤
                </button>
                <button
                  data-active={view === "grid"}
                  onClick={() => setView("grid")}
                  aria-label="Карточки"
                >
                  ▦
                </button>
              </ViewToggle>
            </Right>
          </Split>

          <ResultList data-view={view}>
            {filtered.map((m) => (
              <Card key={m.id}>
                <Avatar src={"/avatar.png"} alt="" />
                <ColMain>
                  <Title>
                    {m.name}
                    {/* {m.verified && <Badge tone="online">✔ Верифицирован</Badge>} */}
                    {m.isAvailable && <Badge tone="success">Свободен</Badge>}
                    {m.isOnline && (
                      <Badge tone="online">
                        <Dot /> На связи
                      </Badge>
                    )}
                  </Title>
                  <Subtitle>
                    {m.age ? `${m.age} лет • ` : ""}Обновлено сегодня
                  </Subtitle>
                  <TagRow>
                    {m.professions.map((p) => (
                      <Tag key={p}>{p}</Tag>
                    ))}
                  </TagRow>

                  <Meta>
                    <StatRow>
                      <Stat>
                        Опыт: {m.experienceYears}{" "}
                        {m.experienceYears === 1
                          ? "год"
                          : m.experienceYears < 5
                          ? "года"
                          : "лет"}
                      </Stat>
                      {m.employment && (
                        <Stat>
                          Занятость:{" "}
                          {m.employment === "full"
                            ? "полная"
                            : m.employment === "part"
                            ? "частичная"
                            : "подряд"}
                        </Stat>
                      )}
                      {m.workFormat && (
                        <Stat>
                          Формат:{" "}
                          {m.workFormat === "on-site"
                            ? "на объекте"
                            : m.workFormat === "remote"
                            ? "удалённо"
                            : "смешанный"}
                        </Stat>
                      )}
                      {m.lastWork && <Stat>Последнее: {m.lastWork}</Stat>}
                      <Stat>Город: {m.city}</Stat>
                      {m.distanceKm != null && (
                        <Stat>{m.distanceKm.toFixed(1)} км</Stat>
                      )}
                    </StatRow>
                  </Meta>

                  <Divider />
                  <StatRow>
                    <Price>{mkUnit(m.priceFrom, m.priceTo, m.priceUnit)}</Price>
                    <Rating value={m.rating} reviews={m.reviews} size="m" />
                  </StatRow>
                </ColMain>

                <Actions>
                  <GhostBtn title="Поделиться">
                    <FiShare2 size={18} />
                  </GhostBtn>

                  <FavBtn title="В избранное">
                    <FiHeart size={18} />
                  </FavBtn>
                  <PrimaryBtn>Открыть профиль</PrimaryBtn>
                </Actions>
              </Card>
            ))}
          </ResultList>
        </Main>
      </Content>
    </Shell>
  );
};

export default MastersSearchPage;
