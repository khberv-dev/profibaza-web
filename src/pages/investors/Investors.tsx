import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiClock, FiLock } from "react-icons/fi";

import { useAuthStore } from "../../shared/stores/auth";


import * as S from "./style";
import {   getInvestors,
    InvestorRow,
    InvestorContactRow,
    InvestorProjectRow, } from "../../shared/endpoints/optInvestor";

/* ================= helpers ================= */

const pickProject = (projects?: InvestorProjectRow[] | null) => {
  const list = Array.isArray(projects) ? projects : [];
  // берём последний как "актуальный"
  return list.length ? list[list.length - 1] : null;
};

const mapStatusLabel = (s?: string | null) => {
  // бек сейчас отдаёт PLANNED, позже может быть CONSTRUCTION/LAUNCH/OPERATING
  switch ((s ?? "").toUpperCase()) {
    case "CONSTRUCTION":
      return "В строительстве";
    case "LAUNCH":
      return "На этапе запуска";
    case "OPERATING":
      return "В эксплуатации";
    case "PLANNED":
      return "Планируется";
    default:
      return s ? s : "—";
  }
};

const mapStatusTone = (s?: string | null): S.StatusTone => {
  switch ((s ?? "").toUpperCase()) {
    case "CONSTRUCTION":
      return "amber";
    case "LAUNCH":
      return "blue";
    case "OPERATING":
      return "green";
    case "PLANNED":
      return "slate";
    default:
      return "slate";
  }
};

const regionText = (i: InvestorRow) =>
  [i.address1, i.address2, i.address3].filter(Boolean).join(", ") || "—";

const normalizeContact = (c: InvestorContactRow) => {
  // API сейчас: { person, contact, type }, твой старый тип был value/label — приводим к единому виду
  const raw = (c?.contact ?? "").trim();
  const type = (c?.type ?? "").toUpperCase();
  const label =
    type === "PHONE" ? "Телефон" : type === "EMAIL" ? "Email" : type || "Контакт";
  return { label, value: raw };
};

const contactToHref = (typeLabel: string, value: string) => {
  const v = value.trim();
  if (!v) return "#";
  const l = typeLabel.toLowerCase();
  if (l.includes("тел")) return `tel:${v.replace(/\s+/g, "")}`;
  if (l.includes("email")) return `mailto:${v}`;
  // telegram как ссылка, если юзернейм
  if (v.startsWith("@")) return `https://t.me/${v.slice(1)}`;
  return "#";
};

const unique = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

const timeBucketLabel = (v: TimeBucket) => {
  switch (v) {
    case "MONTH":
      return "Ближайший месяц";
    case "QTR":
      return "В течение 3 месяцев";
    case "YEAR":
      return "В течение года";
    default:
      return "Любые сроки";
  }
};

/* ================= фильтры ================= */

type TimeBucket = "ANY" | "MONTH" | "QTR" | "YEAR";

type Filters = {
  q: string;
  activity: string; // сфера
  status: string; // стадия
  region: string; // address1
  specialistType: string; // пока в API нет — готовим
  time: TimeBucket; // пока в API нет — готовим
};

const DEFAULT_FILTERS: Filters = {
  q: "",
  activity: "ANY",
  status: "ANY",
  region: "ANY",
  specialistType: "ANY",
  time: "ANY",
};

/* ================= page ================= */

