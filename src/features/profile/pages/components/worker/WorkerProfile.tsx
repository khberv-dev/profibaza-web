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
import { useNavigate } from "react-router-dom";

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
    `https://pointer.uz/public/demo/${fileId}`; // твой CDN/endpoint
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
        const [opts, rows] = await Promise.all([
          getProfessions(ac.signal),
          getWorkerProfessions(ac.signal).catch(
            () => [] as WorkerProfessionRow[]
          ),
        ]);
        setProfessions(opts);
        setWorkerProfs(rows);
        setCreatedIds(new Set(rows.map((r) => r.professionId)));

        // <-- НОВОЕ: собираем карту демо из уже полученных rows
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
    if (f.size > 20 * 1024 * 1024) {
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
      </Header>

      <Layout>
        <Main>
          {/* ===== Мои профессии ===== */}
          <Card>
            <CardHeader>
              <CardTitle>{t("worker.myProfs")}</CardTitle>
              <GhostBtn
                type="button"
                onClick={handleCreateClick}
                title={
                  hasAvailableForCreate
                    ? t("worker.canCreateHint")
                    : t("worker.cantCreateHint")
                }
              >
                {t("worker.createNew")}
              </GhostBtn>
            </CardHeader>
            <CardBody>
              {createdList.length > 0 ? (
                <div style={{ display: "grid", gap: 12 }}>
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
                          <div>
                            <JobTitle>{label}</JobTitle>
                            <Meta>
                              <Clock size={14} className="icon" />
                              {t("worker.updated")} {fmtUpdated(f.updatedAt)}
                            </Meta>
                          </div>

                          <PrimaryBtn
                            type="button"
                            onClick={() =>
                              navigate(`/app/worker/profile/${row.id}/edit`)
                            }
                          >
                            <img
                              src="/pen.svg"
                              style={{
                                filter: "brightness(0) invert(1)",
                                width: 18,
                              }}
                            />
                            {t("worker.edit")}
                          </PrimaryBtn>
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
                          <b
                            style={{
                              display: "inline-flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <Wrench size={14} className="icon" />
                            {t("worker.tools")}
                          </b>{" "}
                          {f.inventory ? f.inventory : t("worker.notSpecified")}
                        </MutedBar>
                      </JobItem>
                    );
                  })}
                </div>
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
                  {docs.map((d) => (
                    <DocItem key={d.id}>
                      <div>
                        <strong>{d.type || t("worker.document")}</strong>{" "}
                        {d.createdAt && (
                          <Small>
                            {new Date(d.createdAt).toLocaleDateString()}
                          </Small>
                        )}
                      </div>
                      {d.fileId ? (
                        <PrimaryBtn
                          type="button"
                          onClick={() =>
                            downloadWorkerDocument(
                              d.fileId!,
                              d.name || undefined
                            )
                          }
                        >
                          {t("worker.download")}
                        </PrimaryBtn>
                      ) : (
                        <Small>{t("worker.linkAfterMod")}</Small>
                      )}
                    </DocItem>
                  ))}
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
              <div style={{ marginTop: 10 }}>
                <Progress>
                  <i style={{ width: `${workerProfRaw ? 70 : 40}%` }} />
                </Progress>
              </div>
            </CardBody>
          </Card>
        </Aside>
      </Layout>

      {/* ===== МОДАЛ ===== */}
      <Modal
        open={modalOpen}
        title={
          mode === "create"
            ? t("worker.modalCreateTitle")
            : t("worker.modalEditTitle", { name: profLabelById(professionId) })
        }
        onClose={closeForm}
        width={820}
        maxWidth="92vw"
        closeOnOverlay={true}
        ariaLabel={t("worker.modalAria")}
      >
        <FormGrid columns={2}>
          <Field>
            <Label>{t("worker.selectProfession")}</Label>
            <SelectBox>
              <CustomSelect
                id="worker-profession"
                options={profOptions}
                value={professionId || null}
                onChange={(value) => setProfessionId(String(value ?? ""))}
                placeholder={t("worker.selectPlaceholder")}
                disabled={
                  mode === "edit" || profLoading || profOptions.length === 0
                }
                loading={profLoading}
                width="100%"
                menuMaxHeight={300}
              />
            </SelectBox>
            {mode === "create" && (
              <Help>{t("worker.createdDisabledHint")}</Help>
            )}
          </Field>

          <div />

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
                  onClick={() => setSchedule((s) => ({ ...s, [key]: !s[key] }))}
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

          <Field style={{ gridColumn: "1 / -1" }}>
            <Label>Зоны обслуживания</Label>
            <Help>
              Клик по карте добавляет новую зону. Перетащи пин — чтобы сменить
              центр. Радиус меняется ползунком/инпутом ниже.
            </Help>

            <div style={{ marginTop: 10 }}>
              <MapYandexLocations
                apiKey={import.meta.env.VITE_YMAPS_API_KEY as string} // ← положи ключ в .env
                locations={locations.map<MapLocation>((l) => ({
                  latitude: Number(l.latitude) || 0,
                  longitude: Number(l.longitude) || 0,
                  radius: Number(l.radius) || 0, // км
                }))}
                onAdd={(loc) => {
                  setLocations((s) => [...s, normalizeLoc(loc)]);
                }}
                onChange={(index, loc) => {
                  changeLocation(index, "latitude", String(loc.latitude));
                  changeLocation(index, "longitude", String(loc.longitude));
                  // радиус правится внизу контролами
                }}
                onRemove={(index) => removeLocation(index)}
              />
            </div>

            {/* Контролы радиусов и точный ввод координат */}
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {locations.map((l, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Input
                    placeholder="Широта"
                    inputMode="decimal"
                    value={l.latitude}
                    onChange={(e) =>
                      changeLocation(idx, "latitude", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Долгота"
                    inputMode="decimal"
                    value={l.longitude}
                    onChange={(e) =>
                      changeLocation(idx, "longitude", e.target.value)
                    }
                  />

                  <div style={{ display: "grid", gap: 6 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
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
                    </div>
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
                  </div>

                  <GhostBtn
                    type="button"
                    onClick={() => removeLocation(idx)}
                    disabled={locations.length === 1}
                    title={
                      locations.length === 1
                        ? "Нужна хотя бы одна зона"
                        : "Удалить"
                    }
                  >
                    Удалить
                  </GhostBtn>
                </div>
              ))}
              <div>
                <GhostBtn type="button" onClick={addLocation}>
                  + Добавить зону
                </GhostBtn>
              </div>
            </div>
          </Field>

          <Field>
            <Label>Формат работы</Label>
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
                <GhostBtn type="button" onClick={cancelDemoUpload}>
                  {t("worker.cancel")}
                </GhostBtn>
              </Inline>
            </div>
          )}
          {demoUploadErr && (
            <Notice tone="error" style={{ marginTop: 8 }}>
              {demoUploadErr}
            </Notice>
          )}

          {(() => {
            const rowId = currentRowId;
            const list = rowId ? demosByRowId[rowId] || [] : [];
            if (!rowId) {
              return (
                <Small style={{ display: "block", marginTop: 8 }}>
                  {t("worker.saveProfessionToAddDemos")}
                </Small>
              );
            }
            if (list.length === 0) return null;

            const images = list.filter((d) => d.type !== "video");
            const videos = list.filter((d) => d.type === "video");

            return (
              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                }}
              >
                <Image.PreviewGroup>
                  {images.map((d) => (
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

                {videos.map((d) => (
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
            );
          })()}
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
          <GhostBtn type="button" onClick={closeForm}>
            {t("worker.close")}
          </GhostBtn>
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
      </Modal>
    </Page>
  );
};
