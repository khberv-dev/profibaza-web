// src/features/worker-vacancies/WorkerVacanciesSearchPage.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { CustomInput } from "../../components/custom-input/CustomInput";
import CustomSelect from "../../components/custom-select/CustomSelect";
import { Modal } from "../../components/modal/Modal";

import {
  useSearchWorkerVacancies,
  createWorkerOffer,
} from "../../shared/modules/worker-vacancies";
import { useWorkerOffers } from "../../shared/modules/worker-offers";
import { getWorkerProfessions } from "../../shared/modules/worker";

import { CompanyBadge } from "../profile/profile-style";
import {
  PageWrap,
  List,
  HHCard,
  HHLeft,
  HHAvatar,
  HHMid,
  HHHead,
  HHName,
  HHChips,
  HHChip,
  HHBottom,
  HHPrice,
  HHRight,
  OpenBtn,
  ListSingle,
  FiltersCard,
  Grid2,
  MobileOffersBar,
  StickyAside,
} from "../../pages/worker-search/worker-search.style";
import { EditBtn } from "../profile/pro-profile-section.style";

/* helpers */
const fmtMoney = (n?: number | null) =>
  typeof n === "number" ? `${n.toLocaleString("ru-RU")} сум` : "З/п не указана";

type FormShape = { search: string; minSalary: string; maxSalary: string };

