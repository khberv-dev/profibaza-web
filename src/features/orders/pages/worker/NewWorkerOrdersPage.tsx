import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, CalendarDays, Wallet } from "lucide-react";
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
} from "./worker-new-orders.style";
import {
  getWorkerOrders,
  WorkerNewOrder,
  acceptWorkerOrder,
  rejectWorkerOrder,
} from "../../../../shared/endpoints/worker";

const TABS: { key: "ALL" | WorkerNewOrder["status"]; label: string }[] = [
  { key: "ALL", label: "Все" },
  { key: "NEW", label: "Новые" },
  { key: "ACCEPTED", label: "Принятые" },
  { key: "IN_PROGRESS", label: "В работе" },
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
    case "ACCEPTED":
      return "green";
    case "IN_PROGRESS":
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
    : s === "ACCEPTED"
    ? "Принят"
    : s === "IN_PROGRESS"
    ? "В работе"
    : s === "DONE"
    ? "Завершён"
    : "Отклонён";

export default function NewWorkerOrdersPage() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("NEW");
  const queryClient = useQueryClient();

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
            key[2] === "ACCEPTED" ||
            key[2] === "IN_PROGRESS" ||
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
      removeFromSpecificTabAndAddToTarget(orderId, "ACCEPTED", snapshot);
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
                <WOLeft>
                  <WOAvatar $src={avatar}>{!avatar && initials(u)}</WOAvatar>
                </WOLeft>

                <WOMid>
                  <WOHead>
                    <div>
                      <WOName>{fio(u)}</WOName>
                      <WOSubline>
                        {u?.phone ? `+${u.phone}` : "Телефон не указан"}
                      </WOSubline>
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
                      <span className="k">Срок:</span>
                      <span className="v">
                        {dayjs(row.deadline).format("DD.MM.YYYY")}
                      </span>
                    </li>
                    <li>
                      <Wallet size={16} />
                      <span className="k">Бюджет:</span>
                      <span className="v">{fmtMoney(row.budget)}</span>
                    </li>
                    <li>
                      <MapPin size={16} />
                      <span className="k">Адрес:</span>
                      <span className="v">{addr || "—"}</span>
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
                    Подробнее
                  </WOGhost>
                  <WOPrimary
                    type="button"
                    onClick={() => accept(row.id)}
                    disabled={!canAccept}
                    title={canAccept ? "Принять заказ" : "Недоступно"}
                  >
                    {isAccepting ? "…" : "Принять"}
                  </WOPrimary>
                  <WODanger
                    type="button"
                    onClick={() => reject(row.id)}
                    disabled={!canReject}
                    title={canReject ? "Отклонить заказ" : "Недоступно"}
                  >
                    {isRejecting ? "…" : "Отклонить"}
                  </WODanger>
                </WORight>
              </WOCard>
            );
          })}
        </WOList>
      )}
    </WOPage>
  );
}
