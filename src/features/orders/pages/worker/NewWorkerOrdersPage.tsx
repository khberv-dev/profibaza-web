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
} from "./worker-new-orders.style";
import {
  getWorkerNewOrders,
  WorkerNewOrder,
  acceptWorkerOrder,
} from "../../../../shared/endpoints/worker";

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
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["worker", "new-orders"],
    queryFn: ({ signal }) => getWorkerNewOrders(signal),
    staleTime: 60_000,
  });

  const { mutate: accept, isPending: isAccepting } = useMutation({
    mutationFn: (orderId: string) => acceptWorkerOrder(orderId),
    /** оптимистично отмечаем заказ как ACCEPTED */
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["worker", "new-orders"] });
      const prev = queryClient.getQueryData<WorkerNewOrder[]>([
        "worker",
        "new-orders",
      ]);
      queryClient.setQueryData<WorkerNewOrder[]>(
        ["worker", "new-orders"],
        (old = []) =>
          old.map((o) => (o.id === orderId ? { ...o, status: "ACCEPTED" } : o))
      );
      return { prev };
    },
    onError: (_err, _orderId, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(["worker", "new-orders"], ctx.prev);
      alert("Не удалось принять заказ. Попробуйте ещё раз.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["worker", "new-orders"] });
    },
  });

  return (
    <WOPage>
      <WOToolbar>
        <div>
          <WOTitle>Новые заказы</WOTitle>
          <WOSub>Актуальные заявки от клиентов — принимайте подходящие.</WOSub>
        </div>
      </WOToolbar>

      {isLoading ? (
        <WOList>
          <WOSkel />
          <WOSkel />
          <WOSkel />
        </WOList>
      ) : !data.length ? (
        <WOEmpty>
          Пока пусто. Как только появятся заявки — вы увидите их здесь.
        </WOEmpty>
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
            const canAccept = row.status === "NEW" && !isAccepting;

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
                    onClick={() => console.log("reject", row.id)}
                  >
                    Отклонить
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
