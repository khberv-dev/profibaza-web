import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import styled from "@emotion/styled";
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
  getLegalOrders,
  postLegalComment,
} from "../../../../shared/endpoints/legal-orders";
import { Modal } from "../../../../components/modal/Modal";
import { CommentsThread } from "./CommentsThread";

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
export default function LegalOrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<LegalOrder[]>({
    queryKey: ["legal", "orders"],
    queryFn: ({ signal }) => getLegalOrders(signal),
    staleTime: 60_000,
  });

  const total = orders.length;

  return (
    <Wrap>
      <Toolbar>
        <Title>Мои заявки</Title>
        <Counter>{isLoading ? "Загружаем…" : `Всего: ${total}`}</Counter>
      </Toolbar>

      {isError && (
        <SoftBanner>
          Не удалось загрузить заявки.{" "}
          <button onClick={() => refetch()}>Повторить</button>
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
          <h3>Заявок пока нет</h3>
          <p>Создайте первую — мастер быстро откликнется.</p>
          <CreateBtn
            onClick={() => (window.location.href = "/legal/create-order")}
          >
            Создать заявку
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
  const avatarSrc = u?.avatar
    ? `https://pointer.uz/public/avatar/${u.avatar}`
    : null;
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
      postLegalComment(order.id, payload),
    onSuccess: async () => {
      setRateOpen(false);
      setRate(0);
      setComment("");

      await qc.invalidateQueries({ queryKey: ["legal", "orders"] });
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
      <Left>
        <Avatar $src={avatarSrc}>
          {!avatarSrc ? u ? initials(u) : <User size={18} /> : null}
        </Avatar>
      </Left>

      <Mid>
        <Head>
          <div>
            <Name>{fio(u)}</Name>
            <Sub>
              {createdAgo ? `создана ${createdAgo}` : null}
              {createdAgo && deadline ? " • " : ""}
              {deadline ? `срок до ${deadline}` : ""}
            </Sub>
          </div>
          <Status $tone={s.tone}>{s.text}</Status>
        </Head>

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
          {tel && (
            <Ghost as="a" title={`Позвонить ${fio(u)}`}>
              <Phone size={16} />
              Позвонить
            </Ghost>
          )}


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
      </Mid>


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
          const url = `https://pointer.uz/public/order/${fid}`;
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
              width: "450px",
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

/* ================= Styles ================= */
const Wrap = styled.div`
  padding: 20px 16px 32px;
  display: grid;
  gap: 16px;
`;


const FilesWrap = styled.div`
  /* вертикальный скролл внутри модала */
  max-height: min(70vh, 560px);
  overflow: auto;
  padding-right: 4px;
`;

const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 10px;
`;

const FileCard = styled.div`
  position: relative;
  border: 1px solid #e7ecf3;
  border-radius: 10px;
  background: #f9fbff;
  padding: 8px;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 6px;
  min-height: 120px;

  a {
    display: block;
    border-radius: 8px;
    overflow: hidden;
    line-height: 0;
    background: #eef2ff;
  }
`;

const FileName = styled.div`
  font-size: 11px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyFiles = styled.div`
  padding: 20px 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  color: #64748b;
  background: #fafafa;
  text-align: center;
  font-size: 14px;
`;


const Toolbar = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
`;
const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  color: #0f172a;
`;
const Counter = styled.span`
  color: #667085;
  font-size: 13px;
`;
const SoftBanner = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #ffe8cc;
  background: #fff7ed;
  color: #92400e;
  font-size: 14px;
  button {
    margin-left: 8px;
    border: 0;
    background: transparent;
    color: #7c3aed;
    cursor: pointer;
  }
`;

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Card = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 24px;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e7effc;
  box-shadow: 0 6px 18px rgba(2, 32, 71, 0.05);
  transition: box-shadow 0.2s ease, transform 0.1s ease;
  &:hover {
    box-shadow: 0 12px 28px rgba(2, 32, 71, 0.08);
    transform: translateY(-1px);
  }
`;

const Left = styled.div`
  display: grid;
  align-content: start;
`;

const Avatar = styled.div<{ $src?: string | null }>`
  width: 96px;
  height: 96px;
  border-radius: 24px;
  background: ${({ $src }) =>
    $src
      ? `url(${$src}) center/cover no-repeat`
      : "linear-gradient(180deg,#eef2ff,#f8fafc)"};
  border: 1px solid #e7ecf3;
  display: grid;
  place-items: center;
  font-weight: 900;
  color: #1e40af;
  font-size: 18px;
`;

const Mid = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  @media (max-width: 520px) {
    flex-direction: column;
    gap: 6px;
  }
`;
const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #12284a;
`;
const Sub = styled.div`
  font-size: 13px;
  color: #6b7a90;
  margin-top: 2px;
`;

export const Status = styled.span<{
  $tone: "blue" | "green" | "amber" | "gray" | "red";
}>`
  /* ==== дефолт (blue) переменные тона ==== */
  --c: #0b3b8f;
  --bg1: #f5f9ff;
  --bg2: #ecf3ff;
  --bd: #dbeafe;
  --halo: 37, 99, 235; /* для теней rgba */

  /* переопределяем по $tone */
  ${({ $tone }) =>
    $tone === "green"
      ? `
      --c:#14532d; --bg1:#f3fcf7; --bg2:#e8fbf2; --bd:#a7f3d0; --halo:20,83,45;
    `
      : $tone === "amber"
      ? `
      --c:#92400e; --bg1:#fff8ef; --bg2:#fff3e3; --bd:#fed7aa; --halo:146,64,14;
    `
      : $tone === "gray"
      ? `
      --c:#475467; --bg1:#f7f8fa; --bg2:#f2f4f7; --bd:#e7ecf3; --halo:71,84,103;
    `
      : $tone === "red"
      ? `
      --c:#991b1b; --bg1:#fff5f5; --bg2:#feecec; --bd:#fecaca; --halo:153,27,27;
    `
      : ""}

  display: inline-grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 8px;

  height: 26px;
  padding: 0 12px;
  border-radius: 999px;

  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: var(--c);

  background: linear-gradient(180deg, var(--bg1), var(--bg2));

  position: relative;
  transform: translateZ(0); /* для чёткой рендерной */

  /* маленькая точка-индикатор слева */
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--c);
    box-shadow: 0 0 0 3px rgba(var(--halo), 0.12);
  }
`;
const Desc = styled.p`
  margin: 6px 0 0;
  color: #1f2937;
  background: #f1f4f9;
  border-radius: 12px;
  box-sizing: border-box;
  display: inline-block;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.55;
`;

const Meta = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px 16px;
  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #6b7a90;
  }
  .k {
    color: #7b8ba5;
  }
  .v {
    color: #12284a;
    font-weight: 500;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 2px;
`;
const Btn = styled.button`
  height: 36px;
  font-size: 13px;
  padding: 0 14px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.06s ease;
  &:hover {
    box-shadow: 0 8px 20px rgba(2, 32, 71, 0.08);
  }
  &:active {
    transform: translateY(1px);
  }
`;
const Primary = styled(Btn)`
  border: 1px solid #2f6bff;
  background: #2f6bff;
  color: #fff;
`;
const Ghost = styled(Btn)`
  border: 1px solid #e7ecf3;
  min-height: 42px;
  font-size: 15px;
  line-height: 1.25;
  background: #fff;
  color: #0f172a;
  text-decoration: none;
`;

const Empty = styled.div`
  margin: 24px 0;
  padding: 28px;
  border-radius: 16px;
  border: 1px dashed #dbeafe;
  background: #f8fbff;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 8px;
  color: #0f172a;
  .ico {
    color: #2563eb;
  }
  h3 {
    margin: 8px 0 0;
  }
  p {
    margin: 0;
    color: #6b7a90;
  }
`;
const CreateBtn = styled.button`
  margin-top: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #2f6bff;
  background: #2f6bff;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
`;

const CardSkeleton = () => (
  <SkeletonCard>
    <div className="a" />
    <div className="b">
      <div className="l1" />
      <div className="l2" />
      <div className="l3" />
    </div>
  </SkeletonCard>
);
const SkeletonCard = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 14px;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e7effc;
  overflow: hidden;
  .a {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(90deg, #f3f4f6, #eef2ff, #f3f4f6);
    animation: sh 1.3s infinite;
  }
  .b {
    display: grid;
    gap: 10px;
  }
  .l1,
  .l2,
  .l3 {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f3f4f6, #eef2ff, #f3f4f6);
    animation: sh 1.3s infinite;
  }
  .l2 {
    width: 70%;
  }
  .l3 {
    width: 50%;
  }
  @keyframes sh {
    0% {
      background-position: -120px 0;
    }
    100% {
      background-position: 120px 0;
    }
  }
`;

const ModalScroll = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* ключевые ограничения */
  max-height: min(70vh, 560px);
  overflow: auto;

  /* важно для корректной работы flex + overflow */
  min-height: 0;
`;

// ==== Комментарии / рейтинг ====
const CommentBlock = styled.div`
  margin-top: 10px;
  border-radius: 8px;
`;

const CommentToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 600;
  background: #f1f4f9;
  border: none;
  color: #111827;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const CommentForm = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px 10px;

  textarea {
    width: 100%;
    min-height: 96px;
    border-radius: 12px;
    border: 1px solid #d1d5db;
    padding: 10px 12px;
    resize: vertical;
    font-size: 14px;
    color: #0f172a;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      border-color: #c7ced6;
    }
    &:focus,
    &:focus-visible {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 10px;

    button {
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 14px;
      cursor: pointer;
    }
    .save {
      background: #2563eb;
      color: #fff;
      border: none;
    }
    .cancel {
      background: #fff;
      border: 1px solid #d1d5db;
    }
  }
`;

const StarsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StarBtn = styled.button`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9aa5b2; /* неактивная */
  transition: color 0.12s ease, transform 0.12s ease;

  &[data-active="true"] {
    color: #f59e0b;
  } /* активная (amber) */
  svg {
    width: 20px;
    height: 20px;
  }
  &:active {
    transform: scale(0.96);
  }
`;
