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
import { Modal } from "../../../../components/modal/Modal";
import { CommentsThread } from "./CommentsThread";
import { useOrderLabels } from "../../../../shared/i18n/useOrderLabels";
import { OrderAvatar } from "../../../../components/OrderAvatar";
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

/* ================ Page ================ */
export default function ClientOrdersPage() {
  const labels = useOrderLabels();
  const { t } = labels;
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<ClientOrder[]>({
    queryKey: ["client", "orders"],
    queryFn: ({ signal }) => getClientOrders(signal),
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
          <p>{t("orders.clientEmptyHint")}</p>
        </Empty>
      ) : (
        <List>
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              labels={labels}
            />
          ))}
        </List>
      )}
    </Wrap>
  );
}

/* ================ Item ================ */
type OrderLabels = ReturnType<typeof useOrderLabels>;

const OrderCard: React.FC<{ order: ClientOrder; labels: OrderLabels }> = ({
  order,
  labels,
}) => {
  const { t, fmtMoney, fio, fmtDate, fmtFromNow, getStatus, initials, dash } =
    labels;
  const [open, setOpen] = useState(false);

  const RatingIcon: React.FC<{ rating: number }> = ({ rating }) => {
    if (rating >= 4) return <Smile size={16} />;
    if (rating === 3) return <Meh size={16} />;
    if (rating >= 1) return <Frown size={16} />;
    return <MessageSquare size={16} />; // без оценки
  };
  const getStatusView = (status?: string) => getStatus(status);

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
      postClientComment(order.id, payload),
    onSuccess: async () => {
      setRateOpen(false);
      setRate(0);
      setComment("");

      await qc.invalidateQueries({ queryKey: ["client", "orders"] });
    },
    onError: () => {
      alert(t("orders.reviewSendFailed"));
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
  const telHref = tel ? `tel:${tel}` : "";

  return (
    <Card role="article" aria-label={t("orders.cardAria", { id: order.id })}>
      <CardHead>
        <OrderAvatar
          size="compact"
          fileId={u?.avatar}
          initials={u ? initials(u) : <User size={16} />}
        />
        <CardHeadMain>
          <CardHeadTop>
            <Name>{fio(u)}</Name>
            <Status $tone={s.tone}>{s.text}</Status>
          </CardHeadTop>
          <Sub>
            {createdAgo ? t("orders.metaCreatedAgo", { ago: createdAgo }) : null}
            {createdAgo && deadline ? " • " : ""}
            {deadline ? t("orders.metaDeadlineUntil", { date: deadline }) : ""}
          </Sub>
        </CardHeadMain>
      </CardHead>

      <CardBody>
        <Meta>
          <li>
            <CalendarDays size={16} />{" "}
            <span className="k">{t("orders.fieldDeadline")}</span>
            <span className="v">{deadline}</span>
          </li>
          <li>
            <Clock size={16} /> <span className="k">{t("orders.fieldCreated")}</span>
            <span className="v">
              {dayjs(order.createdAt).format("DD.MM.YYYY HH:mm")}
            </span>
          </li>
          <li>
            <MapPin size={16} /> <span className="k">{t("orders.fieldAddress")}</span>
            <span className="v">{fullAddress || dash}</span>
          </li>
          <li>
            <BadgeCheck size={16} />{" "}
            <span className="k">{t("orders.fieldWorkerRates")}</span>
            <span className="v">{price}</span>
          </li>
        </Meta>

        <Desc title={order.description}>{order.description}</Desc>

        <Actions>
          {telHref && (
            <Ghost
              type="button"
              onClick={() => {
                window.location.href = telHref;
              }}
              title={t("orders.callNamed", { name: fio(u) })}
            >
              <Phone size={16} />
              {t("orders.call")}
            </Ghost>
          )}

<Ghost type="button" onClick={() => setFilesOpen(true)} title={t("orders.viewFiles")}>
    <ExternalLink size={16} />
    {t("orders.filesCount", { count: order.files?.length ?? 0 })}
  </Ghost>


          {canRate && (
            <CommentToggle type="button" onClick={() => setOpen((v) => !v)}>
              <span>{open ? t("orders.reviewHide") : t("orders.reviewLeave")}</span>
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

                    <StarsRow aria-label={t("orders.ratingLabel")}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <StarBtn
                          key={n}
                          type="button"
                          data-active={n <= rate}
                          onClick={() => setRate(n)}
                          aria-label={t("orders.starOfFive", { n })}
                          title={t("orders.starOfFive", { n })}
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
                    placeholder={t("orders.reviewPlaceholder")}
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
                      {isPending ? t("orders.sending") : t("orders.send")}
                    </button>
                    <button
                      className="cancel"
                      onClick={() => {
                        setOpen(false);
                        setRate(0);
                        setComment("");
                      }}
                    >
                      {t("orders.cancel")}
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
  title={t("orders.filesTitle")}
  width={720}
  maxWidth="95vw"
  closeOnOverlay
  ariaLabel={t("orders.filesModalAria")}
  footer={
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      <span style={{ fontSize: 12, color: "#6b7280" }}>
        {t("orders.filesTotal")} <b>{order.files?.length ?? 0}</b>
      </span>
      <Ghost type="button" onClick={() => setFilesOpen(false)}>{t("orders.close")}</Ghost>
    </div>
  }
>
  <FilesWrap>
    {!order.files?.length ? (
      <EmptyFiles>
        {t("orders.filesEmpty")}
      </EmptyFiles>
    ) : (
      <FilesGrid>
        {order.files.map((fid) => {
          const url = `https://profibaza.uz/public/orders/${fid}`;
          const isVideo = /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(fid);

          return (
            <FileCard key={fid}>
              <a href={url} target="_blank" rel="noreferrer" title={t("orders.openInNewTab")}>
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
        title={t("orders.reviewModalTitle")}
        width={540}
        maxWidth="92vw"
        closeOnOverlay
        ariaLabel={t("orders.reviewModalTitle")}
        footer={
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Ghost type="button" onClick={() => setRateOpen(false)}>
              {t("common.cancel")}
            </Ghost>
            <Primary
              type="button"
              disabled={isPending || rate < 1}
              onClick={() => sendComment({ rate, comment })}
            >
              {isPending ? t("orders.sending") : t("orders.send")}
            </Primary>
          </div>
        }
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ fontSize: 14, color: "#6b7a90" }}>
            {t("orders.reviewHint")}
          </div>

          {/* Звёзды */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRate(n)}
                aria-label={t("orders.starOfFive", { n })}
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
