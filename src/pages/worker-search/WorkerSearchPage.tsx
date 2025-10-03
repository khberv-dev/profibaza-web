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
  Stars,
  HHRight,
  IconBtn,
  OpenBtn,
  PageWrap,
  Toolbar,
  SearchInputWrap,
  FilterBtn,
  SearchBtn,
  FiltersPanel,
  List
} from "./worker-search.style";
import CustomSelect, { SelectOption } from "../../components/custom-select/CustomSelect";
import { getProfessions } from "../../shared/modules/worker";
import { SearchWorker, searchWorkers } from "../../shared/endpoints/client";
import { Heart, Share2 } from "lucide-react";
import { Rate } from "antd";

/* helpers */
const fmtMoney = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("ru-RU") + " сум" : "—";
const fio = (u?: { name?: string; surname?: string; middleName?: string | null }) =>
  [u?.surname, u?.name].filter(Boolean).join(" ") || "Мастер";
const initials = (u?: { name?: string; surname?: string }) =>
  ((u?.surname?.[0] ?? "") + (u?.name?.[0] ?? "")).toUpperCase() || "M";
const fmtUpdated = (d?: string) => {
  if (!d) return "—";
  const dd = new Date(d);
  if (Number.isNaN(dd.getTime())) return "—";
  return dd.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
};

export const WorkerSearchPage: React.FC = () => {
  const lang = (localStorage.getItem("i18nextLng") || "ru").split("-")[0] as "ru" | "uz";

  /* обязательные фильтры */
  const [professionId, setProfessionId] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("0");
  const [maxPrice, setMaxPrice] = useState<string>("1000000000");
  const [showFilters, setShowFilters] = useState(false);

  type PriceForm = { minPrice: string; maxPrice: string };
const { control, getValues, setValue, watch } = useForm<PriceForm>({
  defaultValues: { minPrice: "0", maxPrice: "1000000000" },
});

  /* справочник профессий */
  const { data: profs = [], isLoading: profLoading } = useQuery({
    queryKey: ["opt", "professions"],
    queryFn: ({ signal }) => getProfessions(signal),
    staleTime: 5 * 60 * 1000,
  });

  const profOptions: SelectOption[] = useMemo(
    () => profs.map((p) => ({
      value: p.id,
      label: lang === "uz" ? (p as any).nameUz : (p as any).nameRu,
    })), [profs, lang]
  );
  const profLabelById = (id?: string) =>
    profs.find((p) => p.id === id)
      ? (lang === "uz" ? (profs.find((p) => p.id === id) as any)?.nameUz : (profs.find((p) => p.id === id) as any)?.nameRu)
      : "—";

  /* применённые фильтры */
  const [applied, setApplied] = useState<{ professions: string; minPrice: number; maxPrice: number } | null>(null);

  const { data: results = [], isFetching } = useQuery<SearchWorker[]>({
    queryKey: ["opt", "order-search", applied],
    queryFn: ({ signal }) =>
      applied ? searchWorkers({ professions: applied.professions, minPrice: applied.minPrice, maxPrice: applied.maxPrice }, signal) : Promise.resolve([]),
    enabled: Boolean(applied),
  });

  /* автоинициализация: выбрать 1ю профессию и поиск */
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
  }, [profOptions, minPrice, maxPrice]);

  const parseNums = () => {
    const { minPrice, maxPrice } = getValues();
    const min = Number((minPrice || "").replace(/\D/g, "")) || 0;
    const max = Number((maxPrice || "").replace(/\D/g, "")) || 0;
    const [mn, mx] = min <= max ? [min, max] : [max, min];
    return { mn, mx };
  };
  
  const onSearch = () => {
    if (!professionId) return;
    const { mn, mx } = parseNums();
    setApplied({ professions: professionId, minPrice: mn, maxPrice: mx });
  };
  
  const onChangeProfession = (v: string | number | null) => {
    const id = String(v || "");
    setProfessionId(id);
    if (!id) return;
    const { mn, mx } = parseNums();
    setApplied({ professions: id, minPrice: mn, maxPrice: mx });
  };
  
  const resetAll = () => {
    setValue("minPrice", "0");
    setValue("maxPrice", "1000000000");
    if (profOptions.length) {
      const first = String(profOptions[0].value);
      setProfessionId(first);
      setApplied({ professions: first, minPrice: 0, maxPrice: 1_000_000_000 });
    } else {
      setProfessionId("");
      setApplied(null);
    }
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const total = 5;
    const items: React.ReactNode[] = [];
    for (let i = 0; i < full; i++) items.push(<i key={`f${i}`} className="s full" />);
    if (half) items.push(<i key="h" className="s half" />);
    for (let i = items.length; i < total; i++) items.push(<i key={`e${i}`} className="s empty" />);
    return items;
  };


  return (
    <PageWrap>
      {/* Тулбар */}
      <Toolbar>
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
  
        <FilterBtn onClick={() => setShowFilters((v) => !v)}>
          Фильтры
        </FilterBtn>
  
        <SearchBtn onClick={onSearch} disabled={!professionId}>
          Найти
        </SearchBtn>
      </Toolbar>
  
      {/* Панель с мин/макс ценой */}
      <FiltersPanel $open={showFilters}>
  <div className="field">
    <CustomInput
      control={control}
      name="minPrice"
      label="Минимальная цена *"
      placeholder="0"
      rules={{
        required: "Укажите минимальную цену",
        validate: (v: string) =>
          /^\d*$/.test(v ?? "") || "Только цифры",
      }}
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
        validate: (v: string) =>
          /^\d*$/.test(v ?? "") || "Только цифры",
      }}
    />
  </div>
