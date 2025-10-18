// CommentsThread.tsx (добавили onReply и кнопку)
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { Star, CornerUpLeft } from "lucide-react";

export type CommentItem = {
  id: string;
  text: string | null; // текст клиента
  rating: number | null; // 1..5
  feedback: string | null; // ответ мастера
  createdAt: string; // ISO
};

export function CommentsThread({
  comments,
  onReply, // <- NEW
}: {
  comments: CommentItem[];
  onReply?: (t: { id: string; author: string; text: string | null }) => void;
}) {
  if (!comments?.length) return null;

  return (
    <Wrap role="log" aria-label="Комментарии">
      <Title>Комментарии</Title>
      <List>
        {comments.map((c) => {
          const when = dayjs(c.createdAt).format("DD.MM.YYYY HH:mm");
          return (
            <Item key={c.id}>
              {/* Сообщение клиента */}
              <Bubble $side="left">
                <TopRow>
                  <Meta>
                    <span className="who">Клиент</span>
                    <span className="dot">•</span>
                    <time dateTime={c.createdAt}>{when}</time>
                  </Meta>

                  {onReply && !c.feedback && (
                    <ReplyBtn
                      type="button"
                      onClick={() =>
                        onReply({ id: c.id, author: "Клиент", text: c.text })
                      }
                      title="Ответить"
                    >
                      Ответить
                      <img src="/forward.svg" alt="" />
                    </ReplyBtn>
                  )}
                </TopRow>

                {/* {!!c.rating && (
                  <Stars aria-label={`Оценка ${c.rating} из 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        style={{
                          fill:
                            i < (c.rating ?? 0)
                              ? "currentColor"
                              : "transparent",
                          marginRight: 2,
                        }}
                      />
                    ))}
                    <b style={{ marginLeft: 6 }}>{c.rating}/5</b>
                  </Stars>
                )} */}

                <Msg>{c.text || "—"}</Msg>
              </Bubble>

              {/* Если есть ответ мастера — справа */}
              {c.feedback && (
                <Bubble $side="right">
                  <TopRow>
                    <Meta>
                      <span className="who">Вы</span>
                    </Meta>
                  </TopRow>

                  <Msg>{c.feedback}</Msg>
                </Bubble>
              )}
            </Item>
          );
        })}
      </List>
    </Wrap>
  );
}

/* ====== стили коротко (можно оставить ваши прежние) ====== */
const Wrap = styled.section`
  margin-top: 10px;
  // max-width: max-content;
  padding: 18px;
  border-radius: 14px;
  background: #f1f4f9;
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  color: #0f172a;
  margin-bottom: 8px;
`;
const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
`;
const Item = styled.li`
  display: grid;
  gap: 8px;
`;
const Bubble = styled.div<{ $side: "left" | "right" }>`
  --left-bg: #ffffff;
  --left-color: #0f172a;
  --left-border: rgba(15, 23, 42, 0.08);
  --left-shadow: 0 1px 0 rgba(0,0,0,.03);

  --right-bg: #2a6afc;
  --right-grad: linear-gradient(180deg, #2f71ff 0%, #2a6afc 100%);
  --right-color: #ffffff;
  --right-shadow: 0 1px 0 rgba(0,0,0,.1);

  position: relative;
  max-width: min(78vw, 720px);
  margin-left: ${({ $side }) => ($side === "left" ? "0" : "auto")};
  padding: 10px 12px;
  border-radius: 14px;
  display: grid;
  gap: 6px;
  user-select: text;
  word-break: break-word;
  white-space: pre-wrap;

  background: ${({ $side }) =>
    $side === "left" ? "var(--left-bg)" : "var(--right-grad)"};
  color: ${({ $side }) =>
    $side === "left" ? "var(--left-color)" : "var(--right-color)"};

  /* “Хвостики” как в ТГ */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    ${({ $side }) => ($side === "left" ? "left: 0px;" : "right: 0px;")}
    width: 14px;
    height: 14px;
    background: inherit;
    border-bottom-{${
      /* маленький трюк, чтобы Emotion не ругался на raw '-' */ ""
    }${({ $side }) => ($side === "left" ? "left" : "right")}-radius: 10px;
    transform: translateY(2px) rotate(45deg);
  }

  @media (max-width: 520px) {
    max-width: 88vw;
    padding: 9px 11px;
    border-radius: 12px;
  }
`;
const Meta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.75;
  .who {
    font-weight: 600;
  }
  .dot {
    opacity: 0.5;
  }
`;
const Stars = styled.div`
  display: inline-flex;
  align-items: center;
  color: #f59e0b;
`;
const Msg = styled.div`
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
`;
const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
const ReplyBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 10px;
  border: 1px solid #e7ecf3;
  background: #fff;
  color: #0f172a;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  &:hover {
    background: #f8fafc;
  }
`;
