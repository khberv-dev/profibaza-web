import React, { use, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Pencil,
  Clock,
  Users,
  Banknote,
  Rocket,
  Trophy,
  Wrench,
} from "lucide-react";
import { Image } from "antd";
import { toast, Toaster } from "react-hot-toast";
import {
  Page,
  Header,
  Title,
  Layout,
  Main,
  Aside,
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
  DocList,
  DocItem,
  Notice,
  Actions,
  PrimaryBtn,
  GhostBtn,
  Progress,
  Small,
  JobItem,
  JobTitle,
  StatRow,
  StatPill,
  ActionRow,
  SoftPill,
  MutedBar,
  HeadRow,
  Meta,
  ProfList,
  ProfIconWrap,
  ProfHeadBlock,
  SectionHint,
  ProgressMeta,
  HeadActions,
} from "./worker-profile.style";

import {
  downloadWorkerDocument,
  getProfessions,
  getWorkerDocuments,
  saveWorkerProfession,
  uploadWorkerDocument,
  Profession,
  UploadedDoc,
  updateWorkerProfession,
  WorkerProfessionRow,
  uploadProfessionDemo,
  getWorkerProfessions,
  downloadWorkerResume,
} from "../../../../../shared/modules/worker";
type DemoMap = Record<
  string,
  import("../../../../../shared/modules/worker").ProfessionDemo[]
>;
import type {
  JobType,
  ProfessionDemo,
  WeekSchedule,
} from "../../../../../shared/modules/worker";
import CustomSelect, {
  SelectOption,
} from "../../../../../components/custom-select/CustomSelect";
import axios from "axios";
import { Modal } from "../../../../../components/modal/Modal";
import { useTranslation } from "react-i18next";
import {
  MapLocation,
  MapYandexLocations,
} from "../../../../../components/map/MapYandexLocations";
import { useNavigate, Link } from "react-router-dom";
import { EditBtn } from "../../../pro-profile-section.style";

const defaultSchedule: import("../../../../../shared/modules/worker").WeekSchedule =
  {
    monday: true,
    tuesday: false,
    wednesday: true,
    thursday: false,
    friday: true,
    saturday: false,
    sunday: false,
  };

type Mode = "list" | "create" | "edit";
type RawDemo = {
  id: string;
  fileId: string;
  workerProfessionId: string;
  createdAt: string;
  comment?: string | null;
};

