import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  CalendarDays,
  Wallet,
  MessageSquare,
  Smile,
  Meh,
  Frown,
  Star,
  LucideMessageCircleQuestionMark,
  Phone,
} from "lucide-react";
import dayjs from "dayjs";
import {
  WOPage,
  WOToolbar,
  WOTitle,
  WOSub,
  WOList,
  WOCard,
  WOLeft,
  WOAvatar,
  WOMid,
  WOHead,
  WOName,
  WOSubline,
  WOChips,
  WOStatus,
  WOMeta,
  WODivider,
  WODesc,
  WORight,
  WOGhost,
  WOPrimary,
  WODanger,
  WOEmpty,
  WOSkel,
  WOTabs,
  WOTab,
  CommentBlock,
  CommentForm,
  CommentToggle,
  StarsRow,
  StarBtn,
} from "./worker-new-orders.style";
import {
  getWorkerOrders,
  WorkerNewOrder,
  acceptWorkerOrder,
  rejectWorkerOrder,
  postWorkerFeedback,
} from "../../../../shared/endpoints/worker";
import { CommentsThread } from "../client/CommentsThread";
import ReplyBar from "./ReplyBar";
import { finishWorkerOrder } from "../../../../shared/modules/worker";
import { Modal } from "../../../../components/modal/Modal";
import OrderEvidenceUploader from "./OrderEvidenceUploader";

const TABS: { key: "ALL" | WorkerNewOrder["status"]; label: string }[] = [
  { key: "ALL", label: "Все" },
  { key: "NEW", label: "Новые" },
  { key: "PROGRESS", label: "В работе" },
  { key: "DONE", label: "Завершённые" },
  { key: "REJECTED", label: "Отклонённые" },
];

const fmtMoney = (n?: number | null) =>
  typeof n === "number" ? n.toLocaleString("ru-RU") + " сум" : "—";

const initials = (u?: { name?: string; surname?: string }) =>
  ((u?.surname?.[0] ?? "") + (u?.name?.[0] ?? "")).toUpperCase() || "C";

const fio = (u?: {
  name?: string;
  surname?: string;
  middleName?: string | null;
}) => [u?.surname, u?.name].filter(Boolean).join(" ") || "Клиент";

const statusTone = (
  s: WorkerNewOrder["status"]
): "blue" | "green" | "amber" | "gray" | "red" => {
  switch (s) {
    case "NEW":
      return "blue";
    case "PROGRESS":
      return "amber";
    case "DONE":
      return "gray";
    case "REJECTED":
      return "red";
    default:
      return "gray";
  }
};
const statusLabel = (s: WorkerNewOrder["status"]) =>
  s === "NEW"
    ? "Новый"
    : s === "PROGRESS"
    ? "В работе"
    : s === "DONE"
    ? "Завершён"
    : "Отклонён";

type UI = {
  open: boolean;
  text: string;
  rating: number;
  replyTarget?: { id: string; author: string; text: string | null };
};

type CommentUIState = Record<string, UI>;

