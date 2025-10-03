import styled from "@emotion/styled";

/* Карточка */
export const HHCard = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 88px 1fr 172px;
  grid-template-areas: "left mid right";   /* ← явные области на десктопе */
  gap:26px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e7effc;
  box-shadow: 0 6px 18px rgba(2,32,71,.05);
  transition: box-shadow .2s ease, transform .1s ease;
  overflow: hidden;                        /* ← чтобы ничего не «торчало» */
  &:hover { box-shadow: 0 12px 28px rgba(2,32,71,.08); transform: translateY(-1px); }

  @media (max-width: 920px) {
    grid-template-columns: 64px 1fr;
    grid-template-areas:
      "left mid"
      "right right";                       /* ← правая колонка вниз */
  }
`;

export const HHLeft = styled.div`
  grid-area: left;                          /* ← соответствует области */
  display: grid;
  align-content: start;
`;

export const HHAvatar = styled.div<{ $src?: string | null }>`
  width: 94px; height: 94px; border-radius: 10%;
  background: ${({ $src }) => $src ? `url(${$src}) center/cover no-repeat` : "linear-gradient(180deg,#eef2ff,#f8fafc)"};
  border: 1px solid #e7ecf3;
  display: grid; place-items: center;
  font-weight: 900; color: #1e40af; font-size: 20px;
`;

export const HHMid = styled.div`
  grid-area: mid;                           /* ← явная область центра */
  display: grid; gap: 8px;
  min-width: 0;                             /* ← чтобы текст не ломал сетку */
`;

export const HHHead = styled.div`
  display: flex; justify-content: flex-start; gap: 12px; align-items: flex-start;
  @media (max-width: 920px) { flex-direction: column; gap: 6px; }
`;

export const HHName = styled.h3`
  margin: 0; font-size: 20px; font-weight: 800; color: #12284a;
`;

export const HHSub = styled.div`
  font-size: 13px; color: #6b7a90; margin-top: 2px;
`;

export const HHStatuses = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`;

export const HHStatus = styled.span<{ $tone: "green" | "blue" }>`
  display: inline-flex; align-items: center; justify-content: center;
  height: 24px; padding: 0 10px; border-radius: 999px; font-size: 12px; font-weight: 600;
  color: ${({ $tone }) => ($tone === "green" ? "#00984f" : "#0070ff")};
  background: ${({ $tone }) => ($tone === "green" ? "#e9fbf2" : "#edf6ff")};
//   border: 1px solid ${({ $tone }) => ($tone === "green" ? "#bdf3d7" : "#dbeafe")};
`;

export const HHChips = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2px;
`;
export const HHChip = styled.span`
  display: inline-flex; align-items: center; height: 24px;
  padding: 0 10px; border-radius: 999px;
  font-size: 12px; font-weight: 600; color: #5e6c77;
  background: #f5f7fb;
`;

export const HHMeta = styled.ul`
  display: flex; flex-wrap: wrap; gap: 14px 18px; list-style: none; margin: 4px 0 0 0; padding: 0;
  li { display: flex; gap: 6px; align-items: center; color: #6b7a90; font-size: 14px; }
  .k { color: #7b8ba5; }
  .v { color: #12284a; font-weight: 600; }
`;

export const HHDivider = styled.div`
  height: 1px; background: #eef3fb; margin: 4px 0 0;
`;

export const HHBottom = styled.div`
  display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
`;

export const HHPrice = styled.div`
  font-size: 18px; font-weight: 700; color: #12284a;
  span { font-weight: 400; color: #6b7a90; }
`;

export const HHRating = styled.div`
  display: inline-flex; align-items: center; gap: 8px;
  strong { color: #12284a; }
  .cnt { color: #6b7a90; font-size: 13px; }
`;

export const Stars = styled.div`
  display: inline-grid; grid-auto-flow: column; gap: 4px;
  .s { width: 18px; height: 18px; display: inline-block; }
  .s::before { content: "★"; font-size: 18px; line-height: 1; }
  .s.full { color: #f5b400; }
  .s.half { background: linear-gradient(90deg,#f5b400 50%, #e2e8f0 50%); -webkit-background-clip: text; color: transparent; }
  .s.empty { color: #e2e8f0; }
`;

export const HHRight = styled.aside`
  grid-area: right;                         /* ← явная область справа */
  display: grid;
  gap: 10px;
  align-content: start;
  justify-items: end;
  @media (max-width: 920px) {
    grid-auto-flow: column;
    justify-items: start;
    align-items: center;
  }
`;

export const IconBtn = styled.button`
  width: 36px; height: 36px; display: grid; place-items: center;
  border-radius: 12px; background: #fff; border: 1px solid #e7ecf3; color: #73839c;
  cursor: pointer; transition: box-shadow .15s ease, transform .06s ease, color .12s ease;
  &:hover { box-shadow: 0 8px 20px rgba(2,32,71,.08); color: #1e5cfb; }
  &:active { transform: translateY(1px); }
`;

export const OpenBtn = styled.button`
  height: 40px; padding: 0 16px; border-radius: 12px;
  border: 1px solid #2f6bff; background: #2f6bff; color: #fff; font-weight: 600;
  cursor: pointer; transition: box-shadow .15s ease, transform .06s ease;
  box-shadow: 0 8px 22px rgba(47,107,255,.25);
  &:hover { box-shadow: 0 10px 26px rgba(47,107,255,.32); }
  &:active { transform: translateY(1px); }
`;


/* Контейнер страницы */
export const PageWrap = styled.div`
  max-width: 1120px;          /* ширина как на HH */
  margin: 0 auto;             /* центрируем */
  padding: 20px 20px 28px;    /* общий внутренний отступ */
`;

/* Тулбар фильтров */
export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px 140px;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchInputWrap = styled.div`
  height: 48px;
  border-radius: 14px;
  display: grid;
  align-items: center;
  padding: 0 12px;
  .select-wrap { width: 100%; }
`;

export const FilterBtn = styled.button`
  height: 38px;
  border-radius: 12px;
  border: 1px solid #e7ecf3;
  background: #fff;
  color: #0f172a;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow .15s ease, border-color .15s ease, transform .06s ease;
  &:hover { border-color: #dfe7f1; box-shadow: 0 8px 20px rgba(2,32,71,.08); }
  &:active { transform: translateY(1px); }
`;

export const SearchBtn = styled.button`
  height: 38px;
  border-radius: 12px;
  border: 1px solid #2f6bff;
  background: #2f6bff;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  transition: box-shadow .15s ease, transform .06s ease;
  &:hover { box-shadow: 0 10px 24px rgba(47,107,255,.22); }
  &:active { transform: translateY(1px); }
`;

/* Панель с мин/макс */
export const FiltersPanel = styled.div<{ $open?: boolean }>`
  display: ${({ $open }) => ($open ? "grid" : "none")};
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
  padding: 14px;
  margin-bottom: 16px;
  border: 1px solid #e7ecf3;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(2,32,71,.06);

  .field { grid-column: span 3; }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    .field { grid-column: span 1; }
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #475467;
    margin-bottom: 6px;
  }

  input {
    height: 40px; width: 100%;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid #e7ecf3;
    background: #fff;
    color: #0f172a;
    &:focus { outline: none; border-color: #dfe7f1; box-shadow: 0 0 0 3px rgba(47,107,255,.16); }
  }
`;

/* Разделитель списка карточек от панели */
export const List = styled.div`
  display: grid;
  gap: 12px;
`;