export const WorkerProfile: React.FC = () => {
  const { t } = useTranslation();
  // === справочники / текущие данные ===
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [profLoading, setProfLoading] = useState(true);
  const [workerProfs, setWorkerProfs] = useState<WorkerProfessionRow[]>([]);
  const [currentRowId, setCurrentRowId] = useState<string | null>(null);
  const [demosByRowId, setDemosByRowId] = useState<DemoMap>({});
  const [demoUploadPct, setDemoUploadPct] = useState<number | null>(null);
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [demoUploadErr, setDemoUploadErr] = useState<string | null>(null);
  const demoFileInputRef = useRef<HTMLInputElement | null>(null);
  const demoAbortRef = useRef<AbortController | null>(null);
  const [jobType, setJobType] = useState<JobType>("SOLO");
  const [locations, setLocations] = useState<
    { longitude: string; latitude: string; radius: string }[]
  >([{ longitude: "65.0009", latitude: "38.9020", radius: "10" }]);

  // id профессий, уже созданных у пользователя
  const [createdIds, setCreatedIds] = useState<Set<string>>(new Set());

  const [workerProfRaw, setWorkerProfRaw] =
    useState<WorkerProfessionRow | null>(null);

  // === UI режим ===
  const [mode, setMode] = useState<Mode>("list");

  // === форма ===
  const [professionId, setProfessionId] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [hasTeam, setHasTeam] = useState(false);
  const [teamMemberCount, setTeamMemberCount] = useState("1");
  const [readyForHugeProject, setReadyForHugeProject] = useState(false);
  const [competitions, setCompetitions] = useState<"YES" | "NO">("NO");
  const [inventory, setInventory] = useState<string>("");

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

  // async state
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);
  const navigate = useNavigate();
  // документы
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const lang = (localStorage.getItem("i18nextLng") || "ru").split("-")[0];
  const profLabel = (p: Profession) =>
    (lang === "uz" ? (p as any).nameUz : (p as any).nameRu) || "";
  const profLabelById = (id?: string) => {
    const p = professions.find((x) => x.id === id);
    return p ? profLabel(p) : "";
  };

  // опции селекта (в create — созданные disabled)
  const profOptions: SelectOption[] = useMemo(
    () =>
      professions.map((p) => ({
        value: p.id,
        label: profLabel(p),
        // если профессия уже создана → disabled
        disabled: createdIds.has(p.id),
      })),
    [professions, createdIds]
  );

  // только созданные профессии
  const createdList = useMemo(() => {
    // маппим к объекту { row, profession }
    return workerProfs
      .map((row) => ({
        row,
        profession: professions.find((p) => p.id === row.professionId) || null,
      }))
      .filter((x) => !!x.profession);
  }, [workerProfs, professions]);

  const hasAvailableForCreate = useMemo(
    () => professions.some((p) => !createdIds.has(p.id)),
    [professions, createdIds]
  );

  const demoUrlFromFileId = (fileId: string) =>
    `https://profibaza.uz/public/demo/${fileId}`; // твой CDN/endpoint
  const demoTypeFromFileId = (fileId: string): "image" | "video" => {
    const ext = (fileId.split(".").pop() || "").toLowerCase();
    const vid = ["mp4", "mov", "webm", "m4v"];
    return vid.includes(ext) ? "video" : "image";
  };

  // Превращаем raw-данные бекенда в полноценный ProfessionDemo
  const makeDemo = (raw: RawDemo): ProfessionDemo => ({
    id: raw.id,
    fileId: raw.fileId,
    workerProfessionId: raw.workerProfessionId,
    createdAt: raw.createdAt as any,
    comment: raw.comment ?? null,
    url: demoUrlFromFileId(raw.fileId),
    type: demoTypeFromFileId(raw.fileId),
  });

  type DemoMap = Record<string, ProfessionDemo[]>;

  const buildDemoMap = (rows: WorkerProfessionRow[]): DemoMap => {
    const map: DemoMap = {};
    for (const r of rows) {
      const arr = ((r as any)?.demos || []) as RawDemo[];
      map[r.id] = arr.map(makeDemo);
    }
    return map;
  };

  // === загрузка справочников и текущей профессии ===
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setProfLoading(true);
        const [cats, rows] = await Promise.all([
          getProfessions(ac.signal), // -> ProfessionCategory[]
          getWorkerProfessions(ac.signal).catch(
            () => [] as WorkerProfessionRow[]
          ),
        ]);

        // 🔧 расплющиваем категории в список Profession[]
        const flat: Profession[] = cats.flatMap((c) =>
          (c.professions || []).map((p) => ({
            ...p,
            // на всякий случай проставим categoryId из категории, если в элементе его нет
            categoryId: p.categoryId ?? c.id,
          }))
        );

        setProfessions(flat); // ✅ теперь тип совпадает
        setWorkerProfs(rows);
        setCreatedIds(new Set(rows.map((r) => r.professionId)));

        // карта демо
        setDemosByRowId(buildDemoMap(rows));
      } finally {
        setProfLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // документы
  useEffect(() => {
    const ac = new AbortController();
    getWorkerDocuments(ac.signal)
      .then(setDocs)
      .catch((e) =>
        setUploadErr(e?.message || "Не удалось получить документы")
      );
    return () => ac.abort();
  }, []);

  // helpers
  const resetForm = () => {
    setMinPrice("");
    setMaxPrice("");
    setHasTeam(false);
    setTeamMemberCount("1");
    setReadyForHugeProject(false);
    setCompetitions("NO");
    setInventory("");
    setSaveErr(null);
    setSavedOk(false);
    // >>> NEW: сброс jobType/locations
    setJobType("SOLO");
    setSchedule(defaultSchedule);
    setLocations([{ longitude: "65.0009", latitude: "38.9020", radius: "10" }]);
  };

  const openCreateFor = (prefillId?: string) => {
    resetForm();
    setMode("create");
    setCurrentRowId(null);
    if (prefillId) setProfessionId(prefillId);
    else {
      const firstAvail = professions.find((p) => !createdIds.has(p.id));
      setProfessionId(firstAvail?.id || "");
    }
  };

  // открыть «редактирование» — теперь принимаем строку row
  const openEditFor = (row: WorkerProfessionRow) => {
    setMode("edit");
    setCurrentRowId(row.id);
    setProfessionId(row.professionId || "");
    setMinPrice(String(row.minPrice ?? ""));
    setMaxPrice(String(row.maxPrice ?? ""));
    setHasTeam(Boolean(row.hasTeam));
    setTeamMemberCount(String(row.teamMemberCount ?? "1"));
    setReadyForHugeProject(Boolean(row.readyForHugeProject));
    const comp = (row as any)?.competitions;
    setCompetitions(comp === "YES" || comp === "NO" ? comp : "NO");
    setInventory(((row as any)?.inventory as string) ?? "");
    setSchedule(
      (row as any)?.schedule && typeof (row as any).schedule === "object"
        ? (row as any).schedule
        : defaultSchedule
    );
    // >>> NEW: подставляем jobType/locations из строки (если есть)
    setJobType((row.jobType as JobType) || "SOLO");
    const locs = (row.locations || []) as any[];
    if (Array.isArray(locs) && locs.length) {
      setLocations(
        locs.map((l) => ({
          longitude: String(l?.longitude ?? ""),
          latitude: String(l?.latitude ?? ""),
          radius: String(l?.radius ?? ""),
        }))
      );
    } else {
      setLocations([
        { longitude: "65.0009", latitude: "38.9020", radius: "10" },
      ]);
    }
  };

  const closeForm = () => {
    setMode("list");
    setSaveErr(null);
  };

  // upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadErr(null);
    setUploadPct(0);
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const doc = await uploadWorkerDocument(
        f,
        (p) => setUploadPct(p),
        abortRef.current.signal
      );
      setDocs((s) => [doc, ...s]);
      setUploadPct(null);
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      setUploadErr(err?.message || "Ошибка загрузки");
      setUploadPct(null);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const cancelUpload = () => {
    abortRef.current?.abort();
    setUploadPct(null);
  };

  type UpsertPayload = Parameters<typeof saveWorkerProfession>[0];

  // save
  const onSave = async () => {
    setSaving(true);
    setSaveErr(null);
    setSavedOk(false);
    try {
      if (!professionId) throw new Error("Выберите профессию");

      const isDec = (s: string) => /^-?\d+(\.\d+)?$/.test(s);
      const parsedLocations = locations
        .map((l) => {
          const lon = normalizeDecimal(l.longitude);
          const lat = normalizeDecimal(l.latitude);
          const radNum = Number(normalizeDecimal(l.radius));
          return {
            longitude: lon, // string
            latitude: lat, // string
            radius: radNum, // number
          };
        })
        .filter(
          (l) =>
            isDec(l.longitude) && isDec(l.latitude) && Number.isFinite(l.radius)
        );
      const payload: UpsertPayload & {
        locations: { longitude: string; latitude: string; radius: number }[];
      } = {
        professionId,
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 0,
        hasTeam,
        teamMemberCount: Number(teamMemberCount) || 0,
        readyForHugeProject,
        competitions,
        jobType,
        locations: parsedLocations, // ← строки!
        schedule,
        inventory: inventory?.trim() || "",
      };

      if (mode === "edit" && currentRowId) {
        await updateWorkerProfession(currentRowId, payload);
      } else {
        await saveWorkerProfession(payload);
      }

      // перезагрузим список
      const rows = await getWorkerProfessions().catch(
        () => [] as WorkerProfessionRow[]
      );
      setWorkerProfs(rows);
      setCreatedIds(new Set(rows.map((r) => r.professionId)));
      setDemosByRowId(buildDemoMap(rows));
      // актуализируем демо для изменённой строки (если есть)

      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 1500);
      setMode("list");
    } catch (e: any) {
      setSaveErr(e?.message || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const addLocation = () =>
    setLocations((s) => [...s, { longitude: "", latitude: "", radius: "10" }]);

  const removeLocation = (idx: number) =>
    setLocations((s) => s.filter((_, i) => i !== idx));

  const changeLocation = (
    idx: number,
    key: "longitude" | "latitude" | "radius",
    value: string
  ) =>
    setLocations((s) =>
      s.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    );

  // форматирование для карточек
  const fmtMoney = (n: number | string | null | undefined) => {
    if (n === null || n === undefined || n === "") return "—";
    const x = Number(n);
    return Number.isFinite(x) ? x.toLocaleString("ru-RU") : "—";
  };
  const fmtUpdated = (d: string | number | Date | null | undefined) => {
    if (!d) return "—";
    const dd = new Date(d);
    if (isNaN(dd.getTime())) return "—";
    const date = dd.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const time = dd.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} в ${time}`;
  };

  // ====== RENDER ======
  const modalOpen = mode !== "list";
  const modalTitle =
    mode === "create"
      ? "Создание новой профессии"
      : `Редактирование: ${profLabelById(professionId)}`;

  const onDemoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 30 * 1024 * 1024) {
      setDemoUploadErr("Файл превышает 20 МБ");
      e.target.value = "";
      return;
    }
    if (!currentRowId) {
      setDemoUploadErr("Сначала сохраните профессию, затем добавьте портфолио");
      e.target.value = "";
      return;
    }

    setDemoUploadErr(null);
    setDemoUploadPct(0);
    demoAbortRef.current?.abort();
    demoAbortRef.current = new AbortController();

    try {
      // 1) грузим демо
      const demo = await uploadProfessionDemo(
        currentRowId,
        f,
        (p) => setDemoUploadPct(p),
        demoAbortRef.current.signal
      );

      // 2) оптимистично показываем превью (если пришёл local-id — это временно)
      const raw: RawDemo = {
        id: demo.id,
        fileId: demo.fileId,
        workerProfessionId: currentRowId,
        createdAt: demo.createdAt || new Date().toISOString(),
        comment: demo.comment ?? null,
      };
      const full = makeDemo(raw);

      setDemosByRowId((prev) => ({
        ...prev,
        [currentRowId]: [full, ...(prev[currentRowId] || [])],
      }));

      setWorkerProfs((prev) =>
        prev.map((r) =>
          r.id === currentRowId
            ? ({
                ...r,
                demos: [raw, ...(((r as any).demos as RawDemo[]) || [])],
              } as any)
            : r
        )
      );

      // 3) ВАЖНО: после успешной загрузки подтягиваем Актуальные worker professions
      //    (рефрешим rating/updatedAt/нормальный fileId и т.д.)
      const rows = await getWorkerProfessions().catch(
        () => [] as WorkerProfessionRow[]
      );
      setWorkerProfs(rows);
      setCreatedIds(new Set(rows.map((r) => r.professionId)));
      setDemosByRowId(buildDemoMap(rows));

      // 4) UI
      setDemoUploadPct(null);
      toast.success("Портфолио добавлено");
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      setDemoUploadErr(err?.message || "Не удалось загрузить портфолио");
      setDemoUploadPct(null);
    } finally {
      if (demoFileInputRef.current) demoFileInputRef.current.value = "";
    }
  };

  const cancelDemoUpload = () => {
    demoAbortRef.current?.abort();
    setDemoUploadPct(null);
  };

  const demoInputId = useId();
  const canUploadDemo = Boolean(currentRowId);

  const handleCreateClick = () => {
    if (!hasAvailableForCreate) {
      toast.error("Доступные профессии уже созданы");
      return;
    }
    navigate("/app/worker/profile/new");
  };

  const normalizeLoc = (x: any) => ({
    latitude: String(x?.latitude ?? x?.lat ?? ""),
    longitude: String(x?.longitude ?? x?.lng ?? ""),
    radius: String(x?.radius ?? 10),
  });

  const normalizeDecimal = (v: string | number | null | undefined) =>
    String(v ?? "")
      .replace(",", ".")
      .trim();

  const isDec = (s: string) => /^-?\d+(\.\d+)?$/.test(s);

  return (
    <Page>
      <Header>
        <Title>{t("worker.title")}</Title>
        <SectionHint>{t("worker.fillBasic")}</SectionHint>
      </Header>

      <Layout>
        <Main>
          {/* ===== Мои профессии ===== */}
          <Card>
            <CardHeader>
              <CardTitle>{t("worker.myProfs")}</CardTitle>
              <PrimaryBtn
                type="button"
                onClick={handleCreateClick}
                title={
                  hasAvailableForCreate
                    ? t("worker.canCreateHint")
                    : t("worker.cantCreateHint")
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  data-qa="profile-other-communication-methods-add-icon-left"
                  role="img"
                  focusable="false"
                  className="magritte-icon___rRr4Q_12-3-0 magritte-icon_initial-primary___KhLAU_12-3-0"
                >
                  <g>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.1 11.1V4H12.9V11.1H20V12.9H12.9V20H11.1V12.9H4V11.1H11.1Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
                {t("worker.createNew")}
              </PrimaryBtn>
            </CardHeader>
            <CardBody>
              {createdList.length > 0 ? (
                <ProfList>
                  {createdList.map(({ row, profession }) => {
                    const label = profession
                      ? profLabel(profession)
                      : t("worker.profession");
                    const f = {
                      updatedAt: row.updatedAt,
                      minPrice: row.minPrice,
                      maxPrice: row.maxPrice,
                      hasTeam: row.hasTeam,
                      teamCount: row.teamMemberCount,
                      huge: row.readyForHugeProject,
                      competitions: (row as any)?.competitions === "YES",
                      inventory: (row as any)?.inventory || "",
                    };

                    return (
                      <JobItem key={row.id}>
                        <HeadRow>
                          <ProfHeadBlock>
                            <ProfIconWrap>
                              <img src="/hat.svg" alt="" />
                            </ProfIconWrap>
                            <div>
                              <JobTitle>{label}</JobTitle>
                              <Meta>
                                <Clock size={14} className="icon" />
                                {t("worker.updated")} {fmtUpdated(f.updatedAt)}
                              </Meta>
                            </div>
                          </ProfHeadBlock>

                          <HeadActions>
                            <Link to={`/app/worker/profile/${row.id}/edit`}>
                              <EditBtn type="button">{t("worker.edit")}</EditBtn>
                            </Link>

                            <EditBtn
                              type="button"
                              title={
                                t("worker.downloadResume") || "Скачать резюме"
                              }
                              onClick={() =>
                                downloadWorkerResume(
                                  row.id,
                                  `${label}-resume.pdf`
                                )
                              }
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                focusable="false"
                                aria-hidden="true"
                                role="img"
                              >
                                <path
                                  d="M4.1715 6.32824L7.99981 10.1566L11.8281 6.32831L10.8382 5.33837L8.69982 7.47672L8.69982 0.500001L7.29982 0.5L7.29982 7.4767L5.16146 5.3383L4.1715 6.32824Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M8 15.5C1.4375 15.5 0.5 14.5625 0.5 8H1.9C1.9 9.6299 1.96022 10.8076 2.12482 11.6812C2.28685 12.5412 2.52558 12.9676 2.77901 13.221C3.03245 13.4744 3.45877 13.7132 4.31878 13.8752C5.19242 14.0398 6.3701 14.1 8 14.1C9.6299 14.1 10.8076 14.0398 11.6812 13.8752C12.5412 13.7132 12.9676 13.4744 13.221 13.221C13.4744 12.9676 13.7132 12.5412 13.8752 11.6812C14.0398 10.8076 14.1 9.6299 14.1 8H15.5C15.5 14.5625 14.5625 15.5 8 15.5Z"
                                  fill="currentColor"
                                />
                              </svg>
                              {t("worker.downloadResume") || "Скачать резюме"}
                            </EditBtn>
                          </HeadActions>
                        </HeadRow>

                        <div>
                          <Label>{t("worker.params")}</Label>
                          <StatRow>
                            <StatPill title={t("worker.minPrice")}>
                              <Banknote className="icon" />
                              <b>{fmtMoney(f.minPrice)}</b>
                              <span>{t("worker.minPriceSub")}</span>
                            </StatPill>

                            <StatPill title={t("worker.maxPrice")}>
                              <Banknote className="icon" />
                              <b>{fmtMoney(f.maxPrice)}</b>
                              <span>{t("worker.maxPriceSub")}</span>
                            </StatPill>

                            <StatPill
                              title={
                                f.hasTeam
                                  ? t("worker.teamSize")
                                  : t("worker.hasNoTeam")
                              }
                            >
                              <Users className="icon" />
                              <b>{f.hasTeam ? f.teamCount || 0 : 0}</b>
                              <span>
                                {f.hasTeam
                                  ? t("worker.inTeam")
                                  : t("worker.hasNoTeam")}
                              </span>
                            </StatPill>
                          </StatRow>
                        </div>

                        <ActionRow>
                          <SoftPill>
                            <Rocket className="icon" />
                            {t("worker.bigProjects")}:{" "}
                            {f.huge ? t("worker.yes") : t("worker.no")}
                          </SoftPill>

                          <SoftPill>
                            <Trophy className="icon" />
                            {t("worker.contests")}:{" "}
                            {f.competitions ? t("worker.yes") : t("worker.no")}
                          </SoftPill>
                        </ActionRow>

                        <MutedBar>
                          <b>
                            <Wrench size={14} className="icon" />
                            {t("worker.tools")}
                          </b>
                          {f.inventory ? f.inventory : t("worker.notSpecified")}
                        </MutedBar>
                      </JobItem>
                    );
                  })}
                </ProfList>
              ) : (
                <Notice tone="neutral">{t("worker.noneYet")}</Notice>
              )}
            </CardBody>
          </Card>

          {/* Документы */}
          <Card>
            <CardHeader>
              <CardTitle>{t("worker.docsTitle")}</CardTitle>
            </CardHeader>
            <CardBody>
              <Upload>
                <div>
                  {t("worker.dragHere")}
                  <br />
                  <Small>{t("worker.fileWillGo")}</Small>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                />
              </Upload>

              {uploadPct !== null && (
                <div style={{ marginTop: 10 }}>
                  <Progress>
                    <i style={{ width: `${uploadPct}%` }} />
                  </Progress>
                  <Inline style={{ marginTop: 6 }}>
                    <Small>
                      {t("worker.loading")}: {uploadPct}%
                    </Small>
                    <GhostBtn type="button" onClick={cancelUpload}>
                      {t("worker.cancel")}
                    </GhostBtn>
                  </Inline>
                </div>
              )}

              {docs.length > 0 && (
                <DocList style={{ marginTop: 12 }}>
                  {docs.map((d) => {
                    // получаем расширение из fileId (например "qGbacsH2SWn2kIfy8opt.pdf" → "pdf")
                    const ext = d.fileId?.split(".").pop()?.toLowerCase() || "";

                    // подбираем иконку по типу файла
                    const icon =
                      ext === "pdf"
                        ? "/pdf.png"
                        : ext === "jpg" || ext === "jpeg"
                        ? "/jpg.png"
                        : ext === "png"
                        ? "/png.png"
                        : "/file.png";

                    return (
                      <DocItem
                        key={d.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        {/* Левая часть: иконка и инфо */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <img
                            src={icon}
                            alt={ext}
                            style={{
                              width: 35,
                              height: 35,
                              objectFit: "contain",
                              opacity: 0.9,
                              marginLeft: 4,
                            }}
                          />
                          <div>
                            <strong>{d.fileId || t("worker.document")}</strong>{" "}
                            {d.createdAt && (
                              <Small style={{ color: "#64748b" }}>
                                {new Date(d.createdAt).toLocaleDateString()}
                              </Small>
                            )}
                          </div>
                        </div>

                        {/* Правая часть: кнопка */}
                        {d.fileId ? (
                          <PrimaryBtn
                            type="button"
                            onClick={() =>
                              downloadWorkerDocument(
                                d.fileId!,
                                d.type || undefined
                              )
                            }
                          >
                            {t("worker.download")}
                          </PrimaryBtn>
                        ) : (
                          <Small>{t("worker.linkAfterMod")}</Small>
                        )}
                      </DocItem>
                    );
                  })}
                </DocList>
              )}
            </CardBody>
          </Card>
        </Main>

        {/* Сайдбар */}
        <Aside>
          <Card>
            <CardHeader>
              <CardTitle>{t("worker.profileReady")}</CardTitle>
            </CardHeader>
            <CardBody>
              <Small>{t("worker.fillBasic")}</Small>
              <Progress>
                <i style={{ width: `${workerProfRaw ? 70 : 40}%` }} />
              </Progress>
              <ProgressMeta>
                <span>{t("worker.profileReady")}</span>
                <span>{workerProfRaw ? "70%" : "40%"}</span>
              </ProgressMeta>
            </CardBody>
          </Card>
        </Aside>
      </Layout>
    </Page>
  );
};
