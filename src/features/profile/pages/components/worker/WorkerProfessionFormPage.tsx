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
  GhostBtn,
  Progress,
  Small,
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
  UploadedDoc,
  getWorkerDocuments,
} from "../../../../../shared/modules/worker";
import type {
  JobType,
  ProfessionDemo,
  WeekSchedule,
} from "../../../../../shared/modules/worker";

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
  `https://pointer.uz/public/demo/${fileId}`;

export default function WorkerProfessionFormPage({ mode }: Props) {
  const { rowId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const lang = (localStorage.getItem("i18nextLng") || "ru").split("-")[0];
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
        const [opts, rows] = await Promise.all([
          getProfessions(ac.signal),
          getWorkerProfessions(ac.signal).catch(
            () => [] as WorkerProfessionRow[]
          ),
        ]);
        setProfessions(opts);
        setWorkerProfs(rows);
        setCreatedIds(new Set(rows.map((r) => r.professionId)));

        if (mode === "edit") {
          const row = rows.find((r) => r.id === rowId);
          if (row) {
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
              (row as any)?.schedule &&
                typeof (row as any).schedule === "object"
                ? (row as any).schedule
                : defaultSchedule
            );
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
            }
            // демо в этой странице как плоский список
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
          // create — подставить первую доступную профессию
          const firstAvail = opts.find(
            (p) => !rows.some((r) => r.professionId === p.id)
          );
          setProfessionId(firstAvail?.id || "");
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
      const parsedLocations = locations
        .map((l) => {
          const lon = normalizeDecimal(l.longitude);
          const lat = normalizeDecimal(l.latitude);
          const radNum = Number(normalizeDecimal(l.radius));
          return { longitude: lon, latitude: lat, radius: radNum };
        })
        .filter(
          (l) =>
            isDec(l.longitude) && isDec(l.latitude) && Number.isFinite(l.radius)
        );

      const payload = {
        professionId,
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 0,
        hasTeam,
        teamMemberCount: Number(teamMemberCount) || 0,
        readyForHugeProject,
        competitions,
        jobType,
        locations: parsedLocations,
        schedule,
        inventory: inventory?.trim() || "",
      };

      if (mode === "edit" && rowId) {
        await updateWorkerProfession(rowId, payload as any);
      } else {
        await saveWorkerProfession(payload as any);
      }

      setSavedOk(true);
      setTimeout(() => {
        navigate("/app/profile");
      }, 300);
    } catch (e: any) {
      setSaveErr(e?.message || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const onDemoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) {
      setDemoUploadErr("Файл превышает 20 МБ");
      e.target.value = "";
      return;
    }
    if (mode !== "edit" || !rowId) {
      setDemoUploadErr(
        "Сначала сохраните (или перейдите в режим редактирования)"
      );
      e.target.value = "";
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
          <GhostBtn type="button" onClick={() => navigate("/app/profile")}>
            {t("worker.back") || "Назад"}
          </GhostBtn>
        </CardHeader>

        <CardBody>
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
                  disabled={profLoading || mode === "edit"}
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

            <Field style={{ gridColumn: "1 / -1" }}>
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
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
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
                    + {t("worker.addZone") || "Добавить зону"}
                  </GhostBtn>
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
                  <GhostBtn
                    type="button"
                    onClick={() => {
                      demoAbortRef.current?.abort();
                      setDemoUploadPct(null);
                    }}
                  >
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
            <GhostBtn type="button" onClick={() => navigate("/app/profile")}>
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
        </CardBody>
      </Card>
    </Page>
  );
}
