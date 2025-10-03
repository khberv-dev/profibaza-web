import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { MapPin, CalendarDays, Phone, User2, Wallet } from "lucide-react";
import {
    WOPage, WOToolbar, WOTitle, WOSub, WOList,
    WOCard, WOLeft, WOAvatar, WOMid, WOHead, WOName, WOSubline,
    WOChips, WOStatus, WOMeta, WODivider, WODesc, WORight,
    WOGhost, WOPrimary, WODanger, WOEmpty, WOSkel
  } from "./worker-new-orders.style";
import { getWorkerNewOrders, WorkerNewOrder } from "../../../../shared/endpoints/worker";



/** ---- API (замените на ваш импорт, если уже есть) ---- */
type WorkerUser = { surname?: string; name?: string; phone?: string; avatar?: string | null };
type WorkerOrder = {
  id: string;
  deadline: string;
  description: string;
  status: "NEW" | "ACCEPTED" | "IN_PROGRESS" | "DONE" | "REJECTED";
  budget: number | null;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  client?: { user?: WorkerUser } | null;
};


const fmtMoney = (n?: number | null) =>
  typeof n === "number" ? n.toLocaleString("ru-RU") + " сум" : "—";

const initials = (u?: { name?: string; surname?: string }) =>
  ((u?.surname?.[0] ?? "") + (u?.name?.[0] ?? "")).toUpperCase() || "C";

const fio = (u?: { name?: string; surname?: string; middleName?: string | null }) =>
  [u?.surname, u?.name].filter(Boolean).join(" ") || "Клиент";

const statusTone = (s: WorkerOrder["status"]): "blue"|"green"|"amber"|"gray"|"red" => {
    switch (s) {
      case "NEW": return "blue";
      case "ACCEPTED": return "green";
      case "IN_PROGRESS": return "amber";
      case "DONE": return "gray";
      case "REJECTED": return "red";
      default: return "gray";
    }
  };
  const statusLabel = (s: WorkerOrder["status"]) =>
    s === "NEW" ? "Новый" :
    s === "ACCEPTED" ? "Принят" :
    s === "IN_PROGRESS" ? "В работе" :
    s === "DONE" ? "Завершён" : "Отклонён";
export default function NewWorkerOrdersPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["worker", "new-orders"],
    queryFn: ({ signal }) => getWorkerNewOrders(signal),
    staleTime: 60_000,
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
      <WOList><WOSkel /><WOSkel /><WOSkel /></WOList>
    ) : !data.length ? (
      <WOEmpty>Пока пусто. Как только появятся заявки — вы увидите их здесь.</WOEmpty>
    ) : (
      <WOList>
        {data.map((row) => {
          const u = row.client?.user;
          const avatar = u?.avatar ? `https://pointer.uz/public/avatar/${u.avatar}` : null;
          const addr = [row.address1, row.address2, row.address3].filter(Boolean).join(", ");
          const tone = statusTone(row.status);

          return (
            <WOCard key={row.id} role="article" aria-label={`Заказ от ${fio(u)}`}>
              <WOLeft>
                <WOAvatar $src={avatar}>{!avatar && initials(u)}</WOAvatar>
              </WOLeft>

              <WOMid>
                <WOHead>
                  <div>
                    <WOName>{fio(u)}</WOName>
                    <WOSubline>{u?.phone ? `+${u.phone}` : "Телефон не указан"}</WOSubline>
                  </div>
                  <WOChips>
                    <WOStatus $tone={tone}>{statusLabel(row.status)}</WOStatus>
                  </WOChips>
                </WOHead>

                <WOMeta>
                  <li><CalendarDays size={16} /><span className="k">Срок:</span><span className="v">{dayjs(row.deadline).format("DD.MM.YYYY")}</span></li>
                  <li><Wallet        size={16} /><span className="k">Бюджет:</span><span className="v">{fmtMoney(row.budget)}</span></li>
                  <li><MapPin        size={16} /><span className="k">Адрес:</span><span className="v">{addr || "—"}</span></li>
                </WOMeta>

                <WODivider />
                <WODesc>{row.description}</WODesc>
              </WOMid>

              <WORight>
                <WOGhost  type="button" onClick={() => (window.location.href = `/worker/order/${row.id}`)}>Подробнее</WOGhost>
                <WOPrimary type="button" onClick={() => console.log("accept", row.id)}>Принять</WOPrimary>
                <WODanger type="button" onClick={() => console.log("reject", row.id)}>Отклонить</WODanger>
              </WORight>
            </WOCard>
          );
        })}
      </WOList>
    )}
  </WOPage>
  );
}
