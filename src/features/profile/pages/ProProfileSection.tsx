// src/features/profile/pages/ProProfileSection.tsx
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Row,
  SectionTitle,
  Card,
  CardBody,
  PrimaryBtn,
  GhostBtn,
  Notice,
  RailRow,
  Field,
  Label,
  Input,
  Textarea,
  Hint,
  Chips,
  Chip,
  SwitchWrap,
  SwitchBtn,
  Upload,
  PriceRow,
  Inline,
  PillLink,
  Small,
  Divider,
  HotRow,
  HotChip,
  ProfPickerWrap,
  TagList,
  Tag,
  InputBase,
  Dropdown,
  Empty,
  AddGhost,
  GroupLabel,
  OptionRow,
  OptionCheck,
} from "../pro-profile-section.style";
import {
  downloadWorkerDocument,
  getProfessions,
  getWorkerDocuments,
  getWorkerProfession,
  Profession,
  saveWorkerProfession,
  UploadedDoc,
  uploadWorkerDocument,
  WorkerProfessionRow,
} from "../../../shared/modules/worker";
import axios from "axios";
import { api } from "../../../shared/api/client";
import CustomSelect, {
  SelectOption,
} from "../../../components/custom-select/CustomSelect";

// ====== types ======
type Role = "WORKER" | "LEGAL" | "CLIENT";

// ====== Demo options (можно заменить на данные из API) ======
const PROFESSIONS = [
  "Электрик",
  "Сантехник",
  "Строитель",
  "Дизайнер",
  "Сварщик",
  "Маляр",
  "Плотник",
  "Отделочник",
  "Инженер-прораб",
];

const AREAS = [
  "Бухара",
  "Гиждуван",
  "Каган",
  "Вабкент",
  "Каракуль",
  "Самарканд",
  "Навои",
];

const REPLY_SPEED = [
  "Моментально",
  "В течение 1 часа",
  "Только в рабочее время",
];
const EMPLOYMENTS: string[] = ["Индивидуально", "Компания", "Зарубеж"];

const PROF_GROUPS: Array<{ name: string; items: string[] }> = [
  {
    name: "Популярные",
    items: ["Электрик", "Сантехник", "Строитель", "Дизайнер"],
  },
  { name: "Отделка", items: ["Маляр", "Плотник", "Отделочник"] },
  { name: "Производство / монтаж", items: ["Сварщик", "Инженер-прораб"] },
];

const HOT_PROF = ["Электрик", "Сантехник", "Строитель"];

// ====== helpers ======
const toggleIn = (arr: string[], v: string) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

