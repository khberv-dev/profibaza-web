// src/features/profile/pages/ProProfileSection.tsx
import React, { useState, useRef, useEffect } from "react";
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
  ChipsStack,
  Chip,
  RailChip,
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

const AREAS = ["Бухара", "Гиждуван", "Каган", "Вабкент", "Каракуль", "Самарканд", "Навои"];

const REPLY_SPEED = ["Моментально", "В течение 1 часа", "Только в рабочее время"];
const EMPLOYMENTS: string[] = ["Индивидуально", "Компания", "Зарубеж"];

const PROF_GROUPS: Array<{ name: string; items: string[] }> = [
  { name: "Популярные", items: ["Электрик", "Сантехник", "Строитель", "Дизайнер"] },
  { name: "Отделка", items: ["Маляр", "Плотник", "Отделочник"] },
  { name: "Производство / монтаж", items: ["Сварщик", "Инженер-прораб"] },
];

const HOT_PROF = ["Электрик", "Сантехник", "Строитель"];

// ====== helpers ======
const toggleIn = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

// ====== Компонент ======
export default function ProProfileSection({ role = "WORKER" as Role }: { role?: Role }) {
  // Общие состояния, используемые в WORKER/CLIENT
  const [prof, setProf] = useState<string[]>(["Электрик"]);
  const [areas, setAreas] = useState<string[]>(["Бухара"]);

  // worker-only
  const [readyBig, setReadyBig] = useState<boolean>(true);
  const [hasTeam, setHasTeam] = useState<boolean>(false);
  const [teamSize, setTeamSize] = useState<string>("");
  const [hasTools, setHasTools] = useState<boolean>(true);
  const [reply, setReply] = useState(REPLY_SPEED[0]);
  const [employment, setEmployment] = useState("Индивидуально");
  const [contest, setContest] = useState(false);

  // legal-only
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [vacancies, setVacancies] = useState<Array<{ title: string; city?: string; salary?: string }>>([]);

  // client-only
  const [clientPref, setClientPref] = useState<"Индивидуально" | "Компания" | "Зарубеж">("Индивидуально");
  const [clientNotes, setClientNotes] = useState("");
  const [clientBudgetMin, setClientBudgetMin] = useState("");
  const [clientBudgetMax, setClientBudgetMax] = useState("");

  // Проф-пикер (используется в WORKER/CLIENT для выбора профессий)
  const [profQuery, setProfQuery] = useState("");
  const [open, setOpen] = useState(false);
  const allProfs = PROF_GROUPS.flatMap((g) => g.items);
  const filtered = allProfs.filter((x) => x.toLowerCase().includes(profQuery.trim().toLowerCase()));
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = pickerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // ====== WORKER UI ======
  if (role === "WORKER") {
    return (
      <section>
        <SectionTitle>Профессиональный профиль</SectionTitle>

        <Card>
          <CardBody>
            {/* Rail layout: слева — профессии, справа — опыт */}
            <RailRow>
              <Field>
                <Label>Профессия</Label>

                {/* Быстрые кнопки */}
                <HotRow>
                  {HOT_PROF.map((p) => (
                    <HotChip
                      key={p}
                      active={prof.includes(p)}
                      onClick={() => setProf((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]))}
                    >
                      {p}
                    </HotChip>
                  ))}
                </HotRow>

                {/* Поиск + теги выбранных */}
                <ProfPickerWrap ref={pickerRef}>
                  <TagList>
                    {prof.map((p) => (
                      <Tag key={p}>
                        <span>{p}</span>
                        <button type="button" aria-label="remove" onClick={() => setProf((s) => s.filter((x) => x !== p))}>
                          ×
                        </button>
                      </Tag>
                    ))}
                    <InputBase
                      placeholder={prof.length ? "Добавить ещё…" : "Начните ввод, например: Электрик"}
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
                      {filtered.length === 0 ? (
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
                            x.toLowerCase().includes(profQuery.trim().toLowerCase())
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
                                      setProf((s) => (active ? s.filter((x) => x !== opt) : [...s, opt]));
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

                <Hint>Можно выбрать несколько направлений. Начните ввод, чтобы отфильтровать.</Hint>
              </Field>

              <Field>
                <Label>Опыт работы</Label>
                <Input placeholder="Напр.: 2019–2024, ООО СтройПлюс" />
                <Hint>Укажите годы и место: один пункт или через запятую пару мест</Hint>
              </Field>
            </RailRow>

            <Divider />

            <Row>
              <Field>
                <Label>Загрузка диплома / сертификата</Label>
                <Upload>
                  <div>Перетащите PDF/JPG сюда или нажмите для выбора</div>
                  <Small>(визуально, без загрузки; API появится позже)</Small>
                  <input type="file" accept="application/pdf,image/*" hidden />
                </Upload>
              </Field>

              <Field>
                <Label>Портфолио (фото / видео)</Label>
                <Upload>
                  <div>Добавьте 5–10 работ (JPG/PNG/MP4)</div>
                  <Small>Файлы не сохраняются — демо-интерфейс</Small>
                  <input type="file" accept="image/*,video/mp4" multiple hidden />
                </Upload>
              </Field>
            </Row>

            <Divider />

            <Row>
              <Field>
                <Label>Диапазон цен</Label>
                <PriceRow>
                  <Input placeholder="Минимум, сум" inputMode="numeric" />
                  <Input placeholder="Максимум, сум" inputMode="numeric" />
                  <Input placeholder="Ед. изм. (час, м², объект)" />
                </PriceRow>
                <Hint>Пример: 150 000 – 350 000 сум / час</Hint>
              </Field>

              <Field>
                <Label>Геолокация</Label>
                <Input placeholder="Фактический адрес (улица, дом)" />
                <div style={{ height: 8 }} />
                <Label style={{ margin: 0, fontWeight: 800 }}>Районы работы</Label>
                <Chips style={{ marginTop: 8 }}>
                  {AREAS.map((a) => (
                    <Chip key={a} active={areas.includes(a)} onClick={() => setAreas((s) => toggleIn(s, a))}>
                      {a}
                    </Chip>
                  ))}
                </Chips>
              </Field>
            </Row>

            <Divider />

            <Row>
              <Field>
                <Label>Готовность к крупным стройкам</Label>
                <SwitchWrap>
                  <SwitchBtn active={readyBig} onClick={() => setReadyBig(true)}>
                    Да
                  </SwitchBtn>
                  <SwitchBtn active={!readyBig} onClick={() => setReadyBig(false)}>
                    Нет
                  </SwitchBtn>
                </SwitchWrap>
              </Field>

              <Field>
                <Label>Наличие собственной команды</Label>
                <Inline>
                  <SwitchWrap>
                    <SwitchBtn active={hasTeam} onClick={() => setHasTeam(true)}>
                      Да
                    </SwitchBtn>
                    <SwitchBtn active={!hasTeam} onClick={() => setHasTeam(false)}>
                      Нет
                    </SwitchBtn>
                  </SwitchWrap>
                  <Input
                    placeholder="Количество человек"
                    inputMode="numeric"
                    disabled={!hasTeam}
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    style={{ width: 200 }}
                  />
                </Inline>
              </Field>
            </Row>

            <Row>
              <Field>
                <Label>Наличие техники / инструментов</Label>
                <SwitchWrap>
                  <SwitchBtn active={hasTools} onClick={() => setHasTools(true)}>
                    Да
                  </SwitchBtn>
                  <SwitchBtn active={!hasTools} onClick={() => setHasTools(false)}>
                    Нет
                  </SwitchBtn>
                </SwitchWrap>
                {hasTools && (
                  <>
                    <div style={{ height: 8 }} />
                    <Textarea placeholder="Опционально: перечислите ключевые инструменты/технику" />
                  </>
                )}
              </Field>

              <Field>
                <Label>Ответ на поступающие заказы</Label>
                <Chips>
                  {REPLY_SPEED.map((r) => (
                    <Chip key={r} active={reply === r} onClick={() => setReply(r)}>
                      {r}
                    </Chip>
                  ))}
                </Chips>
                <Hint>Эти настройки помогут заказчику понимать вашу доступность</Hint>
              </Field>
            </Row>

            <Divider />

            <Row>
              <Field>
                <Label>Просмотр оценок и отзывов</Label>
                <Inline>
                  <PillLink>Открыть рейтинг</PillLink>
                  <Small>Реализуем после подключения API</Small>
                </Inline>
              </Field>

              <Field>
                <Label>История заказов</Label>
                <Inline>
                  <PillLink>Показать за 12 месяцев</PillLink>
                  <Small>Демо-кнопка</Small>
                </Inline>
              </Field>
            </Row>

            <Divider />

            <Row>
              <Field>
                <Label>Участие в конкурсах</Label>
                <SwitchWrap>
                  <SwitchBtn active={contest} onClick={() => setContest(true)}>
                    Да
                  </SwitchBtn>
                  <SwitchBtn active={!contest} onClick={() => setContest(false)}>
                    Нет
                  </SwitchBtn>
                </SwitchWrap>
                {contest && (
                  <>
                    <div style={{ height: 8 }} />
                    <Input placeholder={'Укажите: например, "Лучший электрик региона 2024"'} />
                  </>
                )}
              </Field>

              <Field>
                <Label>Формат занятости</Label>
                <Chips>
                  {EMPLOYMENTS.map((f) => (
                    <Chip key={f} active={employment === f} onClick={() => setEmployment(f)}>
                      {f}
                    </Chip>
                  ))}
                </Chips>
              </Field>
            </Row>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <PrimaryBtn type="button" disabled>
                Сохранить изменения
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
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </Field>
              <Field>
                <Label>Контактное лицо</Label>
                <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
              </Field>
            </Row>

            <Row>
              <Field>
                <Label>Телефон</Label>
                <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} inputMode="tel" />
              </Field>
              <Field>
                <Label>Email</Label>
                <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} type="email" />
              </Field>
              <Field>
                <Label>Адрес</Label>
                <Input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
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
                    setVacancies((v) => [...v, { title: `Новая вакансия #${v.length + 1}`, city: "", salary: "" }])
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
                        setVacancies((all) => all.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)))
                      }
                    />
                  </Field>
                  <Field>
                    <Label>Город/страна</Label>
                    <Input
                      value={v.city || ""}
                      onChange={(e) =>
                        setVacancies((all) => all.map((x, i) => (i === idx ? { ...x, city: e.target.value } : x)))
                      }
                    />
                  </Field>
                  <Field>
                    <Label>Зарплата</Label>
                    <Input
                      value={v.salary || ""}
                      onChange={(e) =>
                        setVacancies((all) => all.map((x, i) => (i === idx ? { ...x, salary: e.target.value } : x)))
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
                {(["Индивидуально", "Компания", "Зарубеж"] as const).map((f) => (
                  <Chip key={f} active={clientPref === f} onClick={() => setClientPref(f)}>
                    {f}
                  </Chip>
                ))}
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
                      <button type="button" aria-label="remove" onClick={() => setProf((s) => s.filter((x) => x !== p))}>
                        ×
                      </button>
                    </Tag>
                  ))}
                  <InputBase
                    placeholder={prof.length ? "Добавить ещё…" : "Например: Электрик"}
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
                    {filtered.length === 0 ? (
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
                          x.toLowerCase().includes(profQuery.trim().toLowerCase())
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
                                    setProf((s) => (active ? s.filter((x) => x !== opt) : [...s, opt]));
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
                  <Chip key={a} active={areas.includes(a)} onClick={() => setAreas((s) => toggleIn(s, a))}>
                    {a}
                  </Chip>
                ))}
              </Chips>
            </Field>
            <Field>
              <Label>Бюджет</Label>
              <PriceRow>
                <Input placeholder="от, сум" inputMode="numeric" value={clientBudgetMin} onChange={(e) => setClientBudgetMin(e.target.value)} />
                <Input placeholder="до, сум" inputMode="numeric" value={clientBudgetMax} onChange={(e) => setClientBudgetMax(e.target.value)} />
              </PriceRow>
              <Hint>Можно оставить пустым.</Hint>
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Пожелания/заметки</Label>
              <Textarea placeholder="Опишите задачу, сроки, предпочтения…" value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} />
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
