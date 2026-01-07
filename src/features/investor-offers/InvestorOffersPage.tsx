import React, { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "../../components/modal/Modal";
import { CompanyBadge } from "../profile/profile-style";

import {
  acceptInvestorOffer,
  declineInvestorOffer,
  useInvestorOffers,
} from "../../shared/modules/investor-offers";

const money = (n?: number) =>
  typeof n === "number" ? `${n.toLocaleString("ru-RU")} сум` : "—";

export default function InvestorOffersPage() {
  const { data: offers = [], isFetching, refetch } = useInvestorOffers();

  const [confirm, setConfirm] = useState<{
    id: string;
    action: "accept" | "decline";
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<"ALL" | "NEW" | "ACCEPTED" | "REJECTED">("NEW");

  const counts = React.useMemo(() => {
    const base = { ALL: offers.length, NEW: 0, ACCEPTED: 0, REJECTED: 0 };
    for (const o of offers) {
      if (o.status === "NEW") base.NEW++;
      if (o.status === "ACCEPTED") base.ACCEPTED++;
      if (o.status === "REJECTED") base.REJECTED++;
    }
    return base;
  }, [offers]);

  const visibleOffers = React.useMemo(() => {
    if (tab === "ALL") return offers;
    return offers.filter((o) => o.status === tab);
  }, [offers, tab]);

  const handleRefresh = async () => {
    await refetch();
    toast.success("Отклики обновлены");
  };

  function badgeColor(s?: string) {
    switch (s) {
      case "NEW":
        return {
          bg: "#eef2ff",
          border: "#c7d2fe",
          color: "#3730a3",
          label: "NEW",
        };
      case "ACCEPTED":
        return {
          bg: "#ecfdf5",
          border: "#a7f3d0",
          color: "#065f46",
          label: "ACCEPTED",
        };
      case "REJECTED":
        return {
          bg: "#fef2f2",
          border: "#fecaca",
          color: "#991b1b",
          label: "REJECTED",
        };
      default:
        return {
          bg: "#f1f5f9",
          border: "#e2e8f0",
          color: "#475569",
          label: s ?? "—",
        };
    }
  }

  async function handleConfirm() {
    if (!confirm) return;

    try {
      setLoading(true);

      const msg =
        confirmMessage?.trim() ||
        (confirm.action === "accept"
          ? "Bizaga yoqtiz, ishga olamiz xay"
          : "Afsus, hozircha mos kelmadi");

      const res =
        confirm.action === "accept"
          ? await acceptInvestorOffer(confirm.id, msg)
          : await declineInvestorOffer(confirm.id, msg);

      const text =
        // @ts-ignore
        res?.message?.uz ||
        // @ts-ignore
        res?.message ||
        (confirm.action === "accept"
          ? "Kandidat qabul qilindi"
          : "Kandidat rad etildi");

      toast.success(text);
      await refetch();
      setConfirm(null);
      setConfirmMessage("");
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message?.uz ||
          e?.response?.data?.message ||
          "Xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  }

  function translateJobType(type?: string): string {
    switch (type) {
      case "SOLO":
        return "Самостоятельно (одиночка)";
      case "EMPLOYEE":
        return "Работник (в компании)";
      case "ABROAD":
        return "Работа за границей";
      default:
        return "Не указано";
    }
  }

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1000,
        margin: "0 auto",
        display: "grid",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontWeight: 800, fontSize: 22 }}>Отклики (инвестор)</h2>

        <button
          onClick={handleRefresh}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #e7ecf3",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Обновить
        </button>
      </div>

      <div style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", gap: 20 }}>
          {(
            [
              { key: "NEW", label: "Новые", count: counts.NEW },
              { key: "ACCEPTED", label: "Принятые", count: counts.ACCEPTED },
              { key: "REJECTED", label: "Отклонённые", count: counts.REJECTED },
              { key: "ALL", label: "Все", count: counts.ALL },
            ] as const
          ).map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  position: "relative",
                  padding: "10px 0 12px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: active ? "#1a73e8" : "#1f2937",
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                <span>{t.label}</span>
                <span
                  style={{
                    marginLeft: 6,
                    color: active ? "#1a73e8" : "#6b7280",
                  }}
                >
                  {t.count}
                </span>

                {active && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: -1,
                      height: 2,
                      background: "#1a73e8",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isFetching ? (
        <div style={{ color: "#64748b" }}>Загрузка...</div>
      ) : offers.length === 0 ? (
        <div
          style={{
            border: "1px dashed #e5e7eb",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
            color: "#64748b",
          }}
        >
          Нет откликов
        </div>
      ) : (
        visibleOffers.map((offer) => {
          const wp = offer.workerProfession;
          const u = wp?.worker?.user;
          const prof = wp?.profession;
          const vac = offer.vacancy;
          const expanded = openId === offer.id;

          const badg = badgeColor(offer.status);

          // ✅ показываем действия ТОЛЬКО когда NEW
          const showActions = offer.status === "NEW";

          return (
            <div
              key={offer.id}
              style={{
                background: "#fff",
                border: "1px solid #e7ecf3",
                borderRadius: 14,
                boxShadow: "0 4px 16px rgba(30,92,251,0.06)",
                padding: 16,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  cursor: "pointer",
                }}
                onClick={() => setOpenId(expanded ? null : offer.id)}
                aria-expanded={expanded}
                aria-controls={`offer-details-${offer.id}`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  {u?.avatar ? (
                    <img
                      src={`https://profibaza.uz/public/avatar/${u.avatar}`}
                      alt=""
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        color: "#64748b",
                      }}
                    >
                      {u?.name?.[0] || "?"}
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        lineHeight: 1.2,
                      }}
                    >
                      {u?.surname} {u?.name}
                    </div>
                    <div style={{ color: "#475569", fontSize: 14 }}>
                      {prof?.nameRu || "Без профессии"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#2563eb",
                        fontSize: 15,
                      }}
                    >
                      {money(vac?.salary)}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: 12,
                        marginTop: 2,
                        maxWidth: 260,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={vac?.title}
                    >
                      {vac?.title}
                    </div>
                  </div>

                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: `1px solid ${badg.border}`,
                      background: badg.bg,
                      color: badg.color,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {badg.label}
                  </span>
                </div>
              </div>

              {/* ✅ actions — только NEW */}
              {showActions && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <button
                    onClick={() => setConfirm({ id: offer.id, action: "decline" })}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "8px 14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Отклонить
                  </button>

                  <button
                    onClick={() => setConfirm({ id: offer.id, action: "accept" })}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Принять
                  </button>
                </div>
              )}

              {/* details */}
              {expanded && (
                <div
                  id={`offer-details-${offer.id}`}
                  style={{ marginTop: 16, display: "grid", gap: 16 }}
                >
                  <section
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                      padding: 20,
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <img
                        src={
                          u?.avatar
                            ? `https://profibaza.uz/public/avatar/${u.avatar}`
                            : "https://hhcdn.ru/icms2_452423f3d84e34c5ba4d45861d1a9a2a.svg"
                        }
                        alt=""
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          objectFit: "cover",
                          background: "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ flexGrow: 1 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 16,
                            color: "#0f172a",
                          }}
                        >
                          {u?.surname} {u?.name}
                        </div>
                        <div style={{ color: "#475569", fontSize: 14 }}>
                          {prof?.nameRu || "Профессия не указана"}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                          Рейтинг: {wp?.rating ?? "—"}
                        </div>
                        <div style={{ color: "#64748b", fontSize: 13 }}>
                          Тип: {translateJobType(wp?.jobType)}
                        </div>
                      </div>
                    </div>

                    {wp?.inventory && (
                      <div
                        style={{
                          background: "#f1f5f9",
                          padding: "8px 12px",
                          borderRadius: 8,
                          fontSize: 14,
                          color: "#334155",
                        }}
                      >
                        <b>Инвентарь:</b> {wp.inventory}
                      </div>
                    )}

                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                        Опыт работы
                      </div>
                      <ul style={{ paddingLeft: 18, color: "#334155", fontSize: 14 }}>
                        {wp?.experience?.length ? (
                          wp.experience.map((exp: any) => (
                            <li
                              key={exp.id}
                              style={{
                                marginBottom: 10,
                                paddingBottom: 10,
                                borderBottom: "1px dashed #e2e8f0",
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>
                                {exp.jobPlace} ({exp.startedAt} – {exp.endedAt ?? "…"})
                              </div>
                              <div style={{ color: "#64748b", fontSize: 13 }}>
                                {exp.jobDescription}
                              </div>
                            </li>
                          ))
                        ) : (
                          <li style={{ color: "#94a3b8" }}>Нет записей</li>
                        )}
                      </ul>
                    </div>
                  </section>

                  <section
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                      padding: 20,
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CompanyBadge title={vac?.legal?.name || ""}>
                        {vac?.legal?.name || "—"}
                      </CompanyBadge>

                      <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
                        {vac?.title}
                      </div>

                      <div style={{ marginLeft: "auto", fontWeight: 800, color: "#2563eb" }}>
                        {money(vac?.salary)}
                      </div>
                    </div>

                    {vac?.description && (
                      <div style={{ color: "#334155", lineHeight: 1.5, fontSize: 14 }}>
                        {vac.description}
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>
          );
        })
      )}

      <Modal
        open={!!confirm}
        onClose={() => {
          setConfirm(null);
          setConfirmMessage("");
        }}
        title={
          confirm
            ? confirm.action === "accept"
              ? "Принять кандидата"
              : "Отклонить кандидата"
            : ""
        }
        width={480}
      >
        {confirm && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ color: "#475569", textAlign: "center", lineHeight: 1.5 }}>
              Вы уверены, что хотите{" "}
              {confirm.action === "accept" ? "принять" : "отклонить"} этот отклик?
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label
                htmlFor="confirm-message"
                style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}
              >
                Сообщение кандидату
              </label>
              <textarea
                id="confirm-message"
                value={confirmMessage}
                onChange={(e) => setConfirmMessage(e.target.value)}
                placeholder={
                  confirm.action === "accept"
                    ? "Bizaga yoqtiz, ishga olamiz xay"
                    : "Afsus, hozircha mos kelmadi"
                }
                maxLength={500}
                rows={5}
                style={{
                  resize: "vertical",
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  outline: "none",
                  lineHeight: 1.45,
                  fontSize: 14,
                  color: "#0f172a",
                  background: "#fff",
                }}
              />
              <div style={{ textAlign: "right", fontSize: 12, color: "#94a3b8" }}>
                {confirmMessage.length}/500
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <button
                onClick={() => {
                  setConfirm(null);
                  setConfirmMessage("");
                }}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Отмена
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  background: confirm.action === "accept" ? "#2563eb" : "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "..." : "Подтвердить"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