export default function WorkerVacanciesSearchPage() {
  const { control, getValues, setValue } = useForm<FormShape>({
    defaultValues: { search: "", minSalary: "0", maxSalary: "20000000" },
    mode: "onChange",
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpand = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const [offersExpanded, setOffersExpanded] = useState<Record<string, boolean>>(
    {}
  );
  const toggleOfferExpand = (id: string) =>
    setOffersExpanded((s) => ({ ...s, [id]: !s[id] }));

  const [applied, setApplied] = useState({
    search: "",
    minSalary: 0,
    maxSalary: 20_000_000,
  });

  const { i18n } = useTranslation();
  const lang = (i18n.language || "ru").split("-")[0] as "ru" | "uz";

  // вакансии по поиску
  const {
    data: vacancies = [],
    isFetching,
    refetch,
  } = useSearchWorkerVacancies(applied);

  // правый сайдбар — отклики
  const {
    data: offers = [],
    isFetching: offersLoading,
    refetch: refetchOffers,
  } = useWorkerOffers();

  // модалка «Откликнуться»
  const [offerModal, setOfferModal] = useState<{
    open: boolean;
    vacancyId: string | null;
  }>({
    open: false,
    vacancyId: null,
  });

  // селект с профессиями текущего воркера
  const [professions, setProfessions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedProf, setSelectedProf] = useState<string | null>(null);
  const [loadingOffer, setLoadingOffer] = useState(false);

  useEffect(() => {
    getWorkerProfessions()
      .then((list) => {
        const opts = list.map((p) => {
          const nameRu = (p as any)?.profession?.nameRu ?? "";
          const nameUz = (p as any)?.profession?.nameUz ?? "";
          const label =
            lang === "uz" ? nameUz || nameRu : nameRu || nameUz || "—";
          return { value: p.id, label };
        });
        setProfessions(opts);
      })
      .catch(() => {});
  }, [lang]);

  const handleSendOffer = async () => {
    if (!offerModal.vacancyId || !selectedProf) return;
    setLoadingOffer(true);
    try {
      await createWorkerOffer({
        workerProfessionId: selectedProf,
        vacancyId: offerModal.vacancyId,
      });
      toast.success("Отклик отправлен!");
      setOfferModal({ open: false, vacancyId: null });
      setSelectedProf(null);
      // перезагрузим отклики в сайдбаре
      refetchOffers();
    } catch {
      toast.error("Ошибка при отправке отклика");
    } finally {
      setLoadingOffer(false);
    }
  };

  const onSearch = () => {
    const s = (getValues().search || "").trim();
    const mn = Number((getValues().minSalary || "").replace(/\D/g, "")) || 0;
    const mx = Number((getValues().maxSalary || "").replace(/\D/g, "")) || 0;
    setApplied({ search: s, minSalary: mn, maxSalary: mx });
  };

  const resetAll = () => {
    setValue("search", "");
    setValue("minSalary", "0");
    setValue("maxSalary", "20000000");
    setApplied({ search: "", minSalary: 0, maxSalary: 20_000_000 });
  };

  const [offersModalOpen, setOffersModalOpen] = useState(false);

  return (
    <PageWrap>
      {/* панель фильтров */}
      <FiltersCard>
  <div>
    <CustomInput
      control={control}
      name="search"
      label="Поиск по названию"
      placeholder="backend, сантехник..."
    />
  </div>

  <div>
    <CustomInput
      control={control}
      name="minSalary"
      label="Мин. зарплата"
      placeholder="0"
      rules={{ validate: (v: any) => /^\d*$/.test(v ?? "") || "Только цифры" }}
    />
  </div>

  <div>
    <CustomInput
      control={control}
      name="maxSalary"
      label="Макс. зарплата"
      placeholder="20000000"
      rules={{ validate: (v: any) => /^\d*$/.test(v ?? "") || "Только цифры" }}
    />
  </div>

  <div className="actions" style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
    <button onClick={resetAll} style={{ height: 42, padding: "0 16px", borderRadius: 12, border: "1px solid #e7ecf3", background: "#fff", fontWeight: 800 }}>
      Сбросить
    </button>
    <button onClick={onSearch} style={{ height: 42, padding: "0 18px", borderRadius: 12, border: "1px solid #1e5cfb", background: "#1e5cfb", color: "#fff", fontWeight: 900 }}>
      Найти
    </button>
  </div>
</FiltersCard>


<Grid2>
  <div>
  <ListSingle>
            {vacancies.map((v) => (
              <HHCard key={v.id}>
                <HHLeft>
                  <HHAvatar>
                    <img src="/vacancy.png" height={80} width={80} alt="" />
                  </HHAvatar>
                </HHLeft>
                <HHMid>
                  <HHHead>
                    <HHName>{v.title}</HHName>
                    {v.legal?.name && (
                      <CompanyBadge title={v.legal.name}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="#0070ff"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          focusable="false"
                          className="magritte-icon___rRr4Q_12-3-5 magritte-icon_initial-accent___E3b-y_12-3-5"
                        >
                          <g>
                            <g>
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.29443 14.8729C6.76051 15.4025 7.28287 15.996 7.998 15.996V15.988C8.72144 15.988 9.24393 15.394 9.70211 14.8643C9.9754 14.5433 10.2728 14.2062 10.53 14.1019C10.7973 13.9875 11.217 14.0107 11.6374 14.0339C11.6594 14.0352 11.6815 14.0364 11.7036 14.0376L11.7306 14.0391C12.4376 14.0788 13.1647 14.1197 13.6488 13.6363C14.1254 13.1605 14.084 12.4261 14.0442 11.7196L14.0427 11.694C14.0416 11.6747 14.0406 11.6553 14.0395 11.6358C14.016 11.2201 13.9918 10.7905 14.107 10.5222C14.2196 10.2653 14.5491 9.97647 14.8707 9.69555L14.8885 9.67992C15.4144 9.21853 15.996 8.7083 15.996 7.99403C15.996 7.27169 15.4012 6.75 14.8707 6.29251C14.5491 6.01962 14.2115 5.72263 14.107 5.4658C13.9925 5.19902 14.0158 4.78025 14.039 4.36068C14.0403 4.33846 14.0415 4.31623 14.0427 4.29403C14.091 3.57971 14.1392 2.84127 13.6488 2.35168C13.1722 1.86785 12.4365 1.90919 11.7288 1.94896L11.7036 1.95038C11.6841 1.95146 11.6646 1.95256 11.645 1.95366C11.2287 1.97704 10.7987 2.00119 10.53 1.8862C10.2728 1.77384 9.98344 1.44471 9.70211 1.12367L9.68644 1.10586C9.22435 0.580731 8.71334 0 7.998 0C7.27456 0 6.75208 0.593949 6.29391 1.12367C6.02061 1.44471 5.7232 1.78187 5.46597 1.8862C5.19885 2.00052 4.77953 1.97731 4.35942 1.95407C4.33707 1.95283 4.31472 1.95159 4.29239 1.95038C4.2834 1.94987 4.27439 1.94937 4.26539 1.94886C3.55843 1.90912 2.83131 1.86825 2.34715 2.35168C1.87101 2.83503 1.91194 3.5609 1.95173 4.26668C1.95225 4.2758 1.95276 4.28491 1.95328 4.29403C1.95443 4.31508 1.95559 4.33618 1.95676 4.35729C1.98011 4.7787 2.0038 5.20632 1.88898 5.47383C1.77645 5.73067 1.44687 6.01963 1.12534 6.30054L1.10753 6.31617C0.581598 6.77756 0 7.28779 0 8.00207C0 8.72441 0.594821 9.2461 1.12534 9.70359C1.44687 9.97648 1.78448 10.2734 1.88898 10.5302C2.00348 10.797 1.98024 11.2158 1.95696 11.6354C1.95572 11.6576 1.95449 11.6799 1.95328 11.7021C1.90505 12.4164 1.85682 13.1547 2.34715 13.6443C2.82377 14.1282 3.55945 14.0868 4.26715 14.047L4.29239 14.0456C4.31163 14.0446 4.33092 14.0435 4.35023 14.0424C4.76672 14.019 5.19711 13.9948 5.46597 14.1099C5.7232 14.2223 6.01309 14.5519 6.29443 14.8729ZM11.9872 5.99862L10.9972 5.00867L6.99825 9.00767L4.99875 7.00817L4.0088 7.99812L6.99825 10.9876L11.9872 5.99862Z"
                                fill="currentColor"
                              ></path>
                            </g>
                          </g>
                        </svg>
                        {v.legal.name}
                      </CompanyBadge>
                    )}
                  </HHHead>

                  <HHChips>
                    <HHChip>{fmtMoney(v.salary)}</HHChip>
                  </HHChips>

                  {v.description && (
                    <div style={{ marginTop: 6 }}>
                      <div
                        style={{
                          color: "#475569",
                          fontSize: 14,
                          lineHeight: 1.5,
                          // свёрнутый вид — 3 строки, дальше «…»
                          display: "-webkit-box",
                          WebkitLineClamp: expanded[v.id]
                            ? ("unset" as any)
                            : 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          whiteSpace: expanded[v.id] ? "pre-wrap" : "normal",
                        }}
                        title={!expanded[v.id] ? "Развернуть" : undefined}
                      >
                        {v.description}
                      </div>

                      {/* Кнопка раскрытия */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(v.id)}
                        style={{
                          marginTop: 6,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: 0,
                          background: "transparent",
                          border: "none",
                          color: "#1a73e8",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        aria-expanded={!!expanded[v.id]}
                        aria-controls={`vacancy-desc-${v.id}`}
                      >
                        {expanded[v.id] ? "Свернуть" : "Показать полностью"}
                        <span
                          aria-hidden
                          style={{
                            display: "inline-flex",
                            transition: "transform .15s ease",
                            transform: expanded[v.id]
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M8 11.5L13 6.5L12.01 5.51L8 9.52L3.99 5.51L3 6.5L8 11.5Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                  )}

                  <HHBottom>
                    <HHPrice>{fmtMoney(v.salary)}</HHPrice>
                  </HHBottom>
                </HHMid>

                <HHRight>
                  <OpenBtn
                    onClick={() =>
                      setOfferModal({ open: true, vacancyId: v.id })
                    }
                  >
                    Откликнуться
                  </OpenBtn>
                </HHRight>
              </HHCard>
            ))}
          </ListSingle>

    {/* ✅ моб. панель откликов */}
    <MobileOffersBar
      type="button"
      onClick={() => setOffersModalOpen(true)} // ❗️не helpOpen, сделай offersModalOpen
    >
      <div className="left">
        <div className="title">Мои отклики</div>
        <div className="sub">
          {offersLoading ? "Загрузка..." : offers.length ? "Отклики: " + offers.length : "Пока нет откликов"}
        </div>
      </div>
      <div className="badge">{offers.length}</div>
    </MobileOffersBar>
  </div>

  <StickyAside aria-label="Мои отклики">
  <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Мои отклики
            </h3>
            <EditBtn onClick={() => refetchOffers()}>Обновить</EditBtn>
          </div>

          {offersLoading ? (
            <div style={{ color: "#64748b", fontSize: 14 }}>Загрузка…</div>
          ) : offers.length === 0 ? (
            <div
              style={{
                border: "1px dashed #e7ecf3",
                borderRadius: 12,
                padding: 12,
                color: "#64748b",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Здесь появятся ваши отклики
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {offers.map((o) => {
                const vac = o.vacancy;
                const prof = o.workerProfession?.profession;
                const lang = (i18n.language || "ru").split("-")[0] as
                  | "ru"
                  | "uz";
                const profName = lang === "uz" ? prof?.nameUz : prof?.nameRu;

                return (
                  <div
                    key={o.id}
                    style={{
                      border: "1px solid #e7ecf3",
                      borderRadius: 12,
                      padding: 10,
                      background: "#fff",
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          border: "1px solid #E5E7EB",
                          background: "#F9FAFB",
                          color: "#374151",
                        }}
                      >
                        {o.status === "NEW"
                          ? "Новый"
                          : o.status === "VIEWED"
                          ? "Просмотрен"
                          : o.status === "ACCEPTED"
                          ? "Принят"
                          : o.status === "REJECTED"
                          ? "Отклонён"
                          : o.status}
                      </span>

                      <small style={{ color: "#6b7280" }}>
                        {new Date(o.createdAt).toLocaleDateString("ru-RU")}
                      </small>
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        color: "#0f172a",
                        fontSize: 14,
                      }}
                    >
                      {vac.title}
                    </div>

                    {vac.legal?.name && (
                      <div
                        style={{
                          color: "#475569",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {vac.legal.name}
                      </div>
                    )}

                    {vac.salary ? (
                      <div
                        style={{
                          color: "#1e5cfb",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {vac.salary.toLocaleString("ru-RU")} сум
                      </div>
                    ) : null}

                    {vac.description && (
                      <div style={{ marginTop: 2 }}>
                        <div
                          id={`offer-desc-${o.id}`}
                          style={{
                            color: "#64748b",
                            fontSize: 13,
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: offersExpanded[o.id]
                              ? ("unset" as any)
                              : 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            whiteSpace: offersExpanded[o.id]
                              ? "pre-wrap"
                              : "normal",
                          }}
                        >
                          {vac.description}
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleOfferExpand(o.id)}
                          aria-expanded={!!offersExpanded[o.id]}
                          aria-controls={`offer-desc-${o.id}`}
                          style={{
                            marginTop: 6,
                            padding: 0,
                            background: "transparent",
                            border: "none",
                            color: "#1a73e8",
                            fontWeight: 600,
                            fontSize: 13,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            cursor: "pointer",
                          }}
                        >
                          {offersExpanded[o.id]
                            ? "Свернуть"
                            : "Показать полностью"}
                          <span
                            aria-hidden
                            style={{
                              display: "inline-flex",
                              transition: "transform .15s ease",
                              transform: offersExpanded[o.id]
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M8 11.5L13 6.5L12.01 5.51L8 9.52L3.99 5.51L3 6.5L8 11.5Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </button>
                      </div>
                    )}
                    <div
                      style={{
                        color: "#475569",
                        fontSize: 13,
                      }}
                    >
                      Профессия: <b>{profName}</b>
                    </div>

                    {o.message ? (
                      <div
                        style={{
                          marginTop: 4,
                          padding: 8,
                          background: "#f8fafc",
                          borderRadius: 8,
                          border: "1px solid #eef2f7",
                          color: "#334155",
                          fontSize: 13,
                        }}
                      >
                        {o.message}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
  </StickyAside>
</Grid2>


      {/* ДВЕ КОЛОНКИ: список + сайдбар */}
   

      <Modal
  open={offersModalOpen}
  title="Мои отклики"
  onClose={() => setOffersModalOpen(false)}
  width={560}
>
<div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Мои отклики
            </h3>
            <EditBtn onClick={() => refetchOffers()}>Обновить</EditBtn>
          </div>

          {offersLoading ? (
            <div style={{ color: "#64748b", fontSize: 14 }}>Загрузка…</div>
          ) : offers.length === 0 ? (
            <div
              style={{
                border: "1px dashed #e7ecf3",
                borderRadius: 12,
                padding: 12,
                color: "#64748b",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Здесь появятся ваши отклики
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {offers.map((o) => {
                const vac = o.vacancy;
                const prof = o.workerProfession?.profession;
                const lang = (i18n.language || "ru").split("-")[0] as
                  | "ru"
                  | "uz";
                const profName = lang === "uz" ? prof?.nameUz : prof?.nameRu;

                return (
                  <div
                    key={o.id}
                    style={{
                      border: "1px solid #e7ecf3",
                      borderRadius: 12,
                      padding: 10,
                      background: "#fff",
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          border: "1px solid #E5E7EB",
                          background: "#F9FAFB",
                          color: "#374151",
                        }}
                      >
                        {o.status === "NEW"
                          ? "Новый"
                          : o.status === "VIEWED"
                          ? "Просмотрен"
                          : o.status === "ACCEPTED"
                          ? "Принят"
                          : o.status === "REJECTED"
                          ? "Отклонён"
                          : o.status}
                      </span>

                      <small style={{ color: "#6b7280" }}>
                        {new Date(o.createdAt).toLocaleDateString("ru-RU")}
                      </small>
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        color: "#0f172a",
                        fontSize: 14,
                      }}
                    >
                      {vac.title}
                    </div>

                    {vac.legal?.name && (
                      <div
                        style={{
                          color: "#475569",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {vac.legal.name}
                      </div>
                    )}

                    {vac.salary ? (
                      <div
                        style={{
                          color: "#1e5cfb",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {vac.salary.toLocaleString("ru-RU")} сум
                      </div>
                    ) : null}

                    {vac.description && (
                      <div style={{ marginTop: 2 }}>
                        <div
                          id={`offer-desc-${o.id}`}
                          style={{
                            color: "#64748b",
                            fontSize: 13,
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: offersExpanded[o.id]
                              ? ("unset" as any)
                              : 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            whiteSpace: offersExpanded[o.id]
                              ? "pre-wrap"
                              : "normal",
                          }}
                        >
                          {vac.description}
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleOfferExpand(o.id)}
                          aria-expanded={!!offersExpanded[o.id]}
                          aria-controls={`offer-desc-${o.id}`}
                          style={{
                            marginTop: 6,
                            padding: 0,
                            background: "transparent",
                            border: "none",
                            color: "#1a73e8",
                            fontWeight: 600,
                            fontSize: 13,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            cursor: "pointer",
                          }}
                        >
                          {offersExpanded[o.id]
                            ? "Свернуть"
                            : "Показать полностью"}
                          <span
                            aria-hidden
                            style={{
                              display: "inline-flex",
                              transition: "transform .15s ease",
                              transform: offersExpanded[o.id]
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M8 11.5L13 6.5L12.01 5.51L8 9.52L3.99 5.51L3 6.5L8 11.5Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </button>
                      </div>
                    )}
                    <div
                      style={{
                        color: "#475569",
                        fontSize: 13,
                      }}
                    >
                      Профессия: <b>{profName}</b>
                    </div>

                    {o.message ? (
                      <div
                        style={{
                          marginTop: 4,
                          padding: 8,
                          background: "#f8fafc",
                          borderRadius: 8,
                          border: "1px solid #eef2f7",
                          color: "#334155",
                          fontSize: 13,
                        }}
                      >
                        {o.message}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
</Modal>

      {/* модалка отклика */}
      <Modal
        open={offerModal.open}
        title="Отправить отклик"
        onClose={() => setOfferModal({ open: false, vacancyId: null })}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              onClick={() => setOfferModal({ open: false, vacancyId: null })}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                background: "#fff",
                border: "1px solid #e7ecf3",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSendOffer}
              disabled={!selectedProf || loadingOffer}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                background: "#1e5cfb",
                color: "#fff",
                border: "1px solid #1e5cfb",
                fontWeight: 700,
                cursor: loadingOffer ? "wait" : "pointer",
                opacity: loadingOffer ? 0.6 : 1,
              }}
            >
              {loadingOffer ? "Отправка..." : "Отправить"}
            </button>
          </div>
        }
      >
        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ fontWeight: 600, fontSize: 14 }}>
            Ваша профессия
          </label>
          <CustomSelect
            options={professions}
            value={selectedProf}
            onChange={(v) => setSelectedProf(v as string)}
            placeholder="Выберите профессию"
            menuMaxHeight={260}
          />
        </div>
      </Modal>
    </PageWrap>
  );
}
