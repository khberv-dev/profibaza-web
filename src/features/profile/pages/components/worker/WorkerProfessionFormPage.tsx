import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Image } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Page,
  Header,
  Title,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGrid,
  Field,
  Label,
  Help,
  Input,
  SelectBox,
  Inline,
  ToggleGroup,
  Toggle,
  Upload,
  Notice,
  Actions,
  PrimaryBtn,
  Progress,
  Small,
  HeadRow,
  ZoneRow,
  RadiusBlock,
  RadiusRow,
  RemoveBtn,
} from "./worker-profile.style"; // реюз твоих стилей
import CustomSelect, {
  SelectOption,
} from "../../../../../components/custom-select/CustomSelect";
import { useTranslation } from "react-i18next";
import {
  MapLocation,
  MapYandexLocations,
} from "../../../../../components/map/MapYandexLocations";
import {
  getProfessions,
  getWorkerProfessions,
  saveWorkerProfession,
  updateWorkerProfession,
  uploadProfessionDemo,
  Profession,
  WorkerProfessionRow,
} from "../../../../../shared/modules/worker";
import type {
  JobType,
  ProfessionCategory,
  ProfessionDemo,
  WeekSchedule,
} from "../../../../../shared/modules/worker";
import {
  postWorkerExperience,
  WorkerExperienceItem,
} from "../../../../../shared/modules/experience";
import { EditBtn } from "../../../pro-profile-section.style";
import { Drill, HardHat, PencilRuler, RotateCwSquare } from "lucide-react";

type Mode = "create" | "edit";
type Props = { mode: Mode };

const defaultSchedule: WeekSchedule = {
  monday: true,
  tuesday: false,
  wednesday: true,
  thursday: false,
  friday: true,
  saturday: false,
  sunday: false,
};

type RawDemo = {
  id: string;
  fileId: string;
  workerProfessionId: string;
  createdAt: string;
  comment?: string | null;
};

const demoTypeFromFileId = (fileId: string): "image" | "video" => {
  const ext = (fileId.split(".").pop() || "").toLowerCase();
  return ["mp4", "mov", "webm", "m4v"].includes(ext) ? "video" : "image";
};

const demoUrlFromFileId = (fileId: string) =>
  `https://profibaza.uz/public/demo/${fileId}`;