</FiltersPanel>
  
      {/* Список карточек с отступами и gap */}
      <List>
      {results.map((row: SearchWorker) => (
        <HHCard
          key={row.id}
          role="article"
          aria-label={`${fio(row.worker?.user)} — ${profLabelById(row.professionId)}`}
        >
          {/* LEFT: аватар */}
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
                <HHStatus $tone="green">Свободен</HHStatus>
                <HHStatus $tone="blue">На связи</HHStatus>
              </HHStatuses>
            </HHHead>
  
            {/* Чипы */}
            <HHChips>
              <HHChip>{profLabelById(row.professionId)}</HHChip>
              <HHChip>{row.jobType === "SOLO" ? "Сантехник" : "Электрик"}</HHChip>
            </HHChips>
  
            {/* Мета */}
            <HHMeta>
              {/* {row.experienceYears ? (
                <li>
                  <span className="k">Опыт:</span>
                  <span className="v">{row.experienceYears} года</span>
                </li>
              ) : null} */}
              <li>
                <span className="k">Занятость:</span>
                <span className="v">{row.jobType === "SOLO" ? "подряд" : "команда"}</span>
              </li>
              <li>
                <span className="k">Формат:</span>
                <span className="v">на объекте</span>
              </li>
              {/* {row.lastCompany ? (
                <li>
                  <span className="k">Последнее:</span>
                  <span className="v">{row.lastCompany}</span>
                </li>
              ) : null}
              {row.worker?.user?.address ? (
                <li>
                  <span className="k">Город:</span>
                  <span className="v">{row.worker?.user?.address}</span>
                </li>
              ) : null}
              {row.distanceKm ? (
                <li>
                  <span className="k"></span>
                  <span className="v">{row.distanceKm} км</span>
                </li>
              ) : null} */}
            </HHMeta>
  
            <HHDivider />
  
            {/* Низ: цена + рейтинг */}
            <HHBottom>
              <HHPrice>
                {fmtMoney(row.minPrice)} — {fmtMoney(row.maxPrice)} <span> / за работу</span>
              </HHPrice>
  
              <HHRating>
  <Rate
    allowHalf
    disabled
    value={row.rating ?? 0}
    style={{ fontSize: 18 }}
  />
  <strong>{(row.rating ?? 0).toFixed(1)}</strong>
  {/* <span className="cnt">({row.ratingCount ?? 57})</span> */}
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
    const url = new URL("/app/client/create-order", window.location.origin);
    url.searchParams.set("workerProfessionId", row.id); // ← передаём ID профиля мастера
    window.location.href = url.toString();
  }}
>
  Заказать
</OpenBtn>
</HHRight>
        </HHCard>
      ))}
      </List>
    </PageWrap>
  );
  
};
