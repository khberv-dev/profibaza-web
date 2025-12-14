// src/features/profile/components/InvestorProfile.tsx
import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Card, CardBody } from "../../pro-profile-section.style";
import { InvestorContactsSection } from "./InvestorContactsSection";
import { useInvestorMe } from "../../../../shared/modules/useInvestor";

import {
  HiOutlineBriefcase,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlinePlusCircle,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import { FiRefreshCcw } from "react-icons/fi";
import InvestorVacanciesPage from "./InvestorVacanciesPage";
import { useInvestorProjects } from "../../../../shared/modules/useInvestorProjects";

const StatItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "40px 1fr",
      gap: 12,
      padding: 14,
      borderRadius: 14,
      background: "#f3f4f6",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: "rgba(15,23,42,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0f172a",
      }}
    >
      {icon}
    </div>

    <div style={{ display: "grid", gap: 4 }}>
      <div style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>
        {label}
      </div>

      <div
        style={{
          fontSize: 15,
          fontWeight: 900,
          color: "#0f172a",
          lineHeight: 1.2,
          wordBreak: "break-word",
        }}
      >
        {value ?? <span style={{ color: "#94a3b8", fontWeight: 800 }}>—</span>}
      </div>
    </div>
  </div>
);

const SectionCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, right, children }) => (
  <div
    style={{
      marginTop: 14,
      background: "#f3f4f6",
      borderRadius: 16,
      padding: 14,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "rgba(15,23,42,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0f172a",
          }}
        >
          {icon}
        </span>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
          {title}
        </div>
      </div>

      {right}
    </div>

    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 12,
      }}
    >
      {children}
    </div>
  </div>
);

