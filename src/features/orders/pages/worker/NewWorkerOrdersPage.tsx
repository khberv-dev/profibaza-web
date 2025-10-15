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
} from "../../../../shared/endpoints/worker";
import { CommentsThread } from "../client/CommentsThread";

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

type CommentUIState = Record<
  string,
  { open: boolean; text: string; rating: number }
>;

export default function NewWorkerOrdersPage() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("ALL");
  const queryClient = useQueryClient();
  const [commentUI, setCommentUI] = useState<CommentUIState>({});
  const getUI = (id: string) =>
    commentUI[id] ?? { open: false, text: "", rating: 0 };
  const [refresh, setRefresh] = useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ["worker", "orders", active],
    queryFn: ({ signal }) => getWorkerOrders({ status: active }, signal),
    staleTime: 60_000,
  });

  /** Хелперы оптимистичных апдейтов для всех табов */
  const moveOrderBetweenTabs = (
    orderId: string,
    nextStatus: WorkerNewOrder["status"],
    mutate: (list: WorkerNewOrder[]) => WorkerNewOrder[]
  ) => {
    // Пройдём по всем табам и аккуратно обновим кэш
    const keys = TABS.map((t) => ["worker", "orders", t.key] as const);
    keys.forEach((key) => {
      const prev = queryClient.getQueryData<WorkerNewOrder[]>(key);
      if (!prev) return;
      const isSourceTab =
        key[2] === "ALL" || key[2] === undefined
          ? true
          : key[2] === "NEW" ||
            key[2] === "PROGRESS" ||
            key[2] === "DONE" ||
            key[2] === "REJECTED";

      // Для таба, где элемент сейчас мог быть — меняем/удаляем
      const updated = mutate(prev);
      queryClient.setQueryData<WorkerNewOrder[]>(key, updated);
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

  const setRating = (id: string, rating: number) =>
    setCommentUI((s) => ({ ...s, [id]: { ...getUI(id), rating } }));

  const saveComment = (id: string) => {
    const { text, rating } = getUI(id);
    // TODO: postWorkerOrderComment(id, { text, rating })
    console.log("save", { id, text, rating });
    closeComment(id);
  };

  const RatingIcon = ({ rating }: { rating: number }) => {
    if (rating >= 4) return <Smile size={16} />;
    if (rating === 3) return <Meh size={16} />;
    if (rating >= 1) return <Frown size={16} />;
    return; // без оценки
  };

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
                  </WOMid>

                  <WORight>
                    <WOGhost
                      type="button"
                      onClick={() =>
                        (window.location.href = `/worker/order/${row.id}`)
                      }
                    >
                      Подробнее <img src="/forward.svg" alt="" />
                    </WOGhost>

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

                    <CommentBlock>
                             
                      {!ui.open ? (
                        <CommentToggle onClick={() => openComment(row.id)}>
                          <span>Комментарии</span>
                          <MessageSquare />
                        </CommentToggle>
                      ) : (
                        <CommentForm>
                          {/* Рейтинг */}
                          <CommentsThread
                        comments={row.comments ?? []}
                      />
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                marginLeft: 8,
                                color:
                                  ui.rating >= 4
                                    ? "#10b981" // зелёный
                                    : ui.rating === 3
                                    ? "#f59e0b" // янтарный
                                    : ui.rating >= 1
                                    ? "#ef4444" // красный
                                    : "#9aa5b2", // серый, нет оценки
                              }}
                              title={
                                ui.rating
                                  ? `Оценка: ${ui.rating}/5`
                                  : "Оценка не выбрана"
                              }
                            >
                              <RatingIcon rating={ui.rating} />
                              {ui.rating > 0 && (
                                <span
                                  style={{
                                    marginLeft: 6,
                                    fontSize: 12,
                                    fontWeight: 600,
                                  }}
                                >
                                  {ui.rating}/5
                                </span>
                              )}
                            </span>
                            <StarsRow aria-label="Оценка">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarBtn
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(row.id, star)}
                                  data-active={star <= ui.rating}
                                  aria-label={`${star} из 5`}
                                  title={`${star} из 5`}
                                >
                                  {/* заполняем звезду цветом когда активна */}
                                  <Star
                                    style={{
                                      fill:
                                        star <= ui.rating
                                          ? "currentColor"
                                          : "transparent",
                                    }}
                                  />
                                </StarBtn>
                              ))}
                            </StarsRow>
                          </div>

                          {/* Текст комментария */}
                          <textarea
                            placeholder="Напишите комментарий..."
                            value={ui.text}
                            onChange={(e) => changeText(row.id, e.target.value)}
                          />
                          
                          <div className="actions">
                            <button
                              className="save"
                              onClick={() => saveComment(row.id)}
                            >
                              Сохранить
                            </button>
                            <button
                              className="cancel"
                              onClick={() => closeComment(row.id)}
                            >
                              Отменить
                            </button>
                          </div>
                        </CommentForm>
                      )}
                    </CommentBlock>
                  </WORight>
                </div>
              </WOCard>
            );
          })}
        </WOList>
      )}
    </WOPage>
  );
}
