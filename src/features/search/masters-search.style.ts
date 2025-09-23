import styled from "@emotion/styled";

/* ===== Design tokens ===== */
const UI = {
  max: 1360,
  text: "#0F172A",
  textMuted: "#475569",
  line: "#E7ECF3",
  lineSoft: "#F1F5F9",
  bg: "#FFFFFF",
  soft: "#F7F9FF",
  primary: "#2C64FF",
  primaryHover: "#1F4DE0",
  primarySoft: "rgba(44,100,255,.14)",
  rLg: 16,
  rMd: 12,
  rSm: 10,
  pill: 999,
};

/* ===== Shell + top toolbar ===== */
export const Shell = styled.div`
  //   max-width: ${UI.max}px;
  margin: 0 auto;
  padding: 24px 24px 64px;

  @media (max-width: 960px) {
    padding: 16px;
  }
`;

export const Toolbar = styled.section`
  background: ${UI.bg};
  border: 1px solid ${UI.line};
  border-radius: ${UI.rLg}px;
  padding: 16px;
  margin-bottom: 20px;
`;

export const SearchWrap = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const Input = styled.input`
  height: 52px;
  padding: 0 16px;
  border: 1px solid ${UI.line};
  border-radius: ${UI.rMd}px;
  font-size: 16px;
  transition: border-color 0.18s, box-shadow 0.18s;

  &::placeholder {
    color: #94a3b8;
  }
  &:hover {
    border-color: #d7e3f6;
  }
  &:focus {
    outline: none;
    border-color: ${UI.primary};
    box-shadow: 0 0 0 4px ${UI.primarySoft};
  }
`;

export const SearchBtn = styled.button`
  height: 52px;
  padding: 0 18px;
  border: 0;
  border-radius: ${UI.rMd}px;
  background: ${UI.primary};
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.18s, transform 0.06s;

  &:hover {
    background: ${UI.primaryHover};
  }
  &:active {
    transform: translateY(1px);
  }
`;

/* ===== Layout: Aside + Main ===== */
export const Content = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
`;

export const Aside = styled.aside`
  flex: 0 0 360px;
  position: sticky;
  top: 16px;
  align-self: flex-start;
  z-index: 3;

  @media (max-width: 1200px) {
    flex-basis: 320px;
  }
  @media (max-width: 920px) {
    position: fixed;
    inset: 0 auto 0 0;
    width: 88%;
    max-width: 380px;
    transform: translateX(-110%);
    transition: transform 0.2s ease;
    background: ${UI.bg};
    z-index: 40;
    &[data-open="true"] {
      transform: translateX(0);
    }
  }
`;

export const Backdrop = styled.div`
  display: none;
  @media (max-width: 920px) {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.28);
    backdrop-filter: blur(2px);
    z-index: 30;
    &[data-open="true"] {
      display: block;
    }
  }
`;

/* — блок внутри сайдбара (как у HH): плоский, с разделителями — */
export const Sticky = styled.div`
  border: 1px solid ${UI.line};
  border-radius: ${UI.rLg}px;
  background: ${UI.bg};
  overflow: hidden;
`;

export const FilterCard = styled.section`
  padding: 14px 16px;
  & + & {
    border-top: 1px solid ${UI.lineSoft};
  }
`;

export const SectionTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 17px; /* больше заголовки */
  line-height: 1.2;
  font-weight: 800;
  color: ${UI.text};
`;

/* — минимальные теги — */
export const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.button`
  height: 32px;
  padding: 0 12px;
  background: transparent;
  border: 1px solid ${UI.line};
  border-radius: 8px; /* квадратнее, без «булочек» */
  color: ${UI.text};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    border-color: #d6e2ff;
  }
  &[aria-pressed="true"] {
    background: #eef4ff;
    border-color: #d6e2ff;
    color: #0f172a;
  }
`;

/* — поля диапазона — */
export const RangeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  input {
    height: 40px;
    border: 1px solid ${UI.line};
    border-radius: 8px;
    padding: 0 10px;
    font-size: 14px;
    &:focus {
      outline: none;
      border-color: ${UI.primary};
      box-shadow: 0 0 0 3px ${UI.primarySoft};
    }
  }
`;

/* — линии-строки (радио/чекбокс + название + счётчик справа) — */
export const CheckRow = styled.label`
  display: grid;
  grid-template-columns: 18px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
  }
  small {
    color: ${UI.textMuted};
  }
  &:hover {
    background: ${UI.soft};
    border-radius: 8px;
    padding-inline: 8px;
  }
`;

/* — подвал сайдбара как у HH — */
export const AsideFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid ${UI.lineSoft};
  background: ${UI.bg};
  position: sticky;
  bottom: 0;

  button {
    height: 44px;
  }
`;

