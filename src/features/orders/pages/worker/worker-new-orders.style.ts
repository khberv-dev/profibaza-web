import styled from "@emotion/styled";

/* Страница */
export const WOPage = styled.div`
  padding: 20px;
`;

/* Верхняя панель */
export const WOToolbar = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;
export const WOTitle = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: #12284a;
  letter-spacing: -0.01em;
`;
export const WOSub = styled.div`
  color: #6b7a90;
  font-size: 13px;
  margin-top: 4px;
`;

/* Список */
export const WOList = styled.div`
  display: grid;
  gap: 12px;
`;

/* Карточка заказа */
export const WOCard = styled.article`
  padding: 20px 22px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e9eef6; /* тонкая светлая рамка */
  box-shadow: 0 1px 0 rgba(16, 24, 40, 0.04),
    /* верхний hairline */ 0 8px 24px rgba(2, 32, 71, 0.05);
  transition: box-shadow 0.2s ease, transform 0.1s ease;

  .inner {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr) 250px;
    grid-template-areas: "left mid right";
    gap: 16px 20px;
  }

  &:hover {
    box-shadow: 0 1px 0 rgba(16, 24, 40, 0.04),
      0 12px 28px rgba(2, 32, 71, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 920px) {
    grid-template-columns: 64px minmax(0, 1fr);
    grid-template-areas:
      "left mid"
      "right right";
    padding: 16px;
  }
`;

/* Левая колонка (аватар) */
export const WOLeft = styled.div`
  grid-area: left;
  display: grid;
  align-content: start;
  justify-items: center; /* чтобы аватар не «лип» к левому краю */
`;
export const WOAvatar = styled.div<{ $src?: string | null }>`
  grid-area: left;
  border-radius: 24px;
  height: 96px;
  width: 96px;
  background: ${({ $src }) =>
    $src
      ? `url(${$src}) center/cover no-repeat`
      : "linear-gradient(180deg,#eef2ff,#f8fafc)"};
  border: 1px solid #e6ebf2;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #95a3b5; /* мягкий серый для инициалов */
  font-size: 32px;
`;

/* Центр */
export const WOMid = styled.div`
  grid-area: mid;
  display: grid;
  gap: 8px;
  min-width: 0; /* важно для ellipsis */
`;
export const WOHead = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  align-items: flex-start;
  @media (max-width: 920px) {
    flex-direction: column;
    gap: 6px;
  }
`;
export const WOName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #0f1f3f; /* темнее, ближе к HH */
  line-height: 1.2;
`;
export const WOSubline = styled.div`
  font-size: 13px;
  color: #7c8aa0;
  margin-top: 6px;
`;

/* Статус/чипсы */
export const WOChips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
export const WOStatus = styled.span<{
  $tone: "blue" | "green" | "amber" | "gray" | "red";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;
  user-select: none;
  transition: all 0.15s ease-in-out;

  ${({ $tone }) =>
    ({
      blue: {
        background: "#e8f1ff",
        color: "#0057d9",
      },
      green: {
        background: "#e6f6ec",
        color: "#218739",
      },
      amber: {
        background: "#fff3e0",
        color: "#b76e00",
      },
      gray: {
        background: "#f3f4f6",
        color: "#4b5563",
      },
      red: {
        background: "#fdeaea",
        color: "#d32f2f",
      },
    }[$tone])};

  /* Эффект HH: лёгкий приподнятый hover */
  &:hover {
    filter: brightness(1.03);
    transform: translateY(-1px);
  }
`;

/* Метаданные */
export const WOMeta = styled.ul`
  display: grid;
  grid-auto-rows: min-content;
  gap: 10px;
  list-style: none;
  margin: 8px 0 0;
  padding: 0;

  li {
    display: grid;
    grid-template-columns: 18px auto; /* ← иконка + текстовая колонка */
    align-items: start;
    column-gap: 10px;
    min-height: 20px;
    color: #334155;
    font-size: 14px;
    line-height: 1.35;
  }

  /* Внутри текстовой колонки: ключ и значение в строку, не ломаются */
  li > div {
    display: inline-flex;
    gap: 6px;
    align-items: baseline;
    min-width: 0; /* ← важно для ellipsis */
    white-space: nowrap;
  }

  .k {
    color: #8a96a8;
    flex: 0 0 auto;
    font-weight: 500;
  }

  .v {
    color: #0f1f3f;
    font-weight: 500;
    flex: 1 1 auto;
    min-width: 0; /* ← чтобы работал ellipsis */
    overflow: hidden;
    text-overflow: ellipsis;
    font-variant-numeric: tabular-nums; /* ровные цифры */
    -moz-font-feature-settings: "tnum" 1;
    -webkit-font-feature-settings: "tnum" 1;
    font-feature-settings: "tnum" 1;
  }

  /* Иконки чуть приглушим */
  svg {
    opacity: 0.75;
  }
`;

export const WODivider = styled.div`
  height: 1px;
  background: #eef2f7;
  margin: 10px 0 0;
`;
export const WODesc = styled.p`
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

/* Правая колонка (кнопки) */
export const WORight = styled.aside`
  grid-area: right;
  display: grid;
  gap: 8px;
  align-content: start;
  justify-items: end;
  grid-auto-rows: min-content;

  @media (max-width: 920px) {
    width: auto;
    justify-items: start;
    grid-auto-flow: column;
  }
`;

const btnBase = `
  height: 36px; padding: 0 12px; border-radius: 12px; cursor: pointer;
  transition: box-shadow .15s ease, transform .06s ease, color .12s ease, border-color .12s ease;
  width: 100%;
`;
const iconBtn = `
  height: 42px; min-width: 42px;
  padding: 0 12px;
  display: inline-flex; align-items:center; justify-content:center;
  gap:8px;
  border-radius: 12px;
  border: 1px solid #e6ebf2;
  background: #fff;
  color: #0f1f3f;
  font-weight: 600;
  cursor: pointer;
  transition: box-shadow .15s ease, transform .06s ease, border-color .12s ease, color .12s ease;
  // &:hover { box-shadow: 0 8px 20px rgba(16,24,40,.08); border-color:#d7deea; }
  &:active { transform: translateY(1px); }
  &:disabled { opacity:.6; cursor: default; box-shadow:none; transform:none; }
`;

export const WOGhost = styled.button`
  ${iconBtn}
`;
export const WOPrimary = styled.button`
  ${btnBase};
  height: 40px;
  color: #fff;
  font-weight: 600;
  background: #2f6bff;
  border: 1px solid #2f6bff;
  box-shadow: 0 8px 22px rgba(47, 107, 255, 0.25);
  &:hover {
    box-shadow: 0 10px 26px rgba(47, 107, 255, 0.32);
  }
  &:active {
    transform: translateY(1px);
  }
`;
export const WODanger = styled.button`
  ${btnBase};
  color: #b91c1c;
  background: #fff;
  border: 1px solid #fecaca;
  font-weight: 800;
  &:hover {
    box-shadow: 0 8px 18px rgba(185, 28, 28, 0.07);
  }
  &:active {
    transform: translateY(1px);
  }
`;

/* Пусто / загрузка */
export const WOEmpty = styled.div`
  display: grid;
  gap: 8px;
  place-items: center;
  padding: 32px 18px;
  background: #fff;
  border: 1px dashed #d8e1fb;
  border-radius: 16px;
  color: #6b7a90;
`;

export const CommentBlock = styled.div`
  border-radius: 8px;
`;

export const StarsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StarBtn = styled.button`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9aa5b2; /* неактивная */
  transition: color 0.12s ease, transform 0.12s ease;

  &[data-active="true"],
  &[data-hover="true"] {
    color: #f59e0b; /* активная (amber) */
  }

  svg {
    width: 20px;
    height: 20px;
  }
  &:active {
    transform: scale(0.96);
  }
`;

export const CommentToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  min-height: 42px; /* было 44 */
  padding: 10px 16px; /* было 12px 16px */
  border-radius: 12px; /* было 12 */
  font-size: 15px; /* было 16 */
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
  } /* было 20 */
`;
export const CommentForm = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px 10px;

  textarea {
    max-width: 100%;
    min-height: 80px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    padding: 8px;
    resize: vertical;
    font-size: 14px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      border-color: #c7ced6;
    }

    &:focus,
    &:focus-visible {
      outline: none;
      border-color: #2563eb; /* синий */
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2); /* мягкое свечение */
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

export const WOSkel = styled.div`
  height: 132px;
  border-radius: 16px;
  background: linear-gradient(90deg, #f5f7fb 0%, #eef3fb 45%, #f5f7fb 90%);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const WOTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 6px 0 16px;
`;

export const WOTab = styled.button<{ $active?: boolean }>`
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? "#cfe0ff" : "#e6ebf2")};
  color: ${({ $active }) => ($active ? "#155eef" : "#0f1f3f")};
  background: ${({ $active }) => ($active ? "#f4f8ff" : "#fff")};
  transition: all 0.15s ease;
  &:hover {
    border-color: #d7deea;
    box-shadow: 0 6px 16px rgba(16, 24, 40, 0.06);
  }
`;
