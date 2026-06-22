import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import {
  Phone,
  ExternalLink,
  MapPin,
  CalendarDays,
  BadgeCheck,
  Clock,
  User,
  Star,
  MessageSquare,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import {
  ClientOrder,
  getClientOrders,
  postClientComment,
} from "../../../../shared/endpoints/client-orders";
import {
  LegalOrder,
  getInvestorOrders,
  postInvestorComment,
} from "../../../../shared/endpoints/legal-orders";
import { Modal } from "../../../../components/modal/Modal";
import { CommentsThread } from "./CommentsThread";
import { Link } from "react-router-dom";
import { useOrderLabels } from "../../../../shared/i18n/useOrderLabels";
import { OrderAvatar } from "../../../../components/OrderAvatar";
import { orderPublicUrl } from "../../../../shared/lib/public-url";
import {
  Wrap,
  Toolbar,
  Title,
  Counter,
  SoftBanner,
  List,
  Card,
  CardHead,
  CardHeadMain,
  CardHeadTop,
  CardBody,
  Name,
  Sub,
  Status,
  Meta,
  Desc,
  Actions,
  Ghost,
  Primary,
  Empty,
  CreateBtn,
  SkeletonCard,
  FilesWrap,
  FilesGrid,
  FileCard,
  FileName,
  EmptyFiles,
  CommentBlock,
  CommentToggle,
  CommentForm,
  StarsRow,
  StarBtn,
} from "../orders-page.style";

dayjs.extend(relativeTime);
dayjs.locale("ru");

/* ================= Helpers ================= */
const fmtMoney = (n?: number | null) =>
  typeof n === "number" && !Number.isNaN(n)
    ? `${n.toLocaleString("ru-RU")} сум`
    : "—";

const fio = (u?: {
  name?: string;
  surname?: string;
  middleName?: string | null;
}) => [u?.surname, u?.name].filter(Boolean).join(" ") || "Мастер";

const initials = (u?: { name?: string; surname?: string }) =>
  ((u?.surname?.[0] ?? "") + (u?.name?.[0] ?? "")).toUpperCase() || "M";

const fmtDate = (iso?: string | null) =>
  iso ? dayjs(iso).format("DD.MM.YYYY") : "—";

const fmtFromNow = (iso?: string) => (iso ? dayjs(iso).fromNow() : "");

const statusView: Record<
  NonNullable<LegalOrder["status"]>,
  { text: string; tone: "blue" | "green" | "amber" | "gray" | "red" }
> = {
  NEW: { text: "Новая", tone: "blue" },
  PROGRESS: { text: "В работе", tone: "amber" },
  DONE: { text: "Завершено", tone: "green" },
  CANCELLED: { text: "Отменено", tone: "red" },
};

/* ================ Page ================ */
export default function InvestorOrdersPage() {
  const { t } = useOrderLabels();
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<LegalOrder[]>({
    queryKey: ["investor", "orders"],
    queryFn: ({ signal }) => getInvestorOrders(signal),
    staleTime: 60_000,
  });

  const total = orders.length;

  return (
    <Wrap>
      <Toolbar>
        <Title>{t("orders.title")}</Title>
        <Counter>
          {isLoading
            ? t("orders.loading")
            : t("orders.totalCount", { count: total })}
        </Counter>
      </Toolbar>

      {isError && (
        <SoftBanner>
          {t("orders.loadFailed")}{" "}
          <button onClick={() => refetch()}>{t("orders.retry")}</button>
        </SoftBanner>
      )}

      {isLoading ? (
        <List>
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </List>
      ) : !orders.length ? (
        <Empty>
          <div className="ico">
            <BadgeCheck size={34} />
          </div>
          <h3>{t("orders.emptyTitle")}</h3>
          <p>{t("orders.legalEmptyHint")}</p>
          <CreateBtn
            onClick={() => (window.location.href = "/app/client/create-order")}
          >
            {t("orders.createCta")}
          </CreateBtn>
        </Empty>
      ) : (
        <List>
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </List>
      )}
    </Wrap>
  );
}

/* ================ Item ================ */
const OrderCard: React.FC<{ order: ClientOrder }> = ({ order }) => {
  const statusViewMap: Record<
    string,
    { text: string; tone: "blue" | "green" | "amber" | "gray" | "red" }
  > = {
    NEW: { text: "Новая", tone: "blue" },
    PROGRESS: { text: "В работе", tone: "amber" },
    DONE: { text: "Завершено", tone: "green" },
    CANCELLED: { text: "Отменено", tone: "red" },
    ACCEPTED: { text: "Принята", tone: "green" },
    REJECTED: { text: "Отклонено", tone: "red" },
  };
  const [open, setOpen] = useState(false);

  const RatingIcon: React.FC<{ rating: number }> = ({ rating }) => {
    if (rating >= 4) return <Smile size={16} />;
    if (rating === 3) return <Meh size={16} />;
    if (rating >= 1) return <Frown size={16} />;
    return <MessageSquare size={16} />; // без оценки
  };
  const getStatusView = (status?: string) =>
    statusViewMap[status ?? ""] ?? {
      text: status ?? "—",
      tone: "gray" as const,
    };

  const u = order.workerProfession?.worker?.user;
  const s = getStatusView(order.status);
  const deadline = fmtDate(order.deadline);
  const createdAgo = fmtFromNow(order.createdAt);
  const [isFilesOpen, setFilesOpen] = useState(false);
  const [isRateOpen, setRateOpen] = useState(false);
  const [rate, setRate] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const qc = useQueryClient();
  const { mutate: sendComment, isPending } = useMutation({
    mutationFn: (payload: { rate: number; comment: string }) =>
        postInvestorComment(order.id, payload),
    onSuccess: async () => {
      setRateOpen(false);
      setRate(0);
      setComment("");

      await qc.invalidateQueries({ queryKey: ["investor", "orders"] });
    },
    onError: () => {
      alert("Не удалось отправить отзыв. Попробуйте ещё раз.");
    },
  });

  const canRate = order.status === "PROGRESS" || "DONE";

  const price = order.workerProfession
    ? `${fmtMoney(order.workerProfession.minPrice)} — ${fmtMoney(
        order.workerProfession.maxPrice
      )}`
    : fmtMoney(order.budget);

  const fullAddress = useMemo(
    () =>
      [order.address1, order.address2, order.address3]
        .filter(Boolean)
        .join(", "),
    [order.address1, order.address2, order.address3]
  );

  const tel = u?.phone ? `+${u.phone.replace(/[^\d]/g, "")}` : null;

  return (
    <Card role="article" aria-label={`Заявка ${order.id}`}>
      <CardHead>
        <OrderAvatar
          size="compact"
          fileId={u?.avatar}
          initials={u ? initials(u) : <User size={16} />}
        />
        <CardHeadMain>
          <CardHeadTop>
            <Link to='/find/worker/ab6b81e9-32c0-4bb7-a4e4-3ea9be0ad148'>
              <Name>{fio(u)}</Name>
            </Link>
            <Status $tone={s.tone}>{s.text}</Status>
          </CardHeadTop>
          <Sub>
            {createdAgo ? `создана ${createdAgo}` : null}
            {createdAgo && deadline ? " • " : ""}
            {deadline ? `срок до ${deadline}` : ""}
          </Sub>
        </CardHeadMain>
      </CardHead>

      <CardBody>
        <Meta>
          <li>
            <CalendarDays size={16} /> <span className="k">Дедлайн:</span>
            <span className="v">{deadline}</span>
          </li>
          <li>
            <Clock size={16} /> <span className="k">Создана:</span>
            <span className="v">
              {dayjs(order.createdAt).format("DD.MM.YYYY HH:mm")}
            </span>
          </li>
          <li>
            <MapPin size={16} /> <span className="k">Адрес:</span>
            <span className="v">{fullAddress || "—"}</span>
          </li>
          <li>
            <BadgeCheck size={16} /> <span className="k">Ставки мастера:</span>
            <span className="v">{price}</span>
          </li>
        </Meta>

        <Desc title={order.description}>{order.description}</Desc>

        <Actions>



<Ghost type="button" onClick={() => setFilesOpen(true)} title="Посмотреть файлы">
    <ExternalLink size={16} />
    Файлы ({order.files?.length ?? 0})
  </Ghost>

          {canRate && (
            <CommentToggle type="button" onClick={() => setOpen((v) => !v)}>
              <span>{open ? "Скрыть отзыв" : "Оставить отзыв"}</span>
              <RatingIcon rating={rate} />
            </CommentToggle>
          )}
        </Actions>

        {canRate && (
          <CommentBlock>
            {open && (
              <div>
                <CommentsThread comments={order.comments ?? []} />

                <CommentForm>
                  {/* Рейтинг */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color:
                          rate >= 4
                            ? "#10b981"
                            : rate === 3
                            ? "#f59e0b"
                            : rate >= 1
                            ? "#ef4444"
                            : "#9aa5b2",
                      }}
                    >
                      <RatingIcon rating={rate} />
                      {rate > 0 && <b style={{ fontSize: 12 }}>{rate}/5</b>}
                    </span>

                    <StarsRow aria-label="Оценка">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <StarBtn
                          key={n}
                          type="button"
                          data-active={n <= rate}
                          onClick={() => setRate(n)}
                          aria-label={`${n} из 5`}
                          title={`${n} из 5`}
                        >
                          <Star
                            style={{
                              fill: n <= rate ? "currentColor" : "transparent",
                            }}
                          />
                        </StarBtn>
                      ))}
                    </StarsRow>
                  </div>

                  {/* Комментарий */}
                  <textarea
                    placeholder="Zo'r ish, malades…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={400}
                  />

                  <div className="actions">
                    <button
                      className="save"
                      disabled={isPending || rate < 1}
                      onClick={() => sendComment({ rate, comment })}
                    >
                      {isPending ? "Отправляем…" : "Отправить"}
                    </button>
                    <button
                      className="cancel"
                      onClick={() => {
                        setOpen(false);
                        setRate(0);
                        setComment("");
                      }}
                    >
                      Отменить
                    </button>
                  </div>
                </CommentForm>
              </div>
            )}
          </CommentBlock>
        )}
      </CardBody>


      <Modal
  open={isFilesOpen}
  onClose={() => setFilesOpen(false)}
  title="Прикреплённые файлы"
  width={720}
  maxWidth="95vw"
  closeOnOverlay
  ariaLabel="Файлы заявки"
  footer={
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      <span style={{ fontSize: 12, color: "#6b7280" }}>
        Всего: <b>{order.files?.length ?? 0}</b>
      </span>
      <Ghost type="button" onClick={() => setFilesOpen(false)}>Закрыть</Ghost>
    </div>
  }
