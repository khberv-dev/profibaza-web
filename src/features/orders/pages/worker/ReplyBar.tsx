// ReplyBar.tsx
import styled from "@emotion/styled";

export type ReplyTarget = { id: string; author: string; text: string | null };

export default function ReplyBar({
  target,
  onClear,
}: {
  target: ReplyTarget | null;
  onClear: () => void;
}) {
  if (!target) return null;
  return (
    <Wrap aria-label={`В ответ ${target.author}`}>
      <Bar />
      <div className="body">
        <div className="name">В ответ {target.author}</div>
        <div className="quote">{truncate(target.text || "—", 160)}</div>
      </div>
      <Close onClick={onClear} aria-label="Отменить ответ">
        ×
      </Close>
    </Wrap>
  );
}

function truncate(s: string, n = 120) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 3px 1fr auto;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #e7ecf3;
  border-radius: 12px;
  padding: 8px 10px;

  .body {
    display: grid;
    gap: 2px;
  }
  .name {
    font-size: 12px;
    font-weight: 700;
    color: #1f2a44;
  }
  .quote {
    font-size: 12px;
    color: #4b5563;
  }
`;
const Bar = styled.i`
  display: block;
  width: 4px;
  height: 100%;
  border-radius: 3px;
  background: #155eef;
`;
const Close = styled.button`
  border: 0;
  background: transparent;
  font-size: 18px;
  line-height: 1;
  color: #64748b;
  cursor: pointer;
  padding: 0 6px;
  &:hover {
    color: #0f172a;
  }
`;
