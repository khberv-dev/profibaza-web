import React, { useEffect, useId, useMemo, useRef, useState } from "react";
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
  Subtle,
  StatRow,
  StatPill,
  ActionRow,
  SoftPill,
  LinkRow,
  TextLink,
  MutedBar,
} from "./worker-profile.style";

import {
  downloadWorkerDocument,
  getProfessions,
  getWorkerDocuments,
  getWorkerProfession,
  saveWorkerProfession,
  uploadWorkerDocument,
  Profession,
  UploadedDoc,
  updateWorkerProfession,
  WorkerProfessionRow,
  getProfessionDemos,
  uploadProfessionDemo,
  getWorkerProfessions,
} from "../../../../shared/modules/worker";
type DemoMap = Record<
  string,
  import("../../../../shared/modules/worker").ProfessionDemo[]
>;

import CustomSelect, {
  SelectOption,
} from "../../../../components/custom-select/CustomSelect";
import axios from "axios";
import { Modal } from "../../../../components/modal/Modal";

type Mode = "list" | "create" | "edit";

export const WorkerProfile: React.FC = () => {
  // === справочники / текущие данные ===
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [profLoading, setProfLoading] = useState(true);
  const [workerProfs, setWorkerProfs] = useState<WorkerProfessionRow[]>([]);
  const [currentRowId, setCurrentRowId] = useState<string | null>(null);
  const [demosByRowId, setDemosByRowId] = useState<DemoMap>({});
  const [demoUploadPct, setDemoUploadPct] = useState<number | null>(null);
  const [demoUploadErr, setDemoUploadErr] = useState<string | null>(null);
  const demoFileInputRef = useRef<HTMLInputElement | null>(null);
  const demoAbortRef = useRef<AbortController | null>(null);

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

  // async state
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

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
      .map(row => ({
        row,
        profession: professions.find(p => p.id === row.professionId) || null,
      }))
      .filter(x => !!x.profession);
  }, [workerProfs, professions]);
  
  const hasAvailableForCreate = useMemo(
    () => professions.some(p => !createdIds.has(p.id)),
    [professions, createdIds]
  )

  // === загрузка справочников и текущей профессии ===
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setProfLoading(true);
        const [opts, rows] = await Promise.all([
          getProfessions(ac.signal),
          // НОВОЕ: получаем все записи
          getWorkerProfessions(ac.signal).catch(() => [] as WorkerProfessionRow[]),
        ]);
        setProfessions(opts);
        setWorkerProfs(rows);
  
        // отметим уже созданные профессии
        setCreatedIds(new Set(rows.map(r => r.professionId)));
  
        // подтянем демо по всем строкам (опционально — можно лениво по клику)
        for (const r of rows) {
          try {
            const items = await getProfessionDemos(r.id, ac.signal);
            setDemosByRowId(prev => ({ ...prev, [r.id]: items }));
          } catch { /* ignore */ }
        }
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
  };

  const openCreateFor = (prefillId?: string) => {
    resetForm();
    setMode("create");
    setCurrentRowId(null);
    if (prefillId) setProfessionId(prefillId);
    else {
      const firstAvail = professions.find(p => !createdIds.has(p.id));
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
  
    // демо для этой строки
    getProfessionDemos(row.id)
      .then(items => setDemosByRowId(prev => ({ ...prev, [row.id]: items })))
      .catch(() => {});
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
  
      const payload: UpsertPayload = {
        professionId,
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 0,
        hasTeam,
        teamMemberCount: Number(teamMemberCount) || 0,
        readyForHugeProject,
        competitions,
        inventory: inventory?.trim() || "",
      };
  
      if (mode === "edit" && currentRowId) {
        await updateWorkerProfession(currentRowId, payload);
      } else {
        await saveWorkerProfession(payload);
      }
  
      // перезагрузим список
      const rows = await getWorkerProfessions().catch(() => [] as WorkerProfessionRow[]);
      setWorkerProfs(rows);
      setCreatedIds(new Set(rows.map(r => r.professionId)));
  
      // актуализируем демо для изменённой строки (если есть)
      if (mode === "edit" && currentRowId) {
        try {
          const items = await getProfessionDemos(currentRowId);
          setDemosByRowId(prev => ({ ...prev, [currentRowId]: items }));
        } catch {}
      }
  
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 1500);
      setMode("list");
    } catch (e: any) {
      setSaveErr(e?.message || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

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
  const getFormFor = (id: string, row?: WorkerProfessionRow | null) => {
    const r = row && row.professionId === id ? row : null;
    return {
      updatedAt: (r as any)?.updatedAt,
      minPrice: r?.minPrice ?? null,
      maxPrice: r?.maxPrice ?? null,
      hasTeam: Boolean(r?.hasTeam),
      teamCount: r?.teamMemberCount ?? null,
      huge: Boolean(r?.readyForHugeProject),
      competitions: (r as any)?.competitions === "YES",
      inventory: (r as any)?.inventory || "",
    };
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
          const demo = await uploadProfessionDemo(
            currentRowId,
            f,
            (p) => setDemoUploadPct(p),
            demoAbortRef.current.signal
          );
          setDemosByRowId(prev => ({
            ...prev,
            [currentRowId]: [demo, ...(prev[currentRowId] || [])],
          }));
          setDemoUploadPct(null);
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
    openCreateFor();
  };

  return (
    <Page>
      <Header>
        <Title>Профиль специалиста</Title>
      </Header>

      <Layout>
        <Main>
          {/* ===== Мои профессии (только созданные) ===== */}
          <Card>
            <CardHeader>
              <CardTitle>Мои профессии</CardTitle>
              <GhostBtn
  type="button"
  onClick={handleCreateClick}
  title={
    hasAvailableForCreate
      ? "Добавить новую профессию"
      : "Все доступные профессии уже созданы"
  }
>
  + Создать новую
</GhostBtn>
            </CardHeader>
            <CardBody>
            {createdList.length > 0 ? (
      <div style={{ display: "grid", gap: 12 }}>
        {createdList.map(({ row, profession }) => {
          const label = profession ? profLabel(profession) : "Профессия";
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
              <JobTitle>{label}</JobTitle>
              <Subtle>Обновлено {fmtUpdated(f.updatedAt)}</Subtle>

              <div>
                <Label>Параметры</Label>
                <StatRow>
                  <StatPill>
                    <b>{fmtMoney(f.minPrice)}</b><span>минимальная цена</span>
                  </StatPill>
                  <StatPill>
                    <b>{fmtMoney(f.maxPrice)}</b><span>максимальная цена</span>
                  </StatPill>
                  <StatPill>
                    <b>{f.hasTeam ? f.teamCount || 0 : 0}</b>
                    <span>{f.hasTeam ? "в команде" : "команды нет"}</span>
                  </StatPill>
                </StatRow>
              </div>

              <ActionRow>
                <PrimaryBtn type="button" onClick={() => openEditFor(row)}>
                  Редактировать
                </PrimaryBtn>
                <SoftPill>Крупные проекты: {f.huge ? "Да" : "Нет"}</SoftPill>
                <SoftPill>Конкурсы: {f.competitions ? "Да" : "Нет"}</SoftPill>
              </ActionRow>

              <MutedBar>
                <b>Инструменты:</b> {f.inventory ? f.inventory : "не указаны"}
              </MutedBar>
            </JobItem>
          );
        })}
      </div>
    ) : (
      <Notice tone="neutral">Пока ни одной профессии не добавлено. Нажмите «Создать новую», чтобы добавить.</Notice>
    )}
            </CardBody>
          </Card>

          {/* Документы */}
          <Card>
            <CardHeader>
              <CardTitle>Дипломы и сертификаты</CardTitle>
            </CardHeader>
            <CardBody>
              <Upload>
                <div>
                  Перетащите PDF/JPG сюда или нажмите для выбора
                  <br />
                  <Small>Файл отправится на сервер</Small>
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
                    <Small>Загрузка: {uploadPct}%</Small>
                    <GhostBtn type="button" onClick={cancelUpload}>
                      Отмена
                    </GhostBtn>
                  </Inline>
                </div>
              )}

              {docs.length > 0 && (
                <DocList style={{ marginTop: 12 }}>
                  {docs.map((d) => (
                    <DocItem key={d.id}>
                      <div>
                        <strong>{d.type || "Документ"}</strong>{" "}
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
                          Скачать
                        </PrimaryBtn>
                      ) : (
                        <Small>Ссылка появится после модерации</Small>
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
              <CardTitle>Готовность профиля</CardTitle>
            </CardHeader>
            <CardBody>
              <Small>Заполните основные поля, добавьте документы</Small>
              <div style={{ marginTop: 10 }}>
                <Progress>
                  <i style={{ width: `${workerProfRaw ? 70 : 40}%` }} />
                </Progress>
              </div>
            </CardBody>
          </Card>
        </Aside>
      </Layout>

      {/* ===== МОДАЛ: форма создания/редактирования ===== */}
      <Modal
        open={modalOpen}
        title={modalTitle}
        onClose={closeForm}
        width={820}
        maxWidth="92vw"
        closeOnOverlay={true}
        ariaLabel="Форма профессии"
      >
        <FormGrid columns={2}>
          <Field>
            <Label>Профессия</Label>
            <SelectBox>
              <CustomSelect
                id="worker-profession"
                options={profOptions}
                value={professionId || null}
                onChange={(value) => setProfessionId(String(value ?? ""))}
                placeholder="Выберите профессию"
                disabled={mode === "edit" || profLoading || profOptions.length === 0}
                loading={profLoading}
                width="100%"
                menuMaxHeight={300}
              />
            </SelectBox>
            {mode === "create" && (
              <Help>Уже созданные профессии недоступны для выбора</Help>
            )}
          </Field>

          <div />

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

          <Field>
            <Label>Готовность к крупным проектам</Label>
            <ToggleGroup>
              <Toggle
                active={readyForHugeProject}
                onClick={() => setReadyForHugeProject(true)}
              >
                Да
              </Toggle>
              <Toggle
                active={!readyForHugeProject}
                onClick={() => setReadyForHugeProject(false)}
              >
                Нет
              </Toggle>
            </ToggleGroup>
          </Field>

          <Field>
            <Label>Наличие команды</Label>
            <Inline>
              <ToggleGroup>
                <Toggle active={hasTeam} onClick={() => setHasTeam(true)}>
                  Да
                </Toggle>
                <Toggle active={!hasTeam} onClick={() => setHasTeam(false)}>
                  Нет
                </Toggle>
              </ToggleGroup>
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

          <Field>
            <Label>Участие в конкурсах</Label>
            <ToggleGroup>
              <Toggle
                active={competitions === "YES"}
                onClick={() => setCompetitions("YES")}
              >
                Да
              </Toggle>
              <Toggle
                active={competitions === "NO"}
                onClick={() => setCompetitions("NO")}
              >
                Нет
              </Toggle>
            </ToggleGroup>
          </Field>

          <Field>
            <Label>Инструменты (инвентарь)</Label>
            <Input
              placeholder="Например: перфоратор, лазерный уровень, шуруповёрт…"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
            />
            <Help>Кратко перечислите ключевые инструменты</Help>
          </Field>
        </FormGrid>

        {/* <div style={{ marginTop: 16 }}>
          <Label>Портфолио (фото/видео, до 20 МБ)</Label>

        <Upload
   as="label"
   htmlFor={canUploadDemo ? demoInputId : undefined}
   style={{ marginTop: 8, cursor: canUploadDemo ? "pointer" : "not-allowed" }}
   aria-disabled={!canUploadDemo}
   title={
     canUploadDemo
       ? "Нажмите, чтобы выбрать файл"
       : "Сначала откройте «Редактировать» и сохраните профессию"
   }
>
  <div>
    Перетащите файл сюда или нажмите для выбора
    <br />
    <Small>Поддерживаются изображения и видео, макс. 20 МБ</Small>
    {!canUploadDemo && (
      <div style={{ marginTop: 6 }}>
        <Small>Сначала сохраните конкретную запись профессии</Small>
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
                <Small>Загрузка: {demoUploadPct}%</Small>
                <GhostBtn type="button" onClick={cancelDemoUpload}>
                  Отмена
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
  const list = rowId ? (demosByRowId[rowId] || []) : [];
  if (!rowId) {
    return <Small style={{ display: "block", marginTop: 8 }}>
      Сохраните профессию, чтобы добавить примеры работ
    </Small>;
  }
  if (list.length === 0) return null;
  return (
    <div style={{ marginTop: 12, display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
      {list.map(d => (
        <div key={d.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
          {d.type === "video" ? (
            <video src={d.url} controls playsInline style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
          ) : (
            <img src={d.url} alt="" loading="lazy" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
          )}
        </div>
      ))}
    </div>
  );
})()}
        </div> */}

        <Actions style={{ marginTop: 12 }}>
          <PrimaryBtn
            type="button"
            onClick={onSave}
            disabled={saving || !professionId}
          >
            {saving
              ? "Сохранение…"
              : mode === "create"
              ? "Создать"
              : "Сохранить"}
          </PrimaryBtn>
          <GhostBtn type="button" onClick={closeForm}>
            Отмена
          </GhostBtn>
        </Actions>

        {saveErr && (
          <Notice tone="error" style={{ marginTop: 12 }}>
            {saveErr}
          </Notice>
        )}
        {savedOk && (
          <Notice tone="success" style={{ marginTop: 12 }}>
            Сохранено
          </Notice>
        )}
      </Modal>

      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0b0b0f",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "14px",
          },
          // success: {
          //   iconTheme: {
          //     primary: "#fff",
          //     secondary: "#000",
          //   },
          // },
          // error: {
          //   iconTheme: {
          //     primary: "#fff",
          //     secondary: "#000",
          //   },
          // },
        }}
      />
    </Page>
  );
};