export const ResetBtn = styled.button`
  border: 0;
  background: transparent;
  color: #2563eb;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
`;

export const ApplyBtn = styled.button`
  padding: 0 16px;
  border: 0;
  background: ${UI.primary};
  color: #fff;
  font-weight: 800;
  border-radius: ${UI.rMd}px;
  cursor: pointer;
  &:hover {
    background: ${UI.primaryHover};
  }
`;

/* ===== Right column ===== */
export const Main = styled.main`
  flex: 1 1 auto;
  min-width: 0;
  display: grid;
  gap: 14px;
`;

/* header над результатами */
export const Split = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  @media (max-width: 780px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;
export const Left = styled.div``;
export const Right = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
export const SortWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  color: ${UI.textMuted};
  select {
    height: 40px;
    border-radius: 8px;
    border: 1px solid ${UI.line};
    padding: 0 12px;
    background: ${UI.bg};
    font-weight: 700;
    &:focus {
      outline: none;
      border-color: ${UI.primary};
      box-shadow: 0 0 0 3px ${UI.primarySoft};
    }
  }
`;
export const ViewToggle = styled.div`
  display: inline-flex;
  border: 1px solid ${UI.line};
  border-radius: 8px;
  overflow: hidden;
  button {
    width: 44px;
    height: 40px;
    background: transparent;
    border: 0;
    cursor: pointer;
  }
  button[data-active="true"] {
    background: #eef3ff;
    font-weight: 800;
  }
`;
export const Counter = styled.div`
  color: ${UI.text};
  font-weight: 700;
  font-size: 22px;
`;

/* ===== Results ===== */
export const ResultList = styled.div`
  display: grid;
  gap: 16px;
  &[data-view="grid"] {
    grid-template-columns: repeat(auto-fill, minmax(560px, 1fr));
  }
  @media (max-width: 780px) {
    &[data-view="grid"] {
      grid-template-columns: 1fr;
    }
  }
`;

export const Card = styled.article`
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 220px;
  grid-template-areas: "ava main act";
  gap: 18px;
  align-items: start;
  border: 1px solid ${UI.line};
  border-radius: ${UI.rLg}px;
  background: ${UI.bg};
  padding: 18px;
  transition: border-color 0.18s, transform 0.06s;

  &:hover {
    border-color: #dde6fb;
    transform: translateY(-1px);
  }

  @media (max-width: 1024px) {
    grid-template-columns: 88px minmax(0, 1fr) 200px;
  }
  @media (max-width: 780px) {
    grid-template-columns: 76px minmax(0, 1fr);
    grid-template-areas: "ava main" "act act";
  }
`;

export const Avatar = styled.img`
  grid-area: ava;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: #f1f5f9;
  border: 3px solid ${UI.bg};
  box-shadow: 0 0 0 2px #e6edf6 inset;
`;

export const ColMain = styled.div`
  grid-area: main;
  min-width: 0;
`;
export const Title = styled.h3`
  margin: 0;
  font-size: 22px; /* крупнее */
  color: ${UI.text};
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;
export const Subtitle = styled.div`
  margin-top: 4px;
  color: ${UI.textMuted};
  font-size: 14px;
`;
export const TagRow = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

/* — минимальные бейджи-навыки — */
export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 6px;
  background: #f2f6fd;
  border: 1px solid #e8ecf5;
  font-size: 12px;
  font-weight: 600;
  color: ${UI.text};
`;

export const Meta = styled.div`
  margin-top: 12px;
`;
export const StatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
`;
export const Stat = styled.div`
  font-size: 14px;
  color: ${UI.textMuted};
`;
export const Price = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${UI.text};
`;
export const Divider = styled.div`
  height: 1px;
  background: ${UI.lineSoft};
  margin: 12px 0;
`;

export const Actions = styled.div`
  grid-area: act;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
  @media (max-width: 780px) {
    align-items: stretch;
    flex-direction: row;
    justify-content: flex-end;
  }
`;
export const GhostBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e3e8f3;
  background: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease;

  svg {
    width: 18px;
    height: 18px;
    color: #475569;
  }

  &:hover {
    background: #f6f8fd;
    border-color: #d7e3f6;
    svg {
      color: #2c64ff;
    }
  }

  &:active {
    transform: translateY(1px);
  }
`;
export const PrimaryBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border: 0;
  background: ${UI.primary};
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: ${UI.primaryHover};
  }
`;

export const FavBtn = styled(GhostBtn)`
  svg {
    color: #e11d48;
  }
  &:hover svg {
    color: #be123c;
  }

  &[data-active="true"] svg {
    fill: #e11d48;
    color: #e11d48;
  }