export default function InvestorsPage() {
  const navigate = useNavigate();
  const isAuthed = useAuthStore((s) => s.isAuthed);

  const [f, setF] = useState<Filters>(DEFAULT_FILTERS);

  const { data, isLoading, isError } = useQuery<InvestorRow[], Error>({
    queryKey: ["opt", "investors"],
    queryFn: ({ signal }) => getInvestors(signal),
  });

  const rows = data ?? [];

  const activityOptions = useMemo(() => {
    const list = unique(rows.map((r) => r.activityType ?? "").filter(Boolean));
    return ["ANY", ...list];
  }, [rows]);

  const statusOptions = useMemo(() => {
    const list = unique(
      rows
        .map((r) => pickProject(r.projects)?.status ?? "")
        .filter(Boolean)
        .map((x) => x.toUpperCase())
    );
    return ["ANY", ...list];
  }, [rows]);

  const regionOptions = useMemo(() => {
    // берём address1 как "регион" (область); можно расширить позже
    const list = unique(rows.map((r) => r.address1 ?? "").filter(Boolean));
    return ["ANY", ...list];
  }, [rows]);

  const specialistTypeOptions = useMemo(() => {
    // пока нет в API — оставляем только ANY
    return ["ANY"];
  }, []);

  const filtered = useMemo(() => {
    const q = f.q.trim().toLowerCase();

    return rows.filter((it) => {
      const proj = pickProject(it.projects);

      const byQ =
        !q ||
        [
          it.name ?? "",
          it.activityType ?? "",
          regionText(it),
          proj?.description ?? "",
          (proj?.partners ?? []).join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const byAct = f.activity === "ANY" || (it.activityType ?? "") === f.activity;

      const byStatus =
        f.status === "ANY" ||
        (proj?.status ?? "").toUpperCase() === (f.status ?? "").toUpperCase();

      const byRegion = f.region === "ANY" || (it.address1 ?? "") === f.region;

      // заглушки под будущие поля
      const bySpec = f.specialistType === "ANY" ? true : false;
      const byTime = f.time === "ANY" ? true : false;

      return byQ && byAct && byStatus && byRegion && bySpec && byTime;
    });
  }, [rows, f]);

  const onReset = () => setF(DEFAULT_FILTERS);

  return (
    <S.Page>
      <S.Top>
        <S.TopInner>
          <S.TitleRow>
            <S.Title>Инвесторы</S.Title>
            <S.Subtitle>
              Проекты, которые ищут специалистов на этапе строительства и запуска.
            </S.Subtitle>
          </S.TitleRow>

          {/* <S.FiltersCard>
            <S.FilterGrid>
              <S.SearchWrap>
                <S.SearchIcon>
                  <FiSearch />
                </S.SearchIcon>
                <S.SearchInput
                  value={f.q}
                  onChange={(e) => setF((p) => ({ ...p, q: e.target.value }))}
                  placeholder="Поиск по компании, сфере, описанию…"
                />
              </S.SearchWrap>

              <S.Select
                value={f.activity}
                onChange={(e) => setF((p) => ({ ...p, activity: e.target.value }))}
              >
                <option value="ANY">Сфера деятельности: любые</option>
                {activityOptions
                  .filter((x) => x !== "ANY")
                  .map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
              </S.Select>

              <S.Select
                value={f.status}
                onChange={(e) => setF((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="ANY">Стадия проекта: любая</option>
                {statusOptions
                  .filter((x) => x !== "ANY")
                  .map((x) => (
                    <option key={x} value={x}>
                      {mapStatusLabel(x)}
                    </option>
                  ))}
              </S.Select>

              <S.Select
                value={f.region}
                onChange={(e) => setF((p) => ({ ...p, region: e.target.value }))}
              >
                <option value="ANY">Регион: любой</option>
                {regionOptions
                  .filter((x) => x !== "ANY")
                  .map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
              </S.Select>

              <S.Select
                value={f.specialistType}
                onChange={(e) =>
                  setF((p) => ({ ...p, specialistType: e.target.value }))
                }
                disabled={specialistTypeOptions.length <= 1}
                title={
                  specialistTypeOptions.length <= 1
                    ? "Поле появится после добавления типов специалистов в API"
                    : ""
                }
              >
                <option value="ANY">Тип специалистов: любые</option>
              </S.Select>

              <S.Select
                value={f.time}
                onChange={(e) => setF((p) => ({ ...p, time: e.target.value as TimeBucket }))}
                disabled
                title="Поле появится после добавления сроков в API"
              >
                {(["ANY", "MONTH", "QTR", "YEAR"] as TimeBucket[]).map((x) => (
                  <option key={x} value={x}>
                    {timeBucketLabel(x)}
                  </option>
                ))}
              </S.Select>

              <S.FilterActions>
                <S.ResetBtn type="button" onClick={onReset}>
                  Сбросить
                </S.ResetBtn>
                <S.CountBadge>{filtered.length}</S.CountBadge>
              </S.FilterActions>
            </S.FilterGrid>
          </S.FiltersCard> */}
        </S.TopInner>
      </S.Top>

      <S.Content>
        {isLoading ? (
          <S.SkeletonGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <S.SkeletonCard key={i} />
            ))}
          </S.SkeletonGrid>
        ) : isError ? (
          <S.Empty>
            <h3>Не удалось загрузить инвесторов</h3>
            <p>Попробуйте обновить страницу или зайти позже.</p>
          </S.Empty>
        ) : filtered.length === 0 ? (
          <S.Empty>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить фильтры или запрос.</p>
          </S.Empty>
        ) : (
          <S.Grid>
            {filtered.map((inv) => {
              const proj = pickProject(inv.projects);
              const status = proj?.status ?? null;

              const contacts = Array.isArray(inv.contacts) ? inv.contacts : [];
              const normalized = contacts.map(normalizeContact).filter((x) => x.value);

              const viewHref = `/investors/${inv.id}`; // сделаем detail позже, но кнопка уже готова
              const applyHref = `/app/investors/apply?investorId=${inv.id}`; // можешь заменить на свой роут

              return (
                <S.Card key={inv.id}>
                  <S.CardHead>
                    <S.LogoCircle>
                      {/* если появится logoUrl — поставим img */}
                      <span>{(inv.name ?? "INV").slice(0, 2).toUpperCase()}</span>
                    </S.LogoCircle>

                    <div style={{ minWidth: 0 }}>
                      <S.CompanyTitle title={inv.name ?? undefined}>
                        {inv.name ?? "Компания (не указано)"}
                      </S.CompanyTitle>

                      <S.MetaLine>
                        <S.MetaItem>
                          <S.Dot />
                          <span>{inv.activityType ?? "—"}</span>
                        </S.MetaItem>

                        <S.StatusPill tone={mapStatusTone(status)}>
                          {mapStatusLabel(status)}
                        </S.StatusPill>
                      </S.MetaLine>
                    </div>
                  </S.CardHead>

                  <S.InfoRow>
                    <S.InfoItem>
                      <FiMapPin />
                      <span>{regionText(inv)}</span>
                    </S.InfoItem>
                    <S.InfoItem>
                      <FiClock />
                      <span>Срок потребности: —</span>
                    </S.InfoItem>
                  </S.InfoRow>

                  <S.Block>
                    <S.BlockTitle>Краткое описание проекта</S.BlockTitle>
                    <S.Desc>
                      {proj?.description
                        ? String(proj.description).slice(0, 500)
                        : "—"}
                    </S.Desc>
                  </S.Block>

                  <S.Block>
                    <S.BlockTitle>Требуемые специалисты</S.BlockTitle>
                    <S.Badges>
                      {/* пока API не даёт — заглушка */}
                      <S.Badge>—</S.Badge>
                    </S.Badges>
                  </S.Block>

                  <S.Block>
                    <S.BlockTitle>Контакты</S.BlockTitle>

                    {isAuthed ? (
                      normalized.length ? (
                        <S.Contacts>
                          {normalized.slice(0, 3).map((c, idx) => (
                            <S.ContactRow key={idx}>
                              <S.ContactLabel>{c.label}</S.ContactLabel>
                              <S.ContactValue
                                href={contactToHref(c.label, c.value)}
                                target={c.value.startsWith("@") ? "_blank" : undefined}
                                rel={c.value.startsWith("@") ? "noreferrer" : undefined}
                              >
                                {c.value}
                              </S.ContactValue>
                            </S.ContactRow>
                          ))}
                        </S.Contacts>
                      ) : (
                        <S.Muted>Контакты не указаны</S.Muted>
                      )
                    ) : (
                      <S.Gate>
                        <FiLock />
                        <span>Контакты доступны после входа</span>
                        <S.GateBtn
                          onClick={() => {
                            const url = new URL("/login", window.location.origin);
                            url.searchParams.set("redirect", "/investors");
                            window.location.href = url.toString();
                          }}
                        >
                          Войти
                        </S.GateBtn>
                      </S.Gate>
                    )}
                  </S.Block>

                  {/* <S.Actions>
                  <S.SecondaryLink to={viewHref}>Просмотреть проект</S.SecondaryLink>

{isAuthed ? (
  <S.PrimaryLink to={applyHref} title="Отправить заявку на сотрудничество">
    Отправить заявку
  </S.PrimaryLink>
) : (
  <S.PrimaryBtn
    type="button"
    onClick={() => {
      const url = new URL("/login", window.location.origin);
      url.searchParams.set("redirect", "/investors");
      window.location.href = url.toString();
    }}
    title="Доступно после входа"
  >
    Отправить заявку
  </S.PrimaryBtn>
)}
                  </S.Actions> */}
                </S.Card>
              );
            })}
          </S.Grid>
        )}
      </S.Content>
    </S.Page>
  );
}
