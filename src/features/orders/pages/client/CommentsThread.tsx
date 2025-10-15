import styled from "@emotion/styled";
import dayjs from "dayjs";
import { Star } from "lucide-react";

type CommentItem = {
  id: string;
  text: string | null;       // текст клиента
  rating: number | null;     // 1..5
  feedback: string | null;   // ответ мастера (реплай)
  createdAt: string;         // ISO (время комментария клиента)
};

export const CommentsThread: React.FC<{ comments: CommentItem[] }> = ({ comments }) => {
  if (!comments?.length) return null;

  return (
    <Wrap role="log" aria-label="Комментарии">
      <Title>Комментарии</Title>
      <List>
        {comments.map((c) => {
          const when = dayjs(c.createdAt).format("DD.MM.YYYY HH:mm");
          return (
            <Item key={c.id}>
              {/* Сообщение клиента (слева) */}
              <Bubble $side="left">
                <Meta>
                  <span className="who">Клиент</span>
                  <span className="dot">•</span>
                  <time dateTime={c.createdAt}>{when}</time>
                </Meta>

                {!!c.rating && (
                  <Stars aria-label={`Оценка ${c.rating} из 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        style={{
                          fill: i < (c.rating ?? 0) ? "currentColor" : "transparent",
                          marginRight: 2,
                        }}
                      />
                    ))}
                    <b style={{ marginLeft: 6 }}>{c.rating}/5</b>
                  </Stars>
                )}

                <Msg>{c.text || "—"}</Msg>
              </Bubble>

              {/* Ответ мастера (как reply в ТГ, справа) */}
              {c.feedback && (
                <Bubble $side="right">
                  <ReplyPreview aria-label="В ответ на сообщение клиента">
                    <Bar />
                    <div className="body">
                      <div className="name">Клиент</div>
                      <div className="quote">{truncate(c.text || "—", 160)}</div>
                    </div>
                  </ReplyPreview>

                  <Meta>
                    <span className="who">Мастер</span>
                    <span className="dot">•</span>
                    <time dateTime={c.createdAt}>{when}</time>
                  </Meta>

                  <Msg>{c.feedback}</Msg>
                </Bubble>
              )}
            </Item>
          );
        })}
      </List>
    </Wrap>
  );
};

function truncate(s: string, n = 120) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

/* ===== Styles ===== */

const Wrap = styled.section`
  margin-top: 10px;
  padding: 10px;
  border-radius: 14px;
  background: #f1f4f9;
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 14px;
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
  max-width: 720px;
  margin-left: ${({ $side }) => ($side === "left" ? "0" : "auto")};
  background: ${({ $side }) => ($side === "left" ? "#ffffff" : "#2f6bff")};
  color: ${({ $side }) => ($side === "left" ? "#0f172a" : "#ffffff")};
  border-radius: 14px;
  padding: 10px 12px;
  display: grid;
  gap: 6px;
`;

const Meta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.75;
  .who { font-weight: 800; }
  .dot { opacity: .5; }
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

/* Telegram-like reply block */
const ReplyPreview = styled.div`
  display: grid;
  grid-template-columns: 3px 1fr;
  gap: 8px;
  background: rgba(255,255,255,.18);
  border: 1px solid rgba(231,236,243,.35);
  border-radius: 10px;
  padding: 8px 10px;
  margin-bottom: 4px;

  .body { display: grid; gap: 2px; }
  .name {
    font-size: 12px;
    font-weight: 700;
    color: #e0e7ff; /* нежно, как в ТГ в синем баббле */
  }
  .quote {
    font-size: 12px;
    color: #e6eefc;
    opacity: .9;
  }
`;

const Bar = styled.i`
  display: block;
  width: 3px;
  border-radius: 3px;
  background: #93c5fd; /* голубая вертикальная полоска как в ТГ */
`;