// ====== Компонент ======
export default function ProProfileSection({
  role = "WORKER" as Role,
}: {
  role?: Role;
}) {
  // Общие состояния, используемые в WORKER/CLIENT
  const [prof, setProf] = useState<string[]>(["Электрик"]);
  const [areas, setAreas] = useState<string[]>(["Бухара"]);

  // worker-only

  const [professions, setProfessions] = useState<Profession[]>([]);
  const [professionId, setProfessionId] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [hasTeam, setHasTeam] = useState<boolean>(false);
  const [teamMemberCount, setTeamMemberCount] = useState<string>("1");
  const [readyForHugeProject, setReadyForHugeProject] =
    useState<boolean>(false);
  const [workerProfRaw, setWorkerProfRaw] =
    useState<WorkerProfessionRow | null>(null);
  const [loadingWorkerProf, setLoadingWorkerProf] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState<boolean>(false);

  // legal-only
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [vacancies, setVacancies] = useState<
    Array<{ title: string; city?: string; salary?: string }>
  >([]);

  // client-only
  const [clientPref, setClientPref] = useState<
    "Индивидуально" | "Компания" | "Зарубеж"
  >("Индивидуально");
  const [clientNotes, setClientNotes] = useState("");
  const [clientBudgetMin, setClientBudgetMin] = useState("");
  const [clientBudgetMax, setClientBudgetMax] = useState("");

  // Проф-пикер (используется в WORKER/CLIENT для выбора профессий)
  const [profQuery, setProfQuery] = useState("");
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [hotProfs, setHotProfs] = useState<string[]>([]);

  const [profLoading, setProfLoading] = useState<boolean>(true);

  const lang = (localStorage.getItem("i18nextLng") || "ru").split("-")[0];
  const profOptions: SelectOption[] = useMemo(
    () =>
      professions.map((p) => ({
        value: p.id,
        label: lang === "uz" ? p.nameUz : p.nameRu,
      })),
    [professions, lang]
  );

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setProfLoading(true);
        setLoadingWorkerProf(true);

        const [opts, current] = await Promise.all([
          getProfessions(ac.signal),
          getWorkerProfession(ac.signal).catch(() => null),
        ]);
        setProfessions(opts);

        if (current) {
          // current — это первая строка из массива /worker/profession
          setWorkerProfRaw(current as unknown as WorkerProfessionRow);

          setProfessionId(current.professionId || "");
          setMinPrice(String(current.minPrice ?? ""));
          setMaxPrice(String(current.maxPrice ?? ""));
          setHasTeam(Boolean(current.hasTeam));
          setTeamMemberCount(String(current.teamMemberCount ?? "1"));
          setReadyForHugeProject(Boolean(current.readyForHugeProject));
        } else if (!professionId && opts.length) {
          setProfessionId(opts[0].id);
        }
      } finally {
        setProfLoading(false);
        setLoadingWorkerProf(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const currentProfessionLabel = useMemo(() => {
    if (!workerProfRaw) return "";
    const p = professions.find((x) => x.id === workerProfRaw.professionId);
    return p
      ? lang === "uz"
        ? p.nameUz
        : p.nameRu
      : workerProfRaw.professionId;
  }, [workerProfRaw, professions, lang]);

  // File Upload
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const [opts, current] = await Promise.all([
          getProfessions(ac.signal),
          getWorkerProfession(ac.signal).catch(() => null),
        ]);
        setProfessions(opts);

        if (current) {
          setProfessionId(current.professionId || "");
          setMinPrice(String(current.minPrice ?? ""));
          setMaxPrice(String(current.maxPrice ?? ""));
          setHasTeam(Boolean(current.hasTeam));
          setTeamMemberCount(String(current.teamMemberCount ?? "1"));
          setReadyForHugeProject(Boolean(current.readyForHugeProject));
        } else if (!professionId && opts.length) {
          // можно автоприджектить первую профессию
          setProfessionId(opts[0].id);
        }
      } catch (e) {
        console.warn("Не удалось подтянуть профессии/состояние", e);
      }
    })();
    return () => ac.abort();
  }, []);

  // подгружаем документы
  useEffect(() => {
    const ac = new AbortController();
    getWorkerDocuments(ac.signal)
      .then(setDocs)
      .catch((e) =>
        setUploadErr(e?.message || "Не удалось получить документы")
      );
    return () => ac.abort();
  }, []);

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

  const onSave = async () => {
    setSaving(true);
    setSaveErr(null);
    setSavedOk(false);

    try {
      if (!professionId) throw new Error("Выберите профессию");

      const payload = {
        professionId,
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 0,
        hasTeam,
        teamMemberCount: Number(teamMemberCount) || 0,
        readyForHugeProject,
      };

      await saveWorkerProfession(payload);
      const cur = await getWorkerProfession().catch(() => null);
      setWorkerProfRaw((cur as any) || null);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2500);
    } catch (e: any) {
      setSaveErr(e?.message || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  // ====== WORKER UI ======
  if (role === "WORKER") {
    return (
      <section>
        <SectionTitle>Профессиональный профиль</SectionTitle>
        <Card style={{ marginBottom: 12 }}>
          <CardBody>
            <Row>
              <Field>
                <Label>Текущая профессия</Label>

                {loadingWorkerProf ? (
                  <Small>Загрузка…</Small>
                ) : !workerProfRaw ? (
                  <Notice tone="muted">Пока не настроено.</Notice>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 10,
                    }}
                  >
                    <div>
                      <Small style={{ opacity: 0.7 }}>Профессия</Small>
                      <div style={{ fontWeight: 700, marginTop: 4 }}>
                        {currentProfessionLabel}
                      </div>
                    </div>
                    <div>
                      <Small style={{ opacity: 0.7 }}>Рейтинг</Small>
                      <div style={{ fontWeight: 700, marginTop: 4 }}>
                        {workerProfRaw.rating ?? 0}
                      </div>
                    </div>
                    <div>
                      <Small style={{ opacity: 0.7 }}>Цена (мин)</Small>
                      <div style={{ fontWeight: 700, marginTop: 4 }}>
                        {workerProfRaw.minPrice?.toLocaleString?.() ??
                          workerProfRaw.minPrice}
                      </div>
                    </div>
                    <div>
                      <Small style={{ opacity: 0.7 }}>Цена (макс)</Small>
                      <div style={{ fontWeight: 700, marginTop: 4 }}>
                        {workerProfRaw.maxPrice?.toLocaleString?.() ??
                          workerProfRaw.maxPrice}
                      </div>
                    </div>
                    <div>
                      <Small style={{ opacity: 0.7 }}>Команда</Small>
                      <div style={{ fontWeight: 700, marginTop: 4 }}>
                        {workerProfRaw.hasTeam
                          ? `Да, ${workerProfRaw.teamMemberCount} чел.`
                          : "Нет"}
                      </div>
                    </div>
                    <div>
                      <Small style={{ opacity: 0.7 }}>Крупные проекты</Small>
                      <div style={{ fontWeight: 700, marginTop: 4 }}>
                        {workerProfRaw.readyForHugeProject
                          ? "Готов"
                          : "Не готов"}
                      </div>
                    </div>
                    <div>
                      <Small style={{ opacity: 0.7 }}>Обновлено</Small>
                      <div style={{ marginTop: 4 }}>
                        {new Date(workerProfRaw.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </Field>
              <Field style={{ alignSelf: "end" }}>
                <GhostBtn
                  type="button"
                  onClick={() => {
                    // ручное обновление
                    (async () => {
                      try {
                        setLoadingWorkerProf(true);
                        const cur = await getWorkerProfession();
                        setWorkerProfRaw((cur as any) || null);
                      } finally {
                        setLoadingWorkerProf(false);
                      }
                    })();
                  }}
                >
                  Обновить
                </GhostBtn>
              </Field>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Row>
              <Field>
                <Label>Профессия</Label>
                <CustomSelect
                  id="worker-profession"
                  options={profOptions}
                  value={professionId || null}
                  onChange={(val) => setProfessionId(String(val || ""))}
                  placeholder="Выберите профессию"
                  disabled={profLoading || profOptions.length === 0}
                  loading={profLoading}
                  width="100%"
                  menuMaxHeight={300}
                />

                <Small>Выберите одно направление</Small>
              </Field>
            </Row>

            <Row>
              <Field>
                <Label>Минимальная цена</Label>
                <Input
                  placeholder="от, сум"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </Field>
              <Field>
                <Label>Максимальная цена</Label>
                <Input
                  placeholder="до, сум"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </Field>
            </Row>

            <Row>
              <Field>
                <Label>Готовность к крупным стройкам</Label>
                <SwitchWrap>
                  <SwitchBtn
                    active={readyForHugeProject}
                    onClick={() => setReadyForHugeProject(true)}
                  >
                    Да
                  </SwitchBtn>
                  <SwitchBtn
                    active={!readyForHugeProject}
                    onClick={() => setReadyForHugeProject(false)}
                  >
                    Нет
                  </SwitchBtn>
                </SwitchWrap>
              </Field>

              <Field>
                <Label>Наличие собственной команды</Label>
                <Inline>
                  <SwitchWrap>
                    <SwitchBtn
                      active={hasTeam}
                      onClick={() => setHasTeam(true)}
                    >
                      Да
                    </SwitchBtn>
                    <SwitchBtn
                      active={!hasTeam}
                      onClick={() => setHasTeam(false)}
                    >
                      Нет
                    </SwitchBtn>
                  </SwitchWrap>
                  <Input
                    placeholder="Количество человек"
                    inputMode="numeric"
                    disabled={!hasTeam}
                    value={teamMemberCount}
                    onChange={(e) => setTeamMemberCount(e.target.value)}
                    style={{ width: 200 }}
                  />
                </Inline>
              </Field>
            </Row>

            {saveErr && <Notice>{saveErr}</Notice>}
            {savedOk && <Notice>Сохранено</Notice>}

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <PrimaryBtn
                type="button"
                onClick={onSave}
                disabled={saving || !professionId}
              >
                {saving ? "Сохранение…" : "Сохранить"}
              </PrimaryBtn>
              <GhostBtn type="button" onClick={() => window.location.reload()}>
                Отмена
              </GhostBtn>
            </div>

            <Divider />

            <Row>
              <Field>
                <Label>Дипломы / сертификаты</Label>
                <Upload role="button" tabIndex={0}>
                  <div>
                    Перетащите PDF/JPG сюда или нажмите для выбора
                    <br />
                    <Small>Файл отправится на сервер</Small>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Upload>

                {uploadPct !== null && (
                  <div style={{ marginTop: 8 }}>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 999,
                        background: "rgba(255,255,255,.12)",
                      }}
                    >
                      <div
                        style={{
                          width: `${uploadPct}%`,
                          height: "100%",
                          background: "#1FBB4D",
                          transition: "width .2s",
                        }}
                      />
                    </div>
                    <Inline
                      style={{ marginTop: 6, alignItems: "center", gap: 8 }}
                    >
                      <Small>Загрузка: {uploadPct}%</Small>
                      <GhostBtn type="button" onClick={cancelUpload}>
                        Отмена
                      </GhostBtn>
                    </Inline>
                  </div>
                )}

                {/* {uploadErr && <Notice>{uploadErr}</Notice>} */}

                {docs.length > 0 && (
                  <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                    {docs.map((d) => (
                      <Card key={d.id} style={{ padding: 10 }}>
                        <Inline
                          style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <strong>{d.type || "Документ"}</strong>
                            {d.createdAt && (
                              <Small style={{ marginLeft: 8 }}>
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
                              Скачать
                            </PrimaryBtn>
                          ) : (
                            <Small>Ссылка появится после модерации</Small>
                          )}
                        </Inline>
                      </Card>
                    ))}
                  </div>
                )}
              </Field>
            </Row>
          </CardBody>
        </Card>
      </section>
    );
  }

  // ====== LEGAL UI ======
  if (role === "LEGAL") {
    return (
      <section>
        <SectionTitle>Профиль компании</SectionTitle>
        <Card>
          <CardBody>
            <Row>
              <Field>
                <Label>Название компании</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Field>
              <Field>
                <Label>Контактное лицо</Label>
                <Input
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </Field>
            </Row>

            <Row>
              <Field>
                <Label>Телефон</Label>
                <Input
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  inputMode="tel"
                />
              </Field>
              <Field>
                <Label>Email</Label>
                <Input
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  type="email"
                />
              </Field>
              <Field>
                <Label>Адрес</Label>
                <Input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </Field>
            </Row>

            <Divider />

            <Row>
              <Field>
                <Label>Официальный документ (PDF)</Label>
                <Upload>
                  <div>Перетащите PDF сюда или нажмите для выбора</div>
                  <Small>(демо — без загрузки)</Small>
                  <input type="file" accept="application/pdf" hidden />
                </Upload>
              </Field>
            </Row>

            <Divider />

            <SectionTitle>Вакансии</SectionTitle>
            <Row>
              <Field>
                <AddGhost
                  onClick={() =>
                    setVacancies((v) => [
                      ...v,
                      {
                        title: `Новая вакансия #${v.length + 1}`,
                        city: "",
                        salary: "",
                      },
                    ])
                  }
                >
                  Добавить вакансию
                </AddGhost>
                <Small>Позже подключим CRUD и таблицу</Small>
              </Field>
            </Row>

            {vacancies.length === 0 ? (
              <Notice tone="muted">Пока нет вакансий</Notice>
            ) : (
              vacancies.map((v, idx) => (
                <Row key={idx}>
                  <Field>
                    <Label>Должность</Label>
                    <Input
                      value={v.title}
                      onChange={(e) =>
                        setVacancies((all) =>
                          all.map((x, i) =>
                            i === idx ? { ...x, title: e.target.value } : x
                          )
                        )
                      }
                    />
                  </Field>
                  <Field>
                    <Label>Город/страна</Label>
                    <Input
                      value={v.city || ""}
                      onChange={(e) =>
                        setVacancies((all) =>
                          all.map((x, i) =>
                            i === idx ? { ...x, city: e.target.value } : x
                          )
                        )
                      }
                    />
                  </Field>
                  <Field>
                    <Label>Зарплата</Label>
                    <Input
                      value={v.salary || ""}
                      onChange={(e) =>
                        setVacancies((all) =>
                          all.map((x, i) =>
                            i === idx ? { ...x, salary: e.target.value } : x
                          )
                        )
                      }
                    />
                  </Field>
                </Row>
              ))
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <PrimaryBtn type="button" disabled>
                Сохранить
              </PrimaryBtn>
              <GhostBtn type="button" disabled>
                Отмена
              </GhostBtn>
            </div>
          </CardBody>
        </Card>
      </section>
    );
  }

  // ====== CLIENT UI ======
  return (
    <section>
      <SectionTitle>Пожелания заказчика</SectionTitle>
      <Card>
        <CardBody>
          <Row>
            <Field>
              <Label>Предпочтительный формат работ</Label>
              <Chips>
                {(["Индивидуально", "Компания", "Зарубеж"] as const).map(
                  (f) => (
                    <Chip
                      key={f}
                      active={clientPref === f}
                      onClick={() => setClientPref(f)}
                    >
                      {f}
                    </Chip>
                  )
                )}
              </Chips>
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Искомые профессии</Label>
              <ProfPickerWrap ref={pickerRef}>
                <TagList>
                  {prof.map((p) => (
                    <Tag key={p}>
                      <span>{p}</span>
                      <button
                        type="button"
                        aria-label="remove"
                        onClick={() => setProf((s) => s.filter((x) => x !== p))}
                      >
                        ×
                      </button>
                    </Tag>
                  ))}
                  <InputBase
                    placeholder={
                      prof.length ? "Добавить ещё…" : "Например: Электрик"
                    }
                    value={profQuery}
                    onChange={(e) => setProfQuery(e.target.value)}
                    onFocus={() => setOpen(true)}
                    onClick={() => setOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !profQuery && prof.length) {
                        setProf((s) => s.slice(0, -1));
                      }
                    }}
                  />
                </TagList>

                {open && (
                  <Dropdown onMouseDown={(e) => e.preventDefault()}>
                    {professions.length === 0 ? (
                      <Empty>
                        Не нашли?{" "}
                        <AddGhost
                          type="button"
                          onClick={() => {
                            const val = profQuery.trim();
                            if (!val) return;
                            setProf((s) => (s.includes(val) ? s : [...s, val]));
                            setProfQuery("");
                            setOpen(false);
                          }}
                        >
                          Добавить «{profQuery.trim()}»
                        </AddGhost>
                      </Empty>
                    ) : (
                      PROF_GROUPS.map((g) => {
                        const items = g.items.filter((x) =>
                          x
                            .toLowerCase()
                            .includes(profQuery.trim().toLowerCase())
                        );
                        if (!items.length) return null;
                        return (
                          <div key={g.name}>
                            <GroupLabel>{g.name}</GroupLabel>
                            {items.map((opt) => {
                              const active = prof.includes(opt);
                              return (
                                <OptionRow
                                  key={opt}
                                  aria-checked={active}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setProf((s) =>
                                      active
                                        ? s.filter((x) => x !== opt)
                                        : [...s, opt]
                                    );
                                    setProfQuery("");
                                    setOpen(false);
                                  }}
                                >
                                  <OptionCheck data-active={active} />
                                  <span>{opt}</span>
                                </OptionRow>
                              );
                            })}
                          </div>
                        );
                      })
                    )}
                  </Dropdown>
                )}
              </ProfPickerWrap>
              <Hint>Можно указать несколько направлений.</Hint>
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Районы поиска</Label>
              <Chips>
                {AREAS.map((a) => (
                  <Chip
                    key={a}
                    active={areas.includes(a)}
                    onClick={() => setAreas((s) => toggleIn(s, a))}
                  >
                    {a}
                  </Chip>
                ))}
              </Chips>
            </Field>
            <Field>
              <Label>Бюджет</Label>
              <PriceRow>
                <Input
                  placeholder="от, сум"
                  inputMode="numeric"
                  value={clientBudgetMin}
                  onChange={(e) => setClientBudgetMin(e.target.value)}
                />
                <Input
                  placeholder="до, сум"
                  inputMode="numeric"
                  value={clientBudgetMax}
                  onChange={(e) => setClientBudgetMax(e.target.value)}
                />
              </PriceRow>
              <Hint>Можно оставить пустым.</Hint>
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Пожелания/заметки</Label>
              <Textarea
                placeholder="Опишите задачу, сроки, предпочтения…"
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
              />
            </Field>
          </Row>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <PrimaryBtn type="button" disabled>
              Сохранить
            </PrimaryBtn>
            <GhostBtn type="button" disabled>
              Отмена
            </GhostBtn>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
