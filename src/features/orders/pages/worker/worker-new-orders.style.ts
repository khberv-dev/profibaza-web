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
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr) 180px; /* ← mid сжимается корректно */
  grid-template-areas: "left mid right"; /* ← явные области на десктопе */
  gap: 16px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e7effc;
  box-shadow: 0 6px 18px rgba(2, 32, 71, 0.05);
  transition: box-shadow 0.2s ease, transform 0.1s ease;
  overflow: hidden;
  &:hover {
    box-shadow: 0 12px 28px rgba(2, 32, 71, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 920px) {
    grid-template-columns: 64px minmax(0, 1fr);
    grid-template-areas:
      "left mid"
      "right right";
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
  border-radius: 24px;
  height: 96px;
  width: 96px;
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

/* Центр */
export const WOMid = styled.div`
  grid-area: mid;
  display: grid;
  gap: 8px;
  min-width: 0; /* важно для ellipsis */
`;
export const WOHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  @media (max-width: 920px) {
    flex-direction: column;
    gap: 6px;
  }
`;
export const WOName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #12284a;
  word-break: break-word;
`;
export const WOSubline = styled.div`
  font-size: 13px;
  color: #6b7a90;
  margin-top: 2px;
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
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  ${({ $tone }) =>
    ({
      blue: {
        color: "#0b3b8f",
        background: "#eff6ff",
        border: "1px solid #dbeafe",
      },
      green: {
        color: "#14532d",
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
      },
      amber: {
        color: "#92400e",
        background: "#fff7ed",
        border: "1px solid #fed7aa",
      },
      gray: {
        color: "#475467",
        background: "#f2f4f7",
        border: "1px solid #e7ecf3",
      },
      red: {
        color: "#991b1b",
        background: "#fef2f2",
        border: "1px solid #fecaca",
      },
    }[$tone])};
`;

/* Метаданные */
export const WOMeta = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  list-style: none;
  margin: 2px 0 0;
  padding: 0;
  li {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    color: #334155;
    font-size: 14px;
  }
  .k {
    color: #768694;
  }
  .v {
    color: #12284a;
    font-weight: 700;
    max-width: clamp(160px, 44vw, 640px); /* ← длинные адреса не ломают сетку */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
`;
export const WODivider = styled.div`
  height: 1px;
  background: #eef3fb;
  margin-top: 4px;
`;
export const WODesc = styled.p`
  margin: 0;
  color: #0f172a;
  font-size: 14px;
  line-height: 1.5;
`;

/* Правая колонка (кнопки) */
export const WORight = styled.aside`
  grid-area: right;
  display: grid;
  gap: 8px;
  align-content: start;
  justify-items: stretch; /* ← кнопки одинаковой ширины */
  grid-auto-rows: min-content;
  width: 180px; /* ← стабильно держим третий столбец */
  @media (max-width: 920px) {
    width: auto;
    grid-auto-flow: column;
    justify-items: start;
    align-items: center;
  }
`;
const btnBase = `
  height: 36px; padding: 0 12px; border-radius: 12px; cursor: pointer;
  transition: box-shadow .15s ease, transform .06s ease, color .12s ease, border-color .12s ease;
  width: 100%;
`;
export const WOGhost = styled.button`
  ${btnBase};
  background: #fff;
  border: 1px solid #e7ecf3;
  color: #12284a;
  font-weight: 600;
  &:hover {
    box-shadow: 0 8px 20px rgba(2, 32, 71, 0.08);
    color: #1e5cfb;
    border-color: #d0dcfb;
  }
  &:active {
    transform: translateY(1px);
  }
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
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? "#bcd0ff" : "#e7ecf3")};
  color: ${({ $active }) => ($active ? "#1e5cfb" : "#12284a")};
  background: ${({ $active }) => ($active ? "#eff6ff" : "#fff")};
  transition: all 0.15s ease;
  &:hover {
    border-color: #d0dcfb;
    box-shadow: 0 6px 16px rgba(2, 32, 71, 0.06);
  }
`;