export default function WorkerProfessionFormPage({ mode }: Props) {
  const { rowId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [categories, setCategories] = useState<ProfessionCategory[]>([]);
  const [activeCatId, setActiveCatId] = useState<string>("");
  // справочники
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [profLoading, setProfLoading] = useState(true);
  const [workerProfs, setWorkerProfs] = useState<WorkerProfessionRow[]>([]);
  const [createdIds, setCreatedIds] = useState<Set<string>>(new Set());

  // форма
  const [professionId, setProfessionId] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [hasTeam, setHasTeam] = useState(false);
  const [teamMemberCount, setTeamMemberCount] = useState("1");
  const [readyForHugeProject, setReadyForHugeProject] = useState(false);
  const [competitions, setCompetitions] = useState<"YES" | "NO">("NO");
  const [inventory, setInventory] = useState<string>("");
  const [schedule, setSchedule] = useState<WeekSchedule>(defaultSchedule);
  const [jobType, setJobType] = useState<JobType>("SOLO");
  const [locations, setLocations] = useState<
    { longitude: string; latitude: string; radius: string }[]
  >([{ longitude: "65.0009", latitude: "38.9020", radius: "10" }]);

  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  // демо
  const [demos, setDemos] = useState<ProfessionDemo[]>([]);
  const demoInputId = useId();
  const [demoUploadPct, setDemoUploadPct] = useState<number | null>(null);
  const [demoUploadErr, setDemoUploadErr] = useState<string | null>(null);
  const demoFileInputRef = useRef<HTMLInputElement | null>(null);
  const demoAbortRef = useRef<AbortController | null>(null);

  const [expList, setExpList] = useState<WorkerExperienceItem[]>([
    {
      jobPlace: "",
      jobDescription: "",
      startedAt: new Date().getFullYear(),
      endedAt: null,
    },
  ]);
  const lang = (localStorage.getItem("i18nextLng") || "ru").split("-")[0];
  const catLabel = (c: ProfessionCategory) =>
    (lang === "uz" ? c.nameUz : c.nameRu) || "";
  const profLabel = (p: Profession) =>
    (lang === "uz" ? (p as any).nameUz : (p as any).nameRu) || "";

  const profOptions: SelectOption[] = useMemo(
    () =>
      professions.map((p) => ({
        value: p.id,
        label: profLabel(p),
        disabled: mode === "create" ? createdIds.has(p.id) : false,
      })),
    [professions, createdIds, mode]
  );

  const dayDefs = useMemo(
    () =>
      (
        [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ] as (keyof WeekSchedule)[]
      ).map((key) => ({
        key,
        short: t(`daysShort.${key}`),
        long: t(`daysLong.${key}`),
      })),
    [t]
  );

  // загрузка
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setProfLoading(true);

        // 1) тянем категории с профессиями и текущие профили воркера
        const [cats, rows] = await Promise.all([
          getProfessions(ac.signal), // возвращает ProfessionCategory[]
          getWorkerProfessions(ac.signal).catch(
            () => [] as WorkerProfessionRow[]
          ),
        ]);

        setCategories(cats || []);
        setWorkerProfs(rows);
        setCreatedIds(new Set(rows.map((r) => r.professionId)));

        // 2) если активная категория ещё не выбрана — выбираем первую
        if (cats?.length && !activeCatId) {
          setActiveCatId(String(cats[0].id));
        }

        if (mode === "edit") {
          // ---- EDIT MODE: заполняем поля из выбранной записи ----
          const row = rows.find((r) => r.id === rowId);
          if (row) {
            setProfessionId(row.professionId || "");

            // активируем категорию, содержащую текущую профессию
            const hostCat = cats.find((c) =>
              c.professions?.some((p) => p.id === row.professionId)
            );
            if (hostCat) setActiveCatId(hostCat.id);

            setMinPrice(String(row.minPrice ?? ""));
            setMaxPrice(String(row.maxPrice ?? ""));
            setHasTeam(Boolean(row.hasTeam));
            setTeamMemberCount(String(row.teamMemberCount ?? "1"));
            setReadyForHugeProject(Boolean(row.readyForHugeProject));

            const comp = (row as any)?.competitions;
            setCompetitions(comp === "YES" || comp === "NO" ? comp : "NO");

            setInventory(((row as any)?.inventory as string) ?? "");

            setSchedule(
              (row as any)?.schedule &&
                typeof (row as any).schedule === "object"
                ? ((row as any).schedule as WeekSchedule)
                : defaultSchedule
            );

            // опыт
            const exp = Array.isArray(row.experience) ? row.experience : [];
            if (exp.length) {
              setExpList(
                exp.map((x) => ({
                  jobPlace: x.jobPlace || "",
                  jobDescription: x.jobDescription || "",
                  startedAt: Number(x.startedAt) || new Date().getFullYear(),
                  endedAt:
                    x.endedAt == null || Number.isNaN(Number(x.endedAt))
                      ? null
                      : Number(x.endedAt),
                }))
              );
            }

            // формат работы
            setJobType((row.jobType as JobType) || "SOLO");

            // зоны
            const locs = (row.locations || []) as any[];
            if (Array.isArray(locs) && locs.length) {
              setLocations(
                locs.map((l) => ({
                  longitude: String(l?.longitude ?? ""),
                  latitude: String(l?.latitude ?? ""),
                  radius: String(l?.radius ?? ""),
                }))
              );
            }

            // демо (если приходит в row.demos — оставляю как у тебя)
            const rawList: RawDemo[] = ((row as any)?.demos || []) as RawDemo[];
            setDemos(
              rawList.map((raw) => ({
                id: raw.id,
                fileId: raw.fileId,
                workerProfessionId: raw.workerProfessionId,
                createdAt: raw.createdAt as any,
                comment: raw.comment ?? null,
                url: demoUrlFromFileId(raw.fileId),
                type: demoTypeFromFileId(raw.fileId),
              }))
            );
          }
        } else {
          // ---- CREATE MODE: подставим первую доступную профессию, которой ещё нет у пользователя ----
          const firstAvail = (cats || [])
            .flatMap((c) => c.professions || [])
            .find((p) => !rows.some((r) => r.professionId === p.id));

          setProfessionId(firstAvail?.id || "");

          if (!activeCatId && firstAvail) {
            const cat = cats.find((c) =>
              c.professions?.some((p) => p.id === firstAvail.id)
            );
            if (cat) setActiveCatId(cat.id);
          }
        }
      } finally {
        setProfLoading(false);
      }
    })();

    return () => ac.abort();
  }, [mode, rowId]);

  const normalizeLoc = (x: any) => ({
    latitude: String(x?.latitude ?? x?.lat ?? ""),
    longitude: String(x?.longitude ?? x?.lng ?? ""),
    radius: String(x?.radius ?? 10),
  });
  const changeLocation = (
    idx: number,
    key: "longitude" | "latitude" | "radius",
    value: string
  ) =>
    setLocations((s) =>
      s.map((it, i) => (i === idx ? { ...it, [key]: value } : it))
    );
  const addLocation = () =>
    setLocations((s) => [...s, { longitude: "", latitude: "", radius: "10" }]);
  const removeLocation = (idx: number) =>
    setLocations((s) => s.filter((_, i) => i !== idx));
  const normalizeDecimal = (v: string | number | null | undefined) =>
    String(v ?? "")
      .replace(",", ".")
      .trim();
  const isDec = (s: string) => /^-?\d+(\.\d+)?$/.test(s);

  const onSave = async () => {
    setSaving(true);
    setSaveErr(null);
    setSavedOk(false);

    try {
      if (!professionId) throw new Error("Выберите профессию");

      // нормализация зон
      const parsedLocations = locations
        .map((l) => {
          const lon = String(l.longitude ?? "")
            .replace(",", ".")
            .trim();
          const lat = String(l.latitude ?? "")
            .replace(",", ".")
            .trim();
          const radNum = Number(
            String(l.radius ?? "")
              .replace(",", ".")
              .trim()
          );
          return { longitude: lon, latitude: lat, radius: radNum };
        })
        .filter(
          (l) =>
            /^-?\d+(\.\d+)?$/.test(l.longitude) &&
            /^-?\d+(\.\d+)?$/.test(l.latitude) &&
            Number.isFinite(l.radius)
        );

      // вилка
      const minP = Number(minPrice) || 0;
      const maxP = Number(maxPrice) || 0;
      if (minP && maxP && maxP < minP) {
        throw new Error("Максимальная цена не может быть меньше минимальной");
      }

      // базовый payload
      const payload = {
        professionId,
        minPrice: minP,
        maxPrice: maxP,
        hasTeam,
        teamMemberCount: Number(teamMemberCount) || 0,
        readyForHugeProject,
        competitions,
        jobType,
        locations: parsedLocations,
        schedule,
        inventory: (inventory || "").trim(),
      };

      // 1) сохранить / обновить профиль
      let targetRowId = rowId as string | undefined;
      if (mode === "edit" && rowId) {
        await updateWorkerProfession(rowId, payload as any);
      } else {
        const created = await saveWorkerProfession(payload as any);
        targetRowId =
          (created as any)?.id || (created as any)?.data?.id || targetRowId;
      }
      const finalRowId = targetRowId!;
      // --- END save profile ---

      // 2) отправить ТОЛЬКО НОВЫЕ записи опыта, по одной
      try {
        // исходные записи опыта, уже лежащие на бэке
        const existingExp = (workerProfs.find((r) => r.id === finalRowId)
          ?.experience ?? []) as Array<{
          jobPlace?: string;
          jobDescription?: string;
          startedAt?: number;
          endedAt?: number | null;
        }>;

        // функция сравнения "похожа ли запись" (без id, по полям)
        const sameExp = (a: {
          jobPlace: string;
          jobDescription: string;
          startedAt: number;
          endedAt?: number | null;
        }) =>
          existingExp.some((b) => {
            const endedA = a.endedAt ?? null;
            const endedB = (b.endedAt ?? null) as number | null;
            return (
              (b.jobPlace || "").trim() === a.jobPlace.trim() &&
              (b.jobDescription || "").trim() === a.jobDescription.trim() &&
              Number(b.startedAt || 0) === a.startedAt &&
              endedB === endedA
            );
          });

        // подчистим ввод пользователя
        const cleaned = (expList || [])
          .map((x) => ({
            jobPlace: (x.jobPlace || "").trim(),
            jobDescription: (x.jobDescription || "").trim(),
            startedAt: Number(x.startedAt) || 0,
            endedAt:
              x.endedAt == null || x.endedAt === 0
                ? undefined
                : Number(x.endedAt),
          }))
          .filter(
            (x) =>
              x.jobPlace && Number.isInteger(x.startedAt) && x.startedAt > 0
          );

        // выделяем ТОЛЬКО новые (которых ещё нет на бэке)
        const onlyNew = cleaned.filter((x) => !sameExp(x));
      } catch (e) {
        console.warn("postWorkerExperience (only new) failed:", e);
        // не валим общий save
      }

      setSavedOk(true);
      setTimeout(() => navigate("/app/profile"), 300);
    } catch (e: any) {
      setSaveErr(e?.message || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const onDemoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const f = input.files?.[0];
    if (!f) return;

    // Лимит: 30 MB (десятичные мегабайты)
    const MAX_MB = 30;
    const MAX_BYTES = MAX_MB * 1_000_000; // 30,000,000

    // Для понятного лога/сообщения
    const sizeMB = f.size / 1_000_000; // десятичные MB

    if (f.size > MAX_BYTES) {
      setDemoUploadErr(
        `Файл превышает ${MAX_MB} МБ (ваш: ${sizeMB.toFixed(2)} МБ)`
      );
      input.value = ""; // сброс выбора
      return;
    }

    // Проверка режима редактирования
    if (mode !== "edit" || !rowId) {
      setDemoUploadErr(
        "Сначала сохраните (или перейдите в режим редактирования)"
      );
      input.value = "";
      return;
    }

    setDemoUploadErr(null);
    setDemoUploadPct(0);
    demoAbortRef.current?.abort();
    demoAbortRef.current = new AbortController();

    try {
      const demo = await uploadProfessionDemo(
        rowId,
        f,
        (p) => setDemoUploadPct(p),
        demoAbortRef.current.signal
      );

      const full: ProfessionDemo = {
        id: demo.id,
        fileId: demo.fileId,
        workerProfessionId: rowId,
        createdAt: demo.createdAt || new Date().toISOString(),
        comment: demo.comment ?? null,
        url: demoUrlFromFileId(demo.fileId),
        type: demoTypeFromFileId(demo.fileId),
      };

      setDemos((s) => [full, ...s]);
      setDemoUploadPct(null);
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      setDemoUploadErr(err?.message || "Не удалось загрузить портфолио");
      setDemoUploadPct(null);
    } finally {
      if (demoFileInputRef.current) demoFileInputRef.current.value = "";
    }
  };

  const canUploadDemo = mode === "edit" && Boolean(rowId);

  const Pill = (
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
  ) => {
    const { active, style, onClick, ...rest } = props;
    return (
      <button
        type="button" // 🔴 важно
        role="tab"
        {...rest}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick?.(e);
        }}
        style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: `1px solid ${active ? "#2C64FF" : "#f1f4f9"}`,
          background: active ? "#2C64FF" : "#f1f4f9",
          color: active ? "#fff" : "#111827",
          fontWeight: 500,
          transition: "all .15s",
          cursor: "pointer",
          userSelect: "none",
          ...style,
        }}
      />
    );
  };

  // TILE (профессия)
  const Tile = (
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      active?: boolean;
      disabled?: boolean;
    }
  ) => {
    const { active, disabled, style, onClick, ...rest } = props;
    return (
      <button
        type="button" // 🔴 важно
        {...rest}
        disabled={disabled}
        onClick={(e) => {
          if (disabled) return;
          e.preventDefault();
          e.stopPropagation();
          onClick?.(e);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          textAlign: "left",
          padding: "10px 12px",
          borderRadius: 12,
          border: `1px solid ${active ? "#f1f4f9" : "#fff"}`,
          background: active ? "#f1f4f9" : "#fff",
          color: disabled ? "#9CA3AF" : "#111827",
          opacity: disabled ? 0.6 : 1,
          transition: "all .15s",
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          ...style,
        }}
      />
    );
  };

  return (
    <Page>
      <Header>
        <Title>
          {mode === "create"
            ? t("worker.modalCreateTitle")
            : t("worker.modalEditTitle", {
                name:
                  (professions.find((p) => p.id === professionId) &&
                    (lang === "uz"
                      ? (professions.find((p) => p.id === professionId) as any)
                          ?.nameUz
                      : (professions.find((p) => p.id === professionId) as any)
                          ?.nameRu)) ||
                  "",
              })}
        </Title>
      </Header>

      <Card style={{ marginTop: 12 }}>
        <CardHeader>
          <CardTitle>{t("worker.fillForm") || "Заполните форму"}</CardTitle>
          <EditBtn type="button" onClick={() => navigate("/app/profile")}>
            {t("worker.back") || "Назад"}
          </EditBtn>
        </CardHeader>

        <CardBody>
          <FormGrid columns={1}>
            <Field>
              <Label>{t("worker.selectProfession")}</Label>

              {/* Табы категорий */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {categories.map((cat) => (
                  <Pill
                    key={String(cat.id)}
                    active={String(activeCatId) === String(cat.id)}
                    onClick={() => setActiveCatId(String(cat.id))}
                  >
                    {catLabel(cat)}
                  </Pill>
                ))}
              </div>

              {/* Сетка профессий активной категории */}
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  marginTop: 14,
                }}
              >
                {(
                  categories.find((c) => String(c.id) === String(activeCatId))
                    ?.professions || []
                ).map((p) => {
                  const disabled =
                    mode === "create" ? createdIds.has(p.id) : false;
                  const active = String(professionId) === String(p.id);
                  return (
                    <Tile
                      key={String(p.id)}
                      active={active}
                      disabled={disabled || profLoading || mode === "edit"}
                      onClick={() => {
                        if (!disabled && mode !== "edit")
                          setProfessionId(String(p.id));
                      }}
                      title={
                        disabled && mode === "create"
                          ? t("worker.createdDisabledHint")
                          : undefined
                      }
                    >
                      {/* Иконка слева — можно поставить заглушку/эмодзи или SVG */}
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          background: "#2c64ff",
                        }}
                      >
                        <HardHat color="#fff" size={20} strokeWidth={1.5} />
                        {/* placeholder icon */}
                      </div>
                      <div style={{ lineHeight: 1.25 }}>
                        <div style={{ fontWeight: 400, color: "#475569" }}>
                          {profLabel(p)}
                        </div>
                        {/* при желании — подсказки/описание */}
                      </div>
                    </Tile>
                  );
                })}
              </div>

              {mode === "create" && (
                <Help style={{ marginTop: 8 }}>
                  {t("worker.createdDisabledHint")}
                </Help>
              )}
            </Field>
            {Array.isArray(workerProfs) &&
              mode === "edit" &&
              rowId &&
              (() => {
                const row = workerProfs.find((r) => r.id === rowId);
                const exp = Array.isArray(row?.experience)
                  ? row!.experience!
                  : [];
                return (
                  <div style={{ marginTop: 24 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <Label
                        style={{ fontSize: 18, fontWeight: 600, color: "#000" }}
                      >
                        Опыт работы
                        {exp.length
                          ? `: ${exp.length} ${
                              exp.length === 1 ? "запись" : "записи"
                            }`
                          : ""}
                      </Label>
                      <PrimaryBtn
                        type="button"
                        onClick={() =>
                          navigate(
                            `/app/worker/profile/experience/new?pid=${rowId}`
                          )
                        }
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          data-qa="link-icon-left"
                          role="img"
                          focusable="false"
                          className="magritte-icon___rRr4Q_12-3-5 magritte-icon_initial-primary___KhLAU_12-3-5"
                        >
                          <g>
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.3 7.3V3H8.7V7.3H13V8.7H8.7V13H7.3V8.7H3V7.3H7.3Z"
                              fill="currentColor"
                            ></path>
                          </g>
                        </svg>{" "}
                        Добавить
                      </PrimaryBtn>
                    </div>

                    {exp.length ? (
                      <div
                        style={{
                          position: "relative",
                          padding: 16,
                          borderRadius: 16,
                          background: "#fff",
                          border: "1px solid #E5E7EB",
                        }}
                      >
                        {/* вертикальная линия через всю колонку */}
                        <div
                          style={{
                            position: "absolute",
                            left: 56, // ← якорь линии
                            top: 16,
                            bottom: 16,
                            width: 1,
                            background: "#aabbca",
                            zIndex: 0,
                          }}
                        />

                        <div style={{ display: "grid", gap: 24 }}>
                          {exp.map((e, i) => {
                            const isLast = i === exp.length - 1;
                            return (
                              <div
                                key={e.id || i}
                                style={{
                                  position: "relative",
                                  paddingLeft: 88,
                                }}
                              >
                                {/* аватар (на линии) */}
                                <div
                                  style={{
                                    position: "absolute",
                                    left: 18, // 56(line) - 18(radius) = 38
                                    top: 4,
                                    width: 45,
                                    height: 45,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    background: "#F8FAFC",
                                    border: "1px solid #E2E8F0",
                                    boxShadow: "0 0 0 4px #fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 2,
                                  }}
                                >
                                  <img
                                    src="/org.png"
                                    alt=""
                                    style={{ objectFit: "cover" }}
                                    width={45}
                                    height={45}
                                  />
                                </div>

                                {/* точка-маркёр под карточкой (строго на линии) */}
                                <div
                                  style={{
                                    position: "absolute",
                                    left: 39 - 5, // центрировать круг на линии (10px ширина)
                                    top: 65, // фикс ниже аватара; держит визуальный “узел”
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: "#aabbca",
                                    border: "3px solid #fff",
                                    zIndex: 1,
                                  }}
                                />

                                {/* карточка */}
                                <div
                                  style={{
                                    background: "#fff",
                                    borderRadius: 12,
                                    padding: "14px 18px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 16,
                                      textTransform: "capitalize",
                                      color: "#111827",
                                    }}
                                  >
                                    {e.jobPlace || "—"}
                                  </div>

                                  <div
                                    style={{
                                      color: "#475569",
                                      fontSize: 13,
                                      marginTop: 4,
                                    }}
                                  >
                                    {e.startedAt
                                      ? `${e.startedAt}${
                                          e.endedAt
                                            ? ` — ${e.endedAt}`
                                            : " — н.в."
                                        }`
                                      : ""}
                                  </div>

                                  {e.jobDescription && (
                                    <div
                                      style={{
                                        marginTop: 8,
                                        color: "#334155",
                                        fontSize: 14,
                                        lineHeight: 1.55,
                                        whiteSpace: "pre-line",
                                      }}
                                    >
                                      {e.jobDescription}
                                    </div>
                                  )}

                                  {/* edit */}
                                  <div
                                    style={{
                                      position: "absolute",
                                      right: 16,
                                      top: 16,
                                      cursor: "pointer",
                                      opacity: 0.65,
                                    }}
                                    title="Редактировать"
                                    onClick={() =>
                                      navigate(
                                        `/app/worker/profile/experience/${e.id}/edit?pid=${rowId}`
                                      )
                                    }
                                  >
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      name="experience"
                                      mode="secondary"
                                      aria-hidden="true"
                                      role="img"
                                      focusable="false"
                                      className="magritte-icon___rRr4Q_12-3-5 magritte-icon_initial-secondary___BoQi4_12-3-5 magritte-icon_disabled-secondary___gfR6-_12-3-5 magritte-icon_highlighted-secondary___wJpNN_12-3-5 magritte-icon_pressed-secondary___Lk1tr_12-3-5"
                                    >
                                      <g>
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M2.8 21.2L2.8 17.6746L14.1009 6.37362L17.6264 9.89905L6.32544 21.2H2.8ZM18.8992 8.62626L20.4699 7.05558C21.4434 6.08206 21.4434 4.50366 20.4699 3.53014C19.4963 2.55662 17.9179 2.55662 16.9444 3.53014L15.3737 5.10083L18.8992 8.62626ZM1 23L1 16.929L15.6716 2.25735C17.3481 0.580884 20.0662 0.580883 21.7427 2.25735C23.4191 3.93382 23.4191 6.6519 21.7427 8.32837L7.07102 23H1Z"
                                          fill="currentColor"
                                        ></path>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <Help style={{ marginTop: 8 }}>
                        Пока нет записей опыта.
                      </Help>
                    )}
                  </div>
                );
              })()}

            <Field>
              <Label>{t("worker.minPrice")}</Label>
              <Input
                placeholder={t("worker.minPlaceholderFrom")}
                inputMode="numeric"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </Field>

            <Field>
              <Label>{t("worker.maxPrice")}</Label>
              <Input
                placeholder={t("worker.maxPlaceholderTo")}
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Field>

            <Field>
              <Label>{t("worker.bigProjectsReady")}</Label>
              <ToggleGroup>
                <Toggle
                  active={readyForHugeProject}
                  onClick={() => setReadyForHugeProject(true)}
                >
                  {t("worker.yes")}
                </Toggle>
                <Toggle
                  active={!readyForHugeProject}
                  onClick={() => setReadyForHugeProject(false)}
                >
                  {t("worker.no")}
                </Toggle>
              </ToggleGroup>
            </Field>

            <Field style={{ gridColumn: "1 / -1" }}>
              <Label>{t("scheduleLabel")}</Label>
              <Inline style={{ flexWrap: "wrap", gap: 8 }}>
                {dayDefs.map(({ key, short, long }) => (
                  <Toggle
                    key={key}
                    active={schedule[key]}
                    onClick={() =>
                      setSchedule((s) => ({ ...s, [key]: !s[key] }))
                    }
                    title={long}
                  >
                    {short}
                  </Toggle>
                ))}
              </Inline>
              <Help>{t("scheduleHelp")}</Help>
            </Field>

            <Field>
              <Label>{t("worker.teamPresence")}</Label>
              <Inline>
                <ToggleGroup>
                  <Toggle active={hasTeam} onClick={() => setHasTeam(true)}>
                    {t("worker.yes")}
                  </Toggle>
                  <Toggle active={!hasTeam} onClick={() => setHasTeam(false)}>
                    {t("worker.no")}
                  </Toggle>
                </ToggleGroup>
                <Input
                  placeholder={t("worker.peopleCount")}
                  inputMode="numeric"
                  disabled={!hasTeam}
                  value={teamMemberCount}
                  onChange={(e) => setTeamMemberCount(e.target.value)}
                  style={{ width: 200 }}
                />
              </Inline>
            </Field>

            <Field style={{ gridColumn: "1 / -1", minWidth: 0, width: "100%" }}>
              <Label>{t("worker.serviceZones") || "Зоны обслуживания"}</Label>
              <Help>
                {t("worker.mapHint") ||
                  "Клик по карте добавляет новую зону. Перетащи пин — центр. Радиус меняется ниже."}
              </Help>

              <div style={{ marginTop: 10 }}>
                <MapYandexLocations
                  apiKey={import.meta.env.VITE_YMAPS_API_KEY as string}
                  locations={locations.map<MapLocation>((l) => ({
                    latitude: Number(l.latitude) || 0,
                    longitude: Number(l.longitude) || 0,
                    radius: Number(l.radius) || 0,
                  }))}
                  onAdd={(loc) =>
                    setLocations((s) => [...s, normalizeLoc(loc)])
                  }
                  onChange={(index, loc) => {
                    changeLocation(index, "latitude", String(loc.latitude));
                    changeLocation(index, "longitude", String(loc.longitude));
                  }}
                  onRemove={(index) => removeLocation(index)}
                />
              </div>

              <div style={{ display: "grid", gap: 10, marginTop: 12, width: "100%", minWidth: 0 }}>
  {locations.map((l, idx) => (
    <ZoneRow key={idx}>
      <Input
        placeholder="Широта"
        inputMode="decimal"
        value={l.latitude}
        style={{ minWidth: 0, width: "100%" }}
        onChange={(e) =>
          changeLocation(idx, "latitude", e.target.value)
        }
      />

      <Input
        placeholder="Долгота"
        inputMode="decimal"
        value={l.longitude}
        style={{ minWidth: 0, width: "100%" }}
        onChange={(e) =>
          changeLocation(idx, "longitude", e.target.value)
        }
      />

      <RadiusBlock>
        <RadiusRow>
          <label style={{ fontSize: 12, color: "#6b7a90" }}>
            Радиус, км
          </label>
          <Input
            placeholder="км"
            inputMode="decimal"
            value={l.radius}
            onChange={(e) =>
              changeLocation(idx, "radius", e.target.value)
            }
            style={{ width: 90 }}
          />
        </RadiusRow>

        <input
          type="range"
          min={1}
          max={100}
          step={1}
          value={Number(l.radius) || 0}
          onChange={(e) =>
            changeLocation(idx, "radius", e.target.value)
          }
        />
      </RadiusBlock>

      <RemoveBtn
        type="button"
        onClick={() => removeLocation(idx)}
        disabled={locations.length === 1}
      >
        Удалить
      </RemoveBtn>
    </ZoneRow>
  ))}

  <div>
    <EditBtn type="button" onClick={addLocation}>
      + {t("worker.addZone") || "Добавить зону"}
    </EditBtn>
  </div>
</div>

            </Field>

            <Field>
              <Label>{t("worker.jobFormat") || "Формат работы"}</Label>
              <ToggleGroup>
                <Toggle
                  active={jobType === "SOLO"}
                  onClick={() => setJobType("SOLO")}
                  title="Самозанятый/фрилансер"
                >
                  Yakka
                </Toggle>
                <Toggle
                  active={jobType === "EMPLOYEE"}
                  onClick={() => setJobType("EMPLOYEE")}
                  title="Работа по найму"
                >
                  Ishchi
                </Toggle>
                <Toggle
                  active={jobType === "ABROAD"}
                  onClick={() => setJobType("ABROAD")}
                  title="Готов к работе за рубежом"
                >
                  Xorijda
                </Toggle>
              </ToggleGroup>
            </Field>

            <Field>
              <Label>{t("worker.contestsParticipation")}</Label>
              <ToggleGroup>
                <Toggle
                  active={competitions === "YES"}
                  onClick={() => setCompetitions("YES")}
                >
                  {t("worker.yes")}
                </Toggle>
                <Toggle
                  active={competitions === "NO"}
                  onClick={() => setCompetitions("NO")}
                >
                  {t("worker.no")}
                </Toggle>
              </ToggleGroup>
            </Field>

            <Field>
              <Label>{t("worker.inventoryLabel")}</Label>
              <Input
                placeholder={t("worker.inventoryPlaceholder")}
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
              />
              <Help>{t("worker.inventoryHelp")}</Help>
            </Field>
          </FormGrid>

          {/* ПОРТФОЛИО (только в edit есть rowId) */}
          <div style={{ marginTop: 16 }}>
            <Label>{t("worker.portfolioLabel")}</Label>

            <Upload
              as="label"
              htmlFor={canUploadDemo ? demoInputId : undefined}
              style={{
                marginTop: 8,
                cursor: canUploadDemo ? "pointer" : "not-allowed",
              }}
              aria-disabled={!canUploadDemo}
              title={
                canUploadDemo
                  ? t("worker.dragFileHere")
                  : t("worker.needSaveFirst")
                }
            >
              <div>
                {t("worker.dragFileHere")}
                <br />
                <Small>{t("worker.portfolioHelp")}</Small>
                {!canUploadDemo && (
                  <div style={{ marginTop: 6 }}>
                    <Small>{t("worker.needSaveFirst")}</Small>
                  </div>
                )}
              </div>

              <input
                id={demoInputId}
                ref={demoFileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={onDemoFileChange}
                disabled={!canUploadDemo}
                style={{ display: "none" }}
              />
            </Upload>

            {demoUploadPct !== null && (
              <div style={{ marginTop: 10 }}>
                <Progress>
                  <i style={{ width: `${demoUploadPct}%` }} />
                </Progress>
                <Inline style={{ marginTop: 6 }}>
                  <Small>
                    {t("worker.loading")}: {demoUploadPct}%
                  </Small>
                  <EditBtn
                    type="button"
                    onClick={() => {
                      demoAbortRef.current?.abort();
                      setDemoUploadPct(null);
                    }}
                  >
                    {t("worker.cancel")}
                  </EditBtn>
                </Inline>
              </div>
            )}

            {demoUploadErr && (
              <Notice tone="error" style={{ marginTop: 8 }}>
                {demoUploadErr}
              </Notice>
            )}

            {demos.length > 0 && (
              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                }}
              >
                <Image.PreviewGroup>
                  {demos
                    .filter((d) => d.type !== "video")
                    .map((d) => (
                      <div
                        key={d.id}
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        <Image
                          src={d.url}
                          alt=""
                          width="100%"
                          height={140}
                          style={{ objectFit: "cover", display: "block" }}
                        />
                      </div>
                    ))}
                </Image.PreviewGroup>

                {demos
                  .filter((d) => d.type === "video")
                  .map((d) => (
                    <div
                      key={d.id}
                      style={{
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <video
                        src={d.url}
                        controls
                        playsInline
                        style={{
                          width: "100%",
                          height: 140,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          <Actions style={{ marginTop: 12 }}>
            <PrimaryBtn
              type="button"
              onClick={onSave}
              disabled={saving || !professionId}
            >
              {saving
                ? t("worker.saving")
                : mode === "create"
                ? t("worker.create")
                : t("worker.save")}
            </PrimaryBtn>
            <EditBtn type="button" onClick={() => navigate("/app/profile")}>
              {t("worker.close")}
            </EditBtn>
          </Actions>

          {saveErr && (
            <Notice tone="error" style={{ marginTop: 12 }}>
              {saveErr}
            </Notice>
          )}
          {savedOk && (
            <Notice tone="success" style={{ marginTop: 12 }}>
              {t("worker.saveSuccess")}
            </Notice>
          )}
        </CardBody>
      </Card>
    </Page>
  );
}