export const InvestorProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: me, isLoading, error } = useInvestorMe(true);
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useInvestorProjects(true);

  // --- простой адаптив через JS (без CSS media в inline) ---
  const [w, setW] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const statsCols = w < 720 ? "1fr" : w < 1024 ? "1fr 1fr" : "1fr 1fr 1fr";

  const updatedText = me?.updatedAt
    ? dayjs(me.updatedAt).format("DD.MM.YYYY")
    : null;

  const createdText = me?.createdAt
    ? dayjs(me.createdAt).format("DD.MM.YYYY")
    : "—";

  const investText =
    typeof me?.investmentAmount === "number"
      ? `${me.investmentAmount.toLocaleString("ru-RU")} сум`
      : "—";

  const btnBase: React.CSSProperties = {
    border: "1px solid rgba(15,23,42,0.12)",
    background: "#fff",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: "#0f172a",
  };

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    border: "none",
    background: "#111827",
    color: "#fff",
  };

  return (
    <div style={{ gridColumn: "1 / -1", marginTop: 15 }}>
      <Card
        style={{
          borderRadius: 18,
          border: "none",
          background: "#fff",
          boxShadow: "none",
        }}
      >
        <CardBody>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  margin: 0,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("investor.profileTitle")}
              </h2>

              {updatedText ? (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "#f3f4f6",
                    color: "#475569",
                    fontSize: 12,
                    fontWeight: 800,
                    width: "fit-content",
                  }}
                  title={`Обновлено ${updatedText}`}
                >
                  <FiRefreshCcw />
                  {`Обновлено ${updatedText}`}
                </div>
              ) : null}
            </div>
          </div>

          {isLoading ? (
            <div style={{ color: "#64748b" }}>{t("loading")}</div>
          ) : error ? (
            <div
              style={{
                color: "#b91c1c",
                background: "#fee2e2",
                borderRadius: 14,
                padding: 12,
                fontWeight: 800,
              }}
            >
              {(error as any)?.message ||
                t("profile.loadFailed") ||
                "Не удалось загрузить профиль"}
            </div>
          ) : (
            <>
              {/* Stats (адаптив) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: statsCols,
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <StatItem
                  icon={<HiOutlineBriefcase size={20} />}
                  label={t("investor.activityType")}
                  value={me?.activityType || "—"}
                />
                <StatItem
                  icon={<HiOutlineBanknotes size={20} />}
                  label={t("investor.investmentAmount")}
                  value={investText}
                />
                <StatItem
                  icon={<HiOutlineCalendarDays size={20} />}
                  label={t("investor.createdAt")}
                  value={createdText}
                />
              </div>

              {/* Контакты */}
              <InvestorContactsSection contacts={me?.contacts ?? []} />

              {/* ===== Projects section + button to create ===== */}
              <SectionCard
                title={t("investor.projects.sectionTitle") || "Проекты"}
                icon={<HiOutlineSquares2X2 size={18} />}
                right={
                  <button
                    type="button"
                    style={btnPrimary}
                    onClick={() => navigate("/app/investor/projects/create")}
                    title={t("investor.projects.createCta") || "Создать проект"}
                  >
                    <HiOutlinePlusCircle size={18} />
                    {t("investor.projects.createCta") || "Создать проект"}
                  </button>
                }
              >
                {projectsLoading ? (
                  <div style={{ color: "#64748b", fontWeight: 700 }}>
                    {t("loading") || "Загрузка..."}
                  </div>
                ) : projectsError ? (
                  <div
                    style={{
                      color: "#b91c1c",
                      background: "#fee2e2",
                      borderRadius: 12,
                      padding: 10,
                      fontWeight: 800,
                    }}
                  >
                    {(projectsError as any)?.message ||
                      t("investor.projects.loadFailed") ||
                      "Не удалось загрузить проекты"}
                  </div>
                ) : !projects || projects.length === 0 ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontWeight: 900, color: "#0f172a" }}>
                      {t("investor.projects.emptyTitle") || "Пока нет проектов"}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {t("investor.projects.emptyText") ||
                        "Создайте проект: укажите масштаб, партнёров и потребность в специалистах."}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {projects.map((p) => {
                      const capLabel =
                        p.capacity === "SMALL"
                          ? t("investor.projects.capacitySmall") || "SMALL"
                          : p.capacity === "MIDDLE"
                          ? t("investor.projects.capacityMiddle") || "MIDDLE"
                          : t("investor.projects.capacityLarge") || "LARGE";

                      // ✅ В твоей структуре нет createdAt → покажем дату старта первой позиции (если есть)
                      const firstStart =
                        Array.isArray(p.employment) &&
                        p.employment[0]?.startDate
                          ? dayjs(p.employment[0].startDate).format(
                              "DD.MM.YYYY"
                            )
                          : null;

                      const positions = Array.isArray(p.employment)
                        ? p.employment.length
                        : 0;

                      const people = Array.isArray(p.employment)
                        ? p.employment.reduce(
                            (sum, e) => sum + (Number(e.count) || 0),
                            0
                          )
                        : 0;

                      // ✅ статус из API
                      const statusLabel =
                        p.status === "PLANNED"
                          ? t("investor.projects.statusPlanned") ||
                            "Запланирован"
                          : p.status === "ACTIVE"
                          ? t("investor.projects.statusActive") || "Активен"
                          : p.status === "DONE"
                          ? t("investor.projects.statusDone") || "Завершён"
                          : p.status;

                      return (
                        <div
                          key={p.id}
                          style={{
                            background: "#f9fafb",
                            borderRadius: 14,
                            padding: 12,
                            display: "grid",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 10,
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ display: "grid", gap: 4 }}>
                              <div
                                style={{ fontWeight: 900, color: "#0f172a" }}
                              >
                                {capLabel}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    background: "rgba(15,23,42,0.06)",
                                    padding: "6px 10px",
                                    borderRadius: 999,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "#0f172a",
                                  }}
                                >
                                  {t("investor.projects.status") || "Статус"}:{" "}
                                  {statusLabel}
                                </span>

                                <span
                                  style={{
                                    background: "rgba(15,23,42,0.06)",
                                    padding: "6px 10px",
                                    borderRadius: 999,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "#0f172a",
                                  }}
                                >
                                  {t("investor.projects.startFrom") || "Старт"}:{" "}
                                  {firstStart ?? "—"}
                                </span>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "inline-flex",
                                gap: 8,
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  background: "rgba(15,23,42,0.06)",
                                  padding: "6px 10px",
                                  borderRadius: 999,
                                  fontSize: 12,
                                  fontWeight: 800,
                                  color: "#0f172a",
                                }}
                              >
                                {t("investor.projects.positions") || "Позиций"}:{" "}
                                {positions}
                              </span>

                              <span
                                style={{
                                  background: "rgba(15,23,42,0.06)",
                                  padding: "6px 10px",
                                  borderRadius: 999,
                                  fontSize: 12,
                                  fontWeight: 800,
                                  color: "#0f172a",
                                }}
                              >
                                {t("investor.projects.people") || "Людей"}:{" "}
                                {people}
                              </span>
                            </div>
                          </div>

                          {p.description ? (
                            <div
                              style={{
                                color: "#334155",
                                fontSize: 14,
                                lineHeight: 1.5,
                              }}
                            >
                              {p.description}
                            </div>
                          ) : null}

                          {Array.isArray(p.partners) &&
                          p.partners.length > 0 ? (
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                              }}
                            >
                              {p.partners.slice(0, 8).map((partner, i) => (
                                <span
                                  key={`${p.id}-partner-${i}`}
                                  style={{
                                    background: "#fff",
                                    borderRadius: 999,
                                    padding: "6px 10px",
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    border: "1px solid rgba(15,23,42,0.08)",
                                  }}
                                >
                                  {partner}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {/* Вакансии */}
          <InvestorVacanciesPage />
        </CardBody>
      </Card>
    </div>
  );
};

export default InvestorProfile;