export default function NewWorkerOrdersPage() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("ALL");
  const queryClient = useQueryClient();
  const [commentUI, setCommentUI] = useState<CommentUIState>({});
  const getUI = (id: string): UI =>
    commentUI[id] ?? { open: false, text: "", rating: 0 };

  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [finishTargetId, setFinishTargetId] = useState<string | null>(null);

  const openFinishModal = async (orderId: string) => {
    setFinishTargetId(orderId);
    setFinishModalOpen(true);
    // гарантированно обновим список перед показом
    await queryClient.refetchQueries({ queryKey: ["worker", "orders"], exact: false });
  };
  const closeFinishModal = () => {
    setFinishModalOpen(false);
    setFinishTargetId(null);
  };

  const { mutate: finishOrder, isPending: isFinishing } = useMutation({
    mutationFn: (orderId: string) => finishWorkerOrder(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["worker", "orders"] });

      // снимок всех табов
      const snapshot = new Map<string, WorkerNewOrder[]>();
      TABS.forEach((t) => {
        const key = ["worker", "orders", t.key] as const;
        const prev = queryClient.getQueryData<WorkerNewOrder[]>(key) ?? [];
        snapshot.set(JSON.stringify(key), prev);
      });

      // оптимистично: поменять статус на DONE
      TABS.forEach((t) => {
        const key = ["worker", "orders", t.key] as const;
        const list = queryClient.getQueryData<WorkerNewOrder[]>(key) ?? [];

        if (t.key === "ALL") {
          const next = list.map((o) =>
            o.id === orderId ? { ...o, status: "DONE" } : o
          );
          queryClient.setQueryData(key, next);
        } else {
          if (t.key === "PROGRESS") {
            const next = list.filter((o) => o.id !== orderId);
            queryClient.setQueryData(key, next);
          }
          if (t.key === "DONE") {
            // возьмём актуальную карточку из ALL (уже с новым статусом)
            const all =
              queryClient.getQueryData<WorkerNewOrder[]>([
                "worker",
                "orders",
                "ALL",
              ]) ?? [];
            const updated = all.find((o) => o.id === orderId);
            const item = updated ?? ({ id: orderId, status: "DONE" } as any);
            const uniq = [item, ...list.filter((o) => o.id !== orderId)];
            queryClient.setQueryData(key, uniq);
          }
        }
      });

      return { snapshot };
    },
    onError: (_err, _orderId, ctx) => {
      // откат
      if (ctx?.snapshot) {
        for (const [k, v] of ctx.snapshot.entries()) {
          queryClient.setQueryData(JSON.parse(k), v);
        }
      }
      alert("Не удалось завершить заказ. Попробуйте ещё раз.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["worker", "orders"] });
    },
  });

  const confirmFinish = () => {
    if (!finishTargetId) return;
    finishOrder(finishTargetId);
    closeFinishModal();
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ["worker", "orders", active],
    queryFn: ({ signal }) => getWorkerOrders({ status: active }, signal),
    staleTime: 60_000,
  });


  const buildOrderFileUrl = (fileId: string): string =>
    `https://pointer.uz/public/order/${encodeURIComponent(fileId)}`;
  
  const isVideoName = (name: string) =>
    /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(name);


  const addFileOptimistic = (orderId: string, fileId: string) => {
    // обновим все кэши, где может быть этот ордер
    TABS.forEach((t) => {
      const key = ["worker", "orders", t.key] as const;
      const list = queryClient.getQueryData<WorkerNewOrder[]>(key);
      if (!list) return;
      const next = list.map((o) =>
        o.id === orderId
          ? { ...o, files: Array.isArray(o.files) ? [...o.files, fileId] : [fileId] }
          : o
      );
      queryClient.setQueryData(key, next);
    });
  };

  const setOrderFilesOptimistic = (
    qc: ReturnType<typeof useQueryClient>,
    orderId: string,
    fileId: string
  ) => {
    TABS.forEach((t) => {
      const key = ["worker", "orders", t.key] as const;
      qc.setQueryData<WorkerNewOrder[] | undefined>(key, (prev:any) =>
        prev?.map((o:any) =>
          o.id === orderId
            ? { ...o, files: Array.isArray(o.files) ? [...o.files, fileId] : [fileId] }
            : o
        )
      );
    });
  };


  const handleEvidenceUploaded = async (fileId?: string) => {
    if (finishTargetId && fileId) {
      setOrderFilesOptimistic(queryClient, finishTargetId, fileId);
    }
  
    // инвалидируем ВСЕ ключи "worker/orders" и сразу рефетчим активные
    await queryClient.invalidateQueries({
      queryKey: ["worker", "orders"],
      exact: false,
      refetchType: "active",
    });
    await queryClient.refetchQueries({
      queryKey: ["worker", "orders"],
      exact: false,
      type: "active",
    });
  };


  const removeFromSpecificTabAndAddToTarget = (
    orderId: string,
    nextStatus: WorkerNewOrder["status"],
    snapshot: Map<string, WorkerNewOrder[]>
  ) => {
    // Сохраним снапшоты
    TABS.forEach((t) => {
      const key = JSON.stringify(["worker", "orders", t.key]);
      snapshot.set(
        key,
        queryClient.getQueryData<WorkerNewOrder[]>([
          "worker",
          "orders",
          t.key,
        ]) ?? []
      );
    });

   
    // Удалим из источников и добавим в целевые
    TABS.forEach((t) => {
      const key = ["worker", "orders", t.key] as const;
      const list = queryClient.getQueryData<WorkerNewOrder[]>(key) ?? [];
      // если таб = ALL: просто меняем статус и перемещаем вверх
      if (t.key === "ALL") {
        const idx = list.findIndex((o) => o.id === orderId);
        if (idx !== -1) {
          const item = { ...list[idx], status: nextStatus };
          const next = [item, ...list.filter((o) => o.id !== orderId)];
          queryClient.setQueryData(key, next);
        }
        return;
      }
      // инакше: если это таб NEW — удаляем; если таб nextStatus — добавляем в начало
      if (t.key === "NEW") {
        const next = list.filter((o) => o.id !== orderId);
        queryClient.setQueryData(key, next);
      }
      if (t.key === nextStatus) {
        const allKey = ["worker", "orders", "ALL"] as const;
        const all = queryClient.getQueryData<WorkerNewOrder[]>(allKey) ?? [];
        const fromAll = all.find((o) => o.id === orderId);
        const item = fromAll
          ? { ...fromAll, status: nextStatus }
          : ({ id: orderId, status: nextStatus } as any);
        const unique = [item, ...list.filter((o) => o.id !== orderId)];
        queryClient.setQueryData(key, unique);
      }
    });
  };

  /** --- Принятие заказа --- */
  const { mutate: accept, isPending: isAccepting } = useMutation({
    mutationFn: (orderId: string) => acceptWorkerOrder(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["worker", "orders"] });
      const snapshot = new Map<string, WorkerNewOrder[]>();
      // removeFromSpecificTabAndAddToTarget(orderId, "ACCEPTED", snapshot);
      return { snapshot };
    },
    onError: (_err, _orderId, ctx) => {
      // откат снапшотов
      if (ctx?.snapshot) {
        for (const [k, v] of ctx.snapshot.entries()) {
          queryClient.setQueryData(JSON.parse(k), v);
        }
      }
      alert("Не удалось принять заказ. Попробуйте ещё раз.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["worker", "orders"] });
    },
  });

  /** --- Отклонение заказа --- */
  const { mutate: reject, isPending: isRejecting } = useMutation({
    mutationFn: (orderId: string) => rejectWorkerOrder(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["worker", "orders"] });
      const snapshot = new Map<string, WorkerNewOrder[]>();
      removeFromSpecificTabAndAddToTarget(orderId, "REJECTED", snapshot);
      return { snapshot };
    },
    onError: (_err, _orderId, ctx) => {
      if (ctx?.snapshot) {
        for (const [k, v] of ctx.snapshot.entries()) {
          queryClient.setQueryData(JSON.parse(k), v);
        }
      }
      alert("Не удалось отклонить заказ. Попробуйте ещё раз.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["worker", "orders"] });
    },
  });

  function formatPhone(phone?: string | null): string {
    if (!phone) return "Телефон не указан";

    // Удаляем всё, кроме цифр
    const digits = phone.replace(/\D/g, "");

    // Приводим к виду +998 (xx) xxx-xx-xx
    const match = digits.match(/^998(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+998 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    }

    // fallback для номеров с кодом страны и без
    if (digits.startsWith("998") && digits.length > 3) {
      const rest = digits.slice(3);
      return `+998 ${rest}`;
    }

    return `+${digits}`;
  }

  const openComment = (id: string) =>
    setCommentUI((s) => ({ ...s, [id]: { ...getUI(id), open: true } }));

  const closeComment = (id: string) =>
    setCommentUI((s) => ({ ...s, [id]: { open: false, text: "", rating: 0 } }));

  const changeText = (id: string, text: string) =>
    setCommentUI((s) => ({ ...s, [id]: { ...getUI(id), text } }));

  const setReplyTarget = (id: string, t: UI["replyTarget"]) =>
    setCommentUI((s) => ({
      ...s,
      [id]: { ...getUI(id), replyTarget: t, open: true },
    }));

  const clearReplyTarget = (id: string) =>
    setCommentUI((s) => ({
      ...s,
      [id]: { ...getUI(id), replyTarget: undefined },
    }));

  const { mutate: replyFeedback, isPending: isReplying } = useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      postWorkerFeedback(commentId, { feedback: text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worker", "orders"] });
    },
    onError: (err) => {
      console.error(err);
      alert("Ошибка при отправке ответа");
    },
  });

  const saveComment = (id: string) => {
    const { text, replyTarget } = getUI(id);
    if (!replyTarget || !text.trim()) return;

    replyFeedback({ commentId: replyTarget.id, text });
    setCommentUI((s) => ({
      ...s,
      [id]: { open: false, text: "", rating: 0, replyTarget: undefined },
    }));
  };

  const selectedOrder: WorkerNewOrder | undefined = finishTargetId
    ? data?.find((o) => o.id === finishTargetId)
    : undefined;

  // Хелпер: соберём адрес красивой строкой
  const selectedAddr =
    selectedOrder &&
    [selectedOrder.address1, selectedOrder.address2, selectedOrder.address3]
      .filter(Boolean)
      .join(", ");


      const filesCount = selectedOrder?.files?.length ?? 0;
      const canFinish = !!selectedOrder && filesCount >= 3;



  return (
    <WOPage>
      <WOToolbar>
        <div>
          <WOTitle>Заказы</WOTitle>
          <WOSub>Просматривайте и управляйте заказами по статусам.</WOSub>
        </div>
      </WOToolbar>

      <WOTabs role="tablist" aria-label="Статусы заказов">
        {TABS.map((t) => (
          <WOTab
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            $active={active === t.key}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </WOTab>
        ))}
      </WOTabs>

      {isLoading ? (
        <WOList>
          <WOSkel />
          <WOSkel />
          <WOSkel />
        </WOList>
      ) : !data.length ? (
        <WOEmpty>Пока пусто для выбранного статуса.</WOEmpty>
      ) : (
        <WOList>
          {data.map((row) => {
            const u = row.client?.user || undefined;
            const ui = getUI(row.id);
            const avatar = u?.avatar
              ? `https://pointer.uz/public/avatar/${u.avatar}`
              : null;
            const addr = [row.address1, row.address2, row.address3]
              .filter(Boolean)
              .join(", ");
            const tone = statusTone(row.status);
            const canAccept =
              row.status === "NEW" && !isAccepting && !isRejecting;
            const canReject =
              row.status === "NEW" && !isRejecting && !isAccepting;

            return (
              <WOCard
                key={row.id}
                role="article"
                aria-label={`Заказ от ${fio(u)}`}
              >
                <div className="inner">
                  <WOLeft>
                    <WOAvatar $src={avatar}>{!avatar && initials(u)}</WOAvatar>
                  </WOLeft>

                  <WOMid>
                    <WOHead>
                      <div>
                        <WOName>{fio(u)}</WOName>
                        <WOSubline>{formatPhone(u?.phone)}</WOSubline>
                      </div>
                      <WOChips>
                        <WOStatus $tone={tone}>
                          {statusLabel(row.status)}
                        </WOStatus>
                      </WOChips>
                    </WOHead>

                    <WOMeta>
                      <li>
                        <CalendarDays size={16} />
                        <div>
                          <span className="k">Срок:</span>
                          <span className="v">
                            {dayjs(row.deadline).format("DD.MM.YYYY")}
                          </span>
                        </div>
                      </li>

                      <li>
                        <Wallet size={16} />
                        <div>
                          <span className="k">Бюджет:</span>
                          <span className="v">{fmtMoney(row.budget)}</span>
                        </div>
                      </li>

                      <li>
                        <MapPin size={16} />
                        <div>
                          <span className="k">Адрес:</span>
                          <span className="v">{addr || "—"}</span>
                        </div>
                      </li>
                    </WOMeta>
                    <WODivider />
                    <WODesc>{row.description}</WODesc>
                    <WODivider />
                    <CommentBlock>
                      {!ui.open ? (
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <CommentToggle onClick={() => openComment(row.id)}>
                            <span>Комментарии</span>
                            <MessageSquare />
                          </CommentToggle>

                          <WOGhost
                            type="button"
                            onClick={() =>
                              (window.location.href = `/worker/order/${row.id}`)
                            }
                          >
                            Позвонить <Phone size={16} />
                          </WOGhost>

                          {/* 🔹 Завершить (доступно в статусе PROGRESS) */}
                          {row.status === "PROGRESS" && (
                            <WOPrimary
                              style={{ maxWidth: "max-content" }}
                              type="button"
                              onClick={() => openFinishModal(row.id)}
                              title="Я выполнил этот заказ"
                              disabled={isFinishing}
                            >
                              {isFinishing && finishTargetId === row.id
                                ? "…"
                                : "Я выполнил этот заказ"}
                            </WOPrimary>
                          )}
                        </div>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                            }}
                          >
                            <CommentToggle onClick={() => closeComment(row.id)}>
                              <span>Комментарии</span>
                              <MessageSquare />
                            </CommentToggle>

                            <WOGhost
                              type="button"
                              onClick={() =>
                                (window.location.href = `/worker/order/${row.id}`)
                              }
                            >
                              Позвонить <Phone size={16} />
                            </WOGhost>

                            {/* 🔹 Завершить (доступно в статусе PROGRESS) */}
                            {row.status === "PROGRESS" && (
                              <WOPrimary
                                style={{ maxWidth: "max-content" }}
                                type="button"
                                onClick={() => openFinishModal(row.id)}
                                title="Я выполнил этот заказ"
                                disabled={isFinishing}
                              >
                                {isFinishing && finishTargetId === row.id
                                  ? "…"
                                  : "Я выполнил этот заказ"}
                              </WOPrimary>
                            )}
                          </div>

                          <CommentForm>
                            {/* список комментариев + кнопки Ответить */}
                            <CommentsThread
                              comments={row.comments ?? []}
                              onReply={(t) => setReplyTarget(row.id, t)}
                            />

                            {/* бар реплая как в ТГ */}
                            <ReplyBar
                              target={ui.replyTarget ?? null}
                              onClear={() => clearReplyTarget(row.id)}
                            />

                            {/* ⬇️ textarea и действия показываем ТОЛЬКО когда выбран реплай */}

                            <>
                              {ui.replyTarget && (
                                <textarea
                                  placeholder="Напишите ответ…"
                                  value={ui.text}
                                  onChange={(e) =>
                                    changeText(row.id, e.target.value)
                                  }
                                />
                              )}
                              <div className="actions">
                                {ui.replyTarget && (
                                  <button
                                    className="save"
                                    disabled={isReplying}
                                    onClick={() => saveComment(row.id)}
                                  >
                                    {isReplying ? "Отправка..." : "Сохранить"}
                                  </button>
                                )}
                                <button
                                  className="cancel"
                                  onClick={() => closeComment(row.id)}
                                >
                                  Отменить
                                </button>
                              </div>
                            </>
                          </CommentForm>
                        </>
                      )}
                    </CommentBlock>
                  </WOMid>

                  <WORight>
                    {/* Кнопку "Принять" показываем ТОЛЬКО когда можно принять */}
                    {row.status === "NEW" && !isAccepting && !isRejecting && (
                      <WOPrimary
                        type="button"
                        onClick={() => accept(row.id)}
                        title="Принять заказ"
                      >
                        {isAccepting ? "…" : "Принять"}
                      </WOPrimary>
                    )}

                    {/* Кнопку "Отклонить" показываем ТОЛЬКО когда можно отклонить */}
                    {row.status === "NEW" && !isRejecting && !isAccepting && (
                      <WODanger
                        type="button"
                        onClick={() => reject(row.id)}
                        title="Отклонить заказ"
                      >
                        {isRejecting ? "…" : "Отклонить"}
                      </WODanger>
                    )}
                  </WORight>
                </div>
              </WOCard>
            );
          })}
        </WOList>
      )}