`;

export const Badge = styled.span<{ tone?: "success" | "online" }>`
  height: 22px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  border-radius: ${UI.pill}px;
  font-size: 12px;
  font-weight: 700;
  background: ${(p) => (p.tone === "success" ? "#E9FBF1" : "#EEF4FF")};
  color: ${(p) => (p.tone === "success" ? "#138A4B" : "#1E40AF")};
  border: 1px solid ${(p) => (p.tone === "success" ? "#C7EEDB" : "#D5E5FF")};
`;
export const Dot = styled.span`
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
`;

/* pagination */
export const Pagination = styled.nav`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 22px;
`;
export const PageBtn = styled.button`
  min-width: 42px;
  height: 42px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${UI.line};
  background: ${UI.bg};
  font-weight: 800;
  cursor: pointer;
  &:hover {
    border-color: #d7e3f6;
  }
  &[data-active] {
    background: ${UI.primary};
    color: #fff;
    border-color: ${UI.primary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const MapBlock = styled.div`
  display: grid;
  gap: 10px;
`;

export const MapRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }

  select {
    height: 40px;
    border: 1px solid ${UI.line};
    border-radius: 8px;
    padding: 0 10px;
    font-weight: 600;
    &:focus {
      outline: none;
      border-color: ${UI.primary};
      box-shadow: 0 0 0 3px ${UI.primarySoft};
    }
  }
`;

export const SmallBtn = styled.button`
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${UI.line};
  background: ${UI.bg};
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: ${UI.soft};
  }
`;

export const RadiusWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 72px;
  gap: 8px;
  align-items: center;

  input[type="range"] {
    width: 100%;
  }

  input[type="number"] {
    height: 40px;
    border: 1px solid ${UI.line};
    border-radius: 8px;
    padding: 0 10px;
    font-weight: 700;
    &:focus {
      outline: none;
      border-color: ${UI.primary};
      box-shadow: 0 0 0 3px ${UI.primarySoft};
    }
  }
`;

export const MapPreview = styled.div`
  height: 220px;
  border: 1px solid ${UI.line};
  border-radius: ${UI.rMd}px;
  overflow: hidden;

  /* если где-то остался iframe — не помешает */
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }

  /* ВАЖНО: реакт-карте нужно занять весь контейнер */
  > div {
    width: 100%;
    height: 100%;
  }
`;

export const RatingWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

export const StarRow = styled.div`
  display: inline-flex;
  gap: 4px;

  &[data-size="s"] {
    gap: 3px;
  }
`;

export const StarSvg = styled.svg`
  width: 18px;
  height: 18px;
  display: block;

  &[data-size="s"] {
    width: 14px;
    height: 14px;
  }
`;

export const RatingPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f6f8fd;
  border: 1px solid #e8ecf5;
  font-weight: 600;
  color: #0f172a;

  span {
    line-height: 1;
  }
  small {
    color: #64748b;
    font-weight: 600;
  }

  &[data-size="s"] {
    padding: 2px 6px;
    font-size: 12px;
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const FilterActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 6px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

/* Компактная строка для полей формы */
export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

/* Тонкая горизонтальная черта для разделения внутри FilterCard */
export const ThinSep = styled.div`
  height: 1px;
  background: ${UI.lineSoft};
  margin: 10px 0;
`;

/* ===== Custom Select (Sort) ===== */
export const SortSelect = styled.div`
  position: relative;
  width: 200px; /* можно сузить до 200 */
`;

export const SelectBtn = styled.button`
  height: 40px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid ${UI.line};
  border-radius: ${UI.rSm}px;
  background: ${UI.bg};
  color: ${UI.text};
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    background 0.15s ease;

  &:hover {
    background: ${UI.soft};
  }
  &[data-open="true"] {
    border-color: ${UI.primary};
    box-shadow: 0 0 0 3px ${UI.primarySoft};
  }
`;

export const Caret = styled.span`
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 7px solid ${UI.textMuted};
  transform: translateY(-1px);
  [data-open="true"] & {
    transform: rotate(180deg) translateY(1px);
  }
`;

export const SelectMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 25;
  min-width: 100%;
  background: ${UI.bg};
  border: 1px solid ${UI.line};
  border-radius: ${UI.rSm}px;
  overflow: hidden;
  padding: 6px;
`;

export const SelectOption = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: ${UI.text};
  cursor: pointer;
  font-weight: 600;

  &:hover,
  &[data-active="true"] {
    background: ${UI.soft};
  }
  &[aria-selected="true"]::before {
    content: "✓";
    font-weight: 900;
    color: ${UI.primary};
  }
`;
