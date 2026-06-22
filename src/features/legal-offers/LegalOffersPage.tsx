// src/pages/legal-offers/LegalOffersPage.tsx
import React, { useState } from "react";
import {
  acceptLegalOffer,
  declineLegalOffer,
  useLegalOffers,
} from "../../shared/modules/legal-offers";
import toast from "react-hot-toast";
import { CompanyBadge } from "../profile/profile-style";
import { Modal } from "../../components/modal/Modal";
import { avatarUrl } from "../../shared/lib/avatar";

const money = (n?: number) =>
  typeof n === "number" ? `${n.toLocaleString("ru-RU")} сум` : "—";

export default function LegalOffersPage() {
  const { data: offers = [], isFetching, refetch } = useLegalOffers();
  const [confirm, setConfirm] = useState<{
    id: string;
    action: "accept" | "decline";
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<"ALL" | "NEW" | "ACCEPTED" | "REJECTED">(
    "NEW"
  );

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

      let res;
      if (confirm.action === "accept") {
        res = await acceptLegalOffer(confirm.id, msg);
      } else {
        res = await declineLegalOffer(confirm.id, msg);
      }

      // ✅ поддержка нового формата {"ok":true,"message":{"uz":"Taklif qabul qilindi"}}
      const text =
        res?.message?.uz ||
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
        <h2 style={{ fontWeight: 800, fontSize: 22 }}>Отклики на вакансии</h2>
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
              {
                key: "NEW",
                label: "Shaxsiy ma'lumotlar".replace(
                  "Shaxsiy ma'lumotlar",
                  "Новые"
                ),
                count: counts.NEW,
              },
              { key: "ACCEPTED", label: "Принятые", count: counts.ACCEPTED },
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
                  color: active ? "#1a73e8" : "#1f2937", // синий/тёмно-серый
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                <span>{t.label}</span>
                {/* Счётчик тонкий, как текст, без капсул */}
                <span
                  style={{
                    marginLeft: 6,
                    color: active ? "#1a73e8" : "#6b7280",
                  }}
                >
                  {t.count}
                </span>

                {/* Синяя линия снизу у активного */}
                {active && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: -1, // перекрыть нижнюю серую границу
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

      {/* Content */}
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
              {/* Шапка карточки */}
              <button
                style={{
                  width: "100%",
                  border: "none",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    all: "unset",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpenId(expanded ? null : offer.id)}
                  aria-expanded={expanded}
                  aria-controls={`offer-details-${offer.id}`}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "max-content",
                      textAlign: "left",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {u?.avatar ? (
                      <img
                        src={avatarUrl(u.avatar)}
                        alt=""
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flex: "0 0 auto",
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
                          flex: "0 0 auto",
                        }}
                      >
                        {u?.name?.[0] || "?"}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
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

                  <div
                    style={{
                      display: "flex",
                      width: "max-content",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
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
                      aria-hidden
                      style={{
                        marginLeft: 10,
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform .15s ease",
                        color: "#64748b",
                        fontSize: 18,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        focusable="false"
                        className="magritte-icon___rRr4Q_12-3-5 magritte-icon_initial-primary___KhLAU_12-3-5"
                      >
                        <g>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.00002 11.5L13 6.49995L12.01 5.51001L8.00002 9.52009L3.98996 5.50996L3 6.4999L8.00002 11.5Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                  }}
                >
                  <button
                    onClick={() =>
                      setConfirm({ id: offer.id, action: "decline" })
                    }
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
                    onClick={() =>
                      setConfirm({ id: offer.id, action: "accept" })
                    }
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
              </button>

              {/* Разворачиваемая часть */}
              {expanded && (
                <div
                  id={`offer-details-${offer.id}`}
                  style={{
                    marginTop: 24,
                    display: "grid",
                    gap: 16,
                    padding: 20,
                    borderRadius: 16,
                  }}
                >
                  {/* Кандидат */}
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
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <img
                        src={
                          u?.avatar
                            ? avatarUrl(u.avatar)
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
                            marginBottom: 2,
                          }}
                        >
                          {u?.surname} {u?.name}
                        </div>
                        <div style={{ color: "#475569", fontSize: 14 }}>
                          {prof?.nameRu || "Профессия не указана"}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "#0f172a",
                          }}
                        >
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
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                          marginBottom: 6,
                        }}
                      >
                        Опыт работы
                      </div>
                      <ul
                        style={{
                          paddingLeft: 18,
                          color: "#334155",
                          fontSize: 14,
                        }}
                      >
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
                                {exp.jobPlace} ({exp.startedAt} –{" "}
                                {exp.endedAt ?? "…"})
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

                  {/* Вакансия */}
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
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <CompanyBadge title={vac.legal.name}>
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
                        {vac.legal.name}
                      </CompanyBadge>

                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          color: "#0f172a",
                        }}
                      >
                        {vac?.title}
                      </div>
                      <div
                        style={{
                          marginLeft: "auto",
                          fontWeight: 800,
                          color: "#2563eb",
                          fontSize: 15,
                        }}
                      >
                        {money(vac?.salary)}
                      </div>
                    </div>

                    {vac?.description && (
                      <div
                        style={{
                          color: "#334155",
                          lineHeight: 1.5,
                          fontSize: 14,
                        }}
                      >
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
            <div
              style={{ color: "#475569", textAlign: "center", lineHeight: 1.5 }}
            >
              Вы уверены, что хотите{" "}
              {confirm.action === "accept" ? "принять" : "отклонить"} этот
              отклик?
            </div>

            {/* Новое: textarea для сообщения */}
            <div style={{ display: "grid", gap: 6 }}>
              <label
                htmlFor="confirm-message"
                style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}
              >
                Сообщение кандидату (будет отправлено в запросе)
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
                  width: "415px",
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
              <div
                style={{ textAlign: "right", fontSize: 12, color: "#94a3b8" }}
              >
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
                  background:
                    confirm.action === "accept" ? "#2563eb" : "#ef4444",
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