<Modal
  open={finishModalOpen}
  onClose={closeFinishModal}
  title="Завершить заказ?"
  width={520}
  ariaLabel="Подтверждение завершения заказа"
>
  <div style={{ display: "grid", gap: 12 }}>
    {!selectedOrder ? (
      <div style={{ color: "#9ca3af" }}>Заказ не найден.</div>
    ) : (
      <>
        {/* — верх: ФИО + статус — */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "grid", gap: 2 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {fio(selectedOrder.client?.user)}
            </div>
            <div style={{ color: "#6b7280", fontSize: 13 }}>
              {formatPhone(selectedOrder.client?.user?.phone)}
            </div>
          </div>
          <WOStatus $tone={statusTone(selectedOrder.status)}>
            {statusLabel(selectedOrder.status)}
          </WOStatus>
        </div>

   {/* — мета: срок/бюджет/адрес (compact) — */}
<div
  style={{
    display: "grid",
    gap: 6,              // было 10
    padding: 8,          // было 12
    borderRadius: 10,    // было 12
    background: "#f1f4f9",
  }}
>
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <CalendarDays size={14} /> {/* было 16 */}
    <div>
      <div style={{ fontSize: 11, color: "#6b7280" }}>Срок</div>   {/* было 12 */}
      <div style={{ fontWeight: 600, fontSize: 12 }}>
        {dayjs(selectedOrder.deadline).format("DD.MM.YYYY")}
      </div>
    </div>
  </div>

  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <Wallet size={14} />
    <div>
      <div style={{ fontSize: 11, color: "#6b7280" }}>Бюджет</div>
      <div style={{ fontWeight: 600, fontSize: 12 }}>
        {fmtMoney(selectedOrder.budget)}
      </div>
    </div>
  </div>

  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <MapPin size={14} />
    <div>
      <div style={{ fontSize: 11, color: "#6b7280" }}>Адрес</div>
      <div style={{ fontWeight: 600, fontSize: 12 }}>
        {selectedAddr || "—"}
      </div>
    </div>
  </div>
</div>


        {/* — описание — */}
        {selectedOrder.description && (
          <div
            style={{
              padding: 12,
              border: "1px dashed #e5e7eb",
              borderRadius: 12,
              background: "#fff",
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
              Описание
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {selectedOrder.description}
            </div>
          </div>
        )}

        {/* ============ НОВОЕ: ЗАГРУЗКА ДОКАЗАТЕЛЬСТВ ============ */}
        <div
          style={{
            display: "grid",
            gap: 8,
            padding: 12,
            borderRadius: 12,
          }}
        >
      
          {/* Подаём orderId из выбранного заказа */}
          <OrderEvidenceUploader
  orderId={selectedOrder.id}
  onUploaded={handleEvidenceUploaded}
/>
        </div>
        {/* ======================================================== */}

        {/* опциональный счётчик комментариев */}
{/* Прикреплённые материалы */}
<div
  style={{
    display: "grid",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    background: "#fff",
    border: "1px solid #e5e7eb",
    overflow: 'hidden',
    height: 180
  }}
>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ fontSize: 12, color: "#6b7280" }}>Прикреплённые материалы</div>
    <div style={{ fontSize: 12 }}>
      Всего: <strong>{selectedOrder.files?.length ?? 0}</strong> / минимум: <strong>3</strong>
    </div>
  </div>

  {!selectedOrder.files?.length ? (
    <div style={{ color: "#9ca3af", fontSize: 13 }}>Файлы пока не загружены.</div>
  ) : (
    // 🔹 контейнер-скролл
    <div style={{minHeight: 260, overflow: "auto", paddingRight: 2 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
          gap: 8,
        }}
      >
        {selectedOrder.files.map((fid) => {
          const url = buildOrderFileUrl(fid);
          const video = isVideoName(fid);
          return (
            <div
              key={fid}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                overflow: "hidden",
                background: "#f9fafb",
              }}
            >
              {video ? (
                <video
                  src={url}
                  controls
                  style={{ width: "100%", height: 96, objectFit: "cover", display: "block" }}
                />
              ) : (
                <img
                  src={url}
                  alt={fid}
                  style={{ width: "100%", height: 96, objectFit: "cover", display: "block" }}
                  loading="lazy"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  )}

  {(selectedOrder.files?.length ?? 0) < 3 && (
    <div
      style={{
        marginTop: 4,
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        padding: 8,
        borderRadius: 8,
        fontSize: 12,
      }}
    >
      Для подтверждения завершения загрузите минимум 3 файла.
    </div>
  )}
</div>


    
      </>
    )}
  </div>

  {/* футер */}
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 16,
    }}
  >
    <button
      type="button"
      onClick={closeFinishModal}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      Отмена
    </button>
    <button
  type="button"
  onClick={confirmFinish}
  disabled={isFinishing || !finishTargetId || !canFinish}
  style={{
    padding: "10px 14px",
    borderRadius: 10,
    background: canFinish ? "#2f6bff" : "#94a3b8",
    color: "#fff",
    border: `1px solid ${canFinish ? "#2f6bff" : "#94a3b8"}`,
    cursor: canFinish ? "pointer" : "not-allowed",
  }}
  title={
    !selectedOrder
      ? "Заказ не найден"
      : canFinish
      ? "Подтвердить завершение"
      : "Нужно минимум 3 файла"
  }
>
  {isFinishing ? "Завершаем…" : "Да, завершить"}
</button>
  </div>
</Modal>
    </WOPage>
  );
}
