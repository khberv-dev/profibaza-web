// src/features/profile/components/ClientProfile.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Field,
  Label,
  Textarea,
  Chips,
  Chip,
  PriceRow,
  Hint,
  PrimaryBtn,
  GhostBtn,
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
  Input,
} from "../../pro-profile-section.style";

const AREAS = [
  "Бухара",
  "Гиждуван",
  "Каган",
  "Вабкент",
  "Каракуль",
  "Самарканд",
  "Навои",
];
const PROF_GROUPS: Array<{ name: string; items: string[] }> = [
  {
    name: "Популярные",
    items: ["Электрик", "Сантехник", "Строитель", "Дизайнер"],
  },
  { name: "Отделка", items: ["Маляр", "Плотник", "Отделочник"] },
  { name: "Производство / монтаж", items: ["Сварщик", "Инженер-прораб"] },
];

export const ClientProfile: React.FC = () => {
  const [clientPref, setClientPref] = useState<
    "Индивидуально" | "Компания" | "Зарубеж"
  >("Индивидуально");
  const [clientNotes, setClientNotes] = useState("");
  const [clientBudgetMin, setClientBudgetMin] = useState("");
  const [clientBudgetMax, setClientBudgetMax] = useState("");
  const [areas, setAreas] = useState<string[]>(["Бухара"]);

  const [prof, setProf] = useState<string[]>(["Электрик"]);
  const [profQuery, setProfQuery] = useState("");
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const toggleIn = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div style={{ gridColumn: "1 / -1" }}>
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
                      if (e.key === "Backspace" && !profQuery && prof.length)
                        setProf((s) => s.slice(0, -1));
                    }}
                  />
                </TagList>

                {open && (
                  <Dropdown onMouseDown={(e) => e.preventDefault()}>
                    {PROF_GROUPS.every((g) =>
                      g.items.every(
                        (x) =>
                          !x
                            .toLowerCase()
                            .includes(profQuery.trim().toLowerCase())
                      )
                    ) ? (
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
    </div>
  );
};