>
  <FilesWrap>
    {!order.files?.length ? (
      <EmptyFiles>
        Файлы отсутствуют
      </EmptyFiles>
    ) : (
      <FilesGrid>
        {order.files.map((fid) => {
          const url = orderPublicUrl(fid);
          const isVideo = /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(fid);

          return (
            <FileCard key={fid}>
              <a href={url} target="_blank" rel="noreferrer" title="Открыть в новой вкладке">
                {isVideo ? (
                  <video
                    src={url}
                    preload="metadata"
                    controls
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 8 }}
                  />
                ) : (
                  <img
                    src={url}
                    alt={fid}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 8 }}
                  />
                )}
              </a>
              <FileName title={fid}>{fid}</FileName>
            </FileCard>
          );
        })}
      </FilesGrid>
    )}
  </FilesWrap>
</Modal>


      <Modal
        open={isRateOpen}
        onClose={() => setRateOpen(false)}
        title="Оценка работы"
        width={540}
        maxWidth="92vw"
        closeOnOverlay
        ariaLabel="Оценка работы"
        footer={
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Ghost type="button" onClick={() => setRateOpen(false)}>
              Отмена
            </Ghost>
            <Primary
              type="button"
              disabled={isPending || rate < 1}
              onClick={() => sendComment({ rate, comment })}
            >
              {isPending ? "Отправляем…" : "Отправить"}
            </Primary>
          </div>
        }
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ fontSize: 14, color: "#6b7a90" }}>
            Поставьте оценку и оставьте короткий комментарий.
          </div>

          {/* Звёзды */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRate(n)}
                aria-label={`${n} ${n === 1 ? "звезда" : "звезды"}`}
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 10,
                  lineHeight: 0,
                  color: rate >= n ? "#f59e0b" : "#cbd5e1",
                }}
              >
                <Star size={22} />
              </button>
            ))}
          </div>

          {/* Комментарий */}
          <textarea
            placeholder="Zo'r ish, malades…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={400}
            style={{
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              minHeight: 96,
              resize: "vertical",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #e7ecf3",
              fontSize: 14,
              color: "#0f172a",
              outline: "none",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(47,107,255,.12)")
            }
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          />
        </div>
      </Modal>
    </Card>
  );
};


const CardSkeleton = () => (
  <SkeletonCard>
    <div className="head">
      <div className="a" />
      <div className="b">
        <div className="l1" />
        <div className="l2" />
        <div className="l3" />
      </div>
    </div>
  </SkeletonCard>
);
