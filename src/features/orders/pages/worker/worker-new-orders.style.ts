import styled from "@emotion/styled";

/* Страница */
export const WOPage = styled.div`
  padding: 20px;
  overflow-x: clip;

  @media (max-width: 640px) {
    padding: 0 0 24px;
  }
`;

/* Верхняя панель */
export const WOToolbar = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 640px) {
    align-items: center;
    padding: 14px 16px 0;
    margin-bottom: 10px;
  }
`;
export const WOTitle = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: #12284a;
  letter-spacing: -0.01em;

  @media (max-width: 640px) {
    font-size: 20px;
  }
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

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

/* Карточка заказа */
export const WOCard = styled.article`
  padding: 16px 18px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #e9eef6;
  box-shadow: 0 4px 14px rgba(2, 32, 71, 0.04);
  min-width: 0;

  .inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "main actions"
      "main actions";
    gap: 16px;
    align-items: start;
  }

  @media (max-width: 920px) {
    .inner {
      grid-template-columns: 1fr;
      grid-template-areas:
        "main"
        "actions";
      gap: 12px;
    }
  }

  @media (max-width: 640px) {
    padding: 14px 16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid #e9eef6;
    box-shadow: none;
  }
`;

export const WOHeadRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
`;

export const WOHeadMain = styled.div`
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 4px;
`;

export const WOHeadTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
`;
export const WOName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #0f1f3f;
  line-height: 1.2;
  word-break: break-word;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;
export const WOSubline = styled.div`
  font-size: 13px;
  color: #7c8aa0;
  margin-top: 6px;
  line-height: 1.4;

  @media (max-width: 640px) {
    font-size: 12px;
    margin-top: 4px;
  }
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
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #eef2f7;
  border-radius: 10px;
  background: #f8fafc;
  overflow: hidden;

  li {
    display: grid;
    grid-template-columns: 18px minmax(72px, auto) minmax(0, 1fr);
    gap: 6px 8px;
    align-items: baseline;
    padding: 9px 12px;
    border-bottom: 1px solid #eef2f7;
    color: #334155;
    font-size: 13px;
    line-height: 1.35;
    min-width: 0;
  }

  li:last-child {
    border-bottom: none;
  }

  li > div {
    display: contents;
  }

  .k {
    color: #8a96a8;
    font-size: 12px;
    font-weight: 500;
  }

  .v {
    color: #0f1f3f;
    font-weight: 600;
    font-size: 13px;
    text-align: right;
    word-break: break-word;
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.75;
    margin-top: 1px;
  }

  @media (max-width: 640px) {
    li {
      padding: 8px 10px;
      grid-template-columns: 16px minmax(64px, auto) minmax(0, 1fr);
    }

    .k {
      font-size: 11px;
    }

    .v {
      font-size: 12px;
    }
  }
`;

export const WODivider = styled.div`
  display: none;
`;
export const WODesc = styled.p`
  margin: 0;
  color: #1f2937;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;

  @media (max-width: 640px) {
    font-size: 13px;
    padding: 9px 10px;
  }
`;

export const WOMid = styled.div`
  grid-area: main;
  display: grid;
  gap: 10px;
  min-width: 0;
`;

export const WOActionBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    width: 100%;

    > * {
      min-width: 0;
    }

    button {
      width: 100%;
      justify-content: center;
      font-size: 12px;
      height: 40px;
      padding: 0 8px;
    }
  }
`;

/* Правая колонка (кнопки) */
export const WORight = styled.aside`
  grid-area: actions;
  display: grid;
  gap: 8px;
  min-width: 140px;
  align-content: start;

  @media (max-width: 920px) {
    width: 100%;
    min-width: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    button {
      width: 100%;
      height: 40px;
      font-size: 13px;
    }
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
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

  @media (max-width: 640px) {
    margin: 0 16px;
    padding: 24px 16px;
    border-radius: 12px;
  }
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
  justify-content: center;
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

  @media (max-width: 640px) {
    width: 100%;
    min-height: 38px;
    font-size: 14px;
    padding: 8px 12px;
  }
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

  @media (max-width: 640px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 16px 6px;
    margin: 0 0 12px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
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
