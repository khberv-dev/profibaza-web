import styled from "@emotion/styled";
import defaultAvatar from "/avatar.png";
import { Stagger } from "../../components/Stagger";

const ink = "#0F172A";
const sub = "#64748B";
const border = "#E2E8F0";
const primary = "#2563EB";
const primaryDark = "#1D4ED8";
const surface = "#FFFFFF";
const pageBg = "#F4F7FB";

export const FiltersCard = styled.div`
  background: #fff;
  border: 1px solid #e7ecf3;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 18px rgba(30, 92, 251, 0.05);

  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px 160px auto;
  gap: 12px;
  align-items: end;

  @media (max-width: 980px) {
    grid-template-columns: minmax(0, 1fr) 1fr;
    .actions {
      grid-column: 1 / -1;
      justify-content: flex-end;
    }
  }

  @media (max-width: 640px) {
    padding: 14px;
    grid-template-columns: 1fr;

    .actions {
      display: grid !important;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      width: 100%;
    }
  }
`;

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 22px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr; /* ✅ на мобилке/планшете одна колонка */
  }
`;

export const StickyAside = styled.aside`
  position: sticky;
  top: 12px;
  background: #fff;
  border: 1px solid #e7ecf3;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
  padding: 14px;

  @media (max-width: 1024px) {
    display: none; /* ✅ скрываем правую колонку на мобилке */
  }
`;

/* ✅ моб. нижняя панель "Мои отклики" */
export const MobileOffersBar = styled.button`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    position: sticky;
    bottom: 0;
    width: 100%;
    z-index: 30;

    border: 1px solid #e7ecf3;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(10px);

    border-radius: 14px;
    padding: 12px 12px;
    margin-top: 12px;

    align-items: center;
    justify-content: space-between;
    gap: 12px;

    cursor: pointer;
  }

  .left {
    display: grid;
    gap: 2px;
    text-align: left;
    min-width: 0;
  }
  .title {
    font-weight: 900;
    color: #0f172a;
    font-size: 14px;
    line-height: 1.2;
  }
  .sub {
    color: #64748b;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .badge {
    min-width: 28px;
    height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    background: #1e5cfb;
    color: #fff;
    font-weight: 900;
    font-size: 12px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
  }
`;

/* Карточка (горизонтальная — вакансии и т.п.) */
export const HHCard = styled.article`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;

  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 140px;
  grid-template-areas: "left mid right";
  column-gap: 16px;
  row-gap: 10px;

  padding: 16px 18px;
  border-radius: 20px;
  background: ${surface};
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  overflow: hidden;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(37, 99, 235, 0.12);
    box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
  }

  @media (max-width: 920px) {
    grid-template-columns: 56px minmax(0, 1fr);
    grid-template-areas:
      "left mid"
      "right right";
    column-gap: 12px;
    padding: 14px;
  }

  @media (max-width: 520px) {
    grid-template-columns: 56px minmax(0, 1fr);
    row-gap: 12px;
  }
`;

/* Карточка мастера — вертикальная сетка на /app/find */
export const FindCard = styled.article`
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 20px;
  background: ${surface};
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(37, 99, 235, 0.14);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  }
`;

export const FindCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 0;
  min-width: 0;

  @media (max-width: 640px) {
    padding: 16px 16px 0;
    gap: 10px;
  }
`;

export const FindCardBody = styled.div`
  display: grid;
  gap: 10px;
  padding: 14px 18px 16px;
  flex: 1;
  min-width: 0;

  @media (max-width: 640px) {
    padding: 12px 16px 14px;
    gap: 8px;
  }
`;

export const FindCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 18px 18px;
  border-top: 1px solid #f1f5f9;
  background: linear-gradient(180deg, #fafbfd 0%, #fff 100%);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 16px 16px;
    gap: 12px;
  }
`;

export const CardIconRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

export const ProfBadge = styled.span`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: ${primaryDark};
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.12);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PriceHighlight = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: ${ink};
  letter-spacing: -0.02em;
  line-height: 1.35;
  word-break: break-word;

  @media (max-width: 640px) {
    font-size: 14px;
  }

  span {
    font-weight: 500;
    color: ${sub};
    font-size: 13px;
  }
`;


export const skeletonCSS = `
.skel {
  position: relative;
  overflow: hidden;
  background: #f1f5f9;
  border-radius: 10px;
}
.skel::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, rgba(241,245,249,0) 0%, rgba(241,245,249,0) 20%, rgba(255,255,255,0.6) 40%, rgba(241,245,249,0) 60%, rgba(241,245,249,0) 100%);
  animation: skel 1.2s infinite;
}
@keyframes skel {
  100% { transform: translateX(100%); }
}
`;

export const HHLeft = styled.div`
  grid-area: left;
  display: grid;
  align-content: start;
  justify-items: center; /* ✅ чтобы аватар не уезжал */
`;


export const HHAvatar = styled.div<{ $src?: string | null }>`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $src }) =>
    $src
      ? `url(${$src}) center/cover no-repeat`
      : `#f8fafc url(${defaultAvatar}) center/cover no-repeat`};
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #1d4ed8;
  font-size: 20px;
  border: 3px solid #fff;
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.04),
    0 8px 20px rgba(15, 23, 42, 0.1);

  img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }

  @media (max-width: 920px) {
    width: 56px;
    height: 56px;
    font-size: 16px;

    img {
      width: 56px;
      height: 56px;
    }
  }

  @media (max-width: 640px) {
    width: 60px;
    height: 60px;
    font-size: 17px;

    img {
      width: 60px;
      height: 60px;
    }
  }
`;

export const HHAvatarImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
  display: block;
  border: 3px solid #fff;
  background: #f8fafc url(${defaultAvatar}) center/cover no-repeat;
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.04),
    0 8px 20px rgba(15, 23, 42, 0.1);

  @media (max-width: 920px) {
    width: 56px;
    height: 56px;
  }

  @media (max-width: 640px) {
    width: 60px;
    height: 60px;
  }
`;


export const HHMid = styled.div`
  grid-area: mid;
  display: grid;
  gap: 6px;
  min-width: 0;

  /* ✅ фикс “криво”: всегда влево */
  justify-items: start;
  text-align: left;
`;

export const HHName = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: ${ink};
  line-height: 1.25;
  letter-spacing: -0.02em;
  text-align: left;
  width: 100%;
  transition: color 0.12s ease;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    font-size: 16px;
    white-space: nowrap;
  }

  &:hover {
    color: ${primary};
  }
`;

export const HHHead = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: flex-start;

  .title {
    min-width: 0;
  }

  @media (max-width: 920px) {
    flex-direction: column;
    gap: 6px;
  }
`;


export const HHSub = styled.div`
  font-size: 12px;
  color: #6b7a90;
  margin-top: 2px;
`;
export const HHStatuses = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-self: flex-start;
  justify-content: flex-end;
  max-width: min(100%, 220px);

  @media (max-width: 640px) {
    max-width: calc(100% - 68px);
    gap: 4px;
  }
`;

export const HHStatus = styled.span<{
  $tone: "green" | "blue" | "red" | "gray";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${({ $tone }) =>
    ({ green: "#047857", blue: "#1d4ed8", red: "#b91c1c", gray: "#475569" }[
      $tone
    ])};
  background: ${({ $tone }) =>
    ({ green: "#ecfdf5", blue: "#eff6ff", red: "#fef2f2", gray: "#f8fafc" }[
      $tone
    ])};
  border: 1px solid
    ${({ $tone }) =>
      ({
        green: "#a7f3d0",
        blue: "#bfdbfe",
        red: "#fecaca",
        gray: "#e2e8f0",
      }[$tone])};
`;

export const HHChips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 2px;
`;
export const HHChip = styled.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  color: #5e6c77;
  background: #f5f7fb;
`;
export const HHMeta = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 18px;
  list-style: none;
  margin: 4px 0 0 0;
  padding: 0;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 6px;
  }

  li {
    display: flex;
    gap: 6px;
    align-items: center;
    color: #6b7a90;
    font-size: 12px;
    min-width: 0;
  }
  .k {
    color: #7b8ba5;
    flex-shrink: 0;
  }
  .v {
    color: #12284a;
    font-weight: 600;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const HHDivider = styled.div`
  height: 1px;
  background: #eef3fb;
  margin: 4px 0 0;
`;

export const HHBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const HHPrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #12284a;
  span {
    font-weight: 400;
    color: #6b7a90;
  }
`;

export const HHRating = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 13px;
  gap: 8px;
  max-width: 100%;

  .ant-rate {
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    font-size: 12px;
    gap: 6px;
  }

  strong {
    color: #12284a;
  }
  .cnt {
    color: #6b7a90;
  }
`;

export const Stars = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  gap: 4px;
  .s {
    width: 14px;
    height: 14px;
    display: inline-block;
  }
  .s::before {
    content: "★";
    font-size: 14px;
    line-height: 1;
  }
  .s.full {
    color: #f5b400;
  }
  .s.half {
    background: linear-gradient(90deg, #f5b400 50%, #e2e8f0 50%);
    -webkit-background-clip: text;
    color: transparent;
  }
  .s.empty {
    color: #e2e8f0;
  }
`;

export const HHRight = styled.aside`
  grid-area: right;
  display: grid;
  gap: 10px;
  align-content: start;
  justify-items: end;

  @media (max-width: 920px) {
    justify-items: stretch;
  }
`;


export const IconBtn = styled.button`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: #fff;
  border: 1px solid ${border};
  color: #64748b;
  cursor: pointer;
  flex-shrink: 0;
  transition: box-shadow 0.15s ease, transform 0.06s ease, color 0.12s ease, border-color 0.12s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    color: ${primary};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const OpenBtn = styled.button<{ $compact?: boolean }>`
  height: 40px;
  padding: 0 18px;
  border-radius: 11px;
  border: 1px solid transparent;
  background: linear-gradient(180deg, ${primary} 0%, ${primaryDark} 100%);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.22);
  transition: transform 0.12s ease, box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.28);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 920px) {
    ${({ $compact }) =>
      !$compact &&
      `
      width: 100%;
      height: 44px;
      border-radius: 12px;
    `}
  }

  @media (max-width: 640px) {
    ${({ $compact }) =>
      $compact &&
      `
      width: 100%;
      height: 44px;
      border-radius: 12px;
    `}
  }
`;

/* Контейнер страницы */
export const PageWrap = styled.div`
  max-width: 1160px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px 40px;
  padding-bottom: calc(40px + env(safe-area-inset-bottom, 0px));
  background: ${pageBg};
  min-height: calc(100vh - 56px);
  overflow-x: clip;

  *, *::before, *::after {
    box-sizing: border-box;
  }

  @media (max-width: 720px) {
    padding: 14px 12px 24px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    min-height: calc(100vh - 60px);
  }
`;

export const PageHeader = styled.header`
  margin-bottom: 18px;

  @media (max-width: 640px) {
    margin-bottom: 14px;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(22px, 5vw, 32px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${ink};
`;

export const PageSubtitle = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${sub};
  max-width: 640px;

  @media (max-width: 640px) {
    font-size: 13px;
    margin-top: 6px;
  }
`;

export const ResultsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 0 14px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    margin: 14px 0 12px;
  }
`;

export const ResultsCount = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${ink};

  span {
    color: ${sub};
    font-weight: 500;
  }
`;

export const ToolbarShell = styled.section`
  background: ${surface};
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  margin-bottom: 14px;

  @media (max-width: 640px) {
    padding: 12px;
    border-radius: 16px;
  }
`;

/* Тулбар фильтров */
export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px 112px 112px;
  gap: 10px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    > :first-of-type {
      grid-column: 1 / -1;
    }

    > :last-of-type {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    > :first-of-type,
    > :last-of-type {
      grid-column: 1 / -1;
    }
  }
`;

export const SearchInputWrap = styled.div`
  min-height: 44px;
  display: grid;
  align-items: center;

  .select-wrap {
    width: 100%;
  }
`;

export const ProfPickWrap = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
`;

export const ProfPickBtn = styled.button<{ $filled?: boolean }>`
  width: 100%;
  height: 44px;
  padding: 0 10px 0 14px;
  border-radius: 12px;
  border: 1px solid ${border};
  background: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: ${({ $filled }) => ($filled ? ink : "#94a3b8")};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 640px) {
    height: 48px;
    font-size: 13px;
  }

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
  }

  span.label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    flex: 1;
    text-align: left;
  }
`;

export const ProfPickClear = styled.span`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
  }
`;

export const ProfPickChevron = styled.span`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  color: #64748b;
  opacity: 0.65;
  pointer-events: none;
`;

export const FilterBtn = styled.button`
  height: 44px;
  border-radius: 12px;
  border: 1px solid ${border};
  background: #fff;
  color: ${ink};
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.06s ease;

  @media (max-width: 640px) {
    height: 48px;
    font-size: 12px;
  }

  &:hover:not(:disabled) {
    border-color: #cbd5e1;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SearchBtn = styled.button`
  height: 44px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid transparent;
  background: linear-gradient(180deg, ${primary} 0%, ${primaryDark} 100%);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.22);
  transition: box-shadow 0.15s ease, transform 0.06s ease;

  @media (max-width: 640px) {
    height: 48px;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.28);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

export const FilterField = styled.div`
  min-width: 0;
  width: 100%;
`;

export const FieldLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 13px;
  color: ${ink};
`;

export const MapEmbed = styled.div`
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid ${border};

  @media (max-width: 640px) {
    border-radius: 12px;
  }
`;

export const GeoControls = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

export const GeoHint = styled.small`
  opacity: 0.8;
  font-size: 12px;
  line-height: 1.45;

  @media (max-width: 640px) {
    display: block;
    width: 100%;
  }
`;

export const GeoInput = styled.input`
  width: 120px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid ${border};
  outline: none;
  font-size: 14px;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const GeoRemoveBtn = styled.button`
  margin-left: auto;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid ${border};
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: ${ink};

  @media (max-width: 640px) {
    margin-left: 0;
    width: 100%;
    height: 44px;
  }
`;

export const GeoRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

/* Панель с мин/макс */
export const FiltersPanel = styled.div<{ $open?: boolean }>`
  display: ${({ $open }) => ($open ? "grid" : "none")};
  grid-template-columns: repeat(12, 1fr);
  gap: 14px;
  padding: 18px;
  margin-bottom: 16px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 20px;
  background: ${surface};
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  min-width: 0;

  .field {
    grid-column: span 6;
    min-width: 0;
  }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    .field {
      grid-column: span 1;
    }
  }

  @media (max-width: 640px) {
    padding: 14px 12px;
    gap: 12px;
    border-radius: 16px;
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #475467;
    margin-bottom: 6px;
  }

  input {
    height: 40px;
    width: 100%;
    max-width: 100%;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid #e7ecf3;
    background: #fff;
    color: #0f172a;
    &:focus {
      outline: none;
      border-color: #dfe7f1;
      box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.16);
    }
  }
`;

/* Сетка карточек мастеров */
export const List = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  min-width: 0;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  @media (max-width: 680px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
`;

export const ResultsStagger = styled(Stagger)`
  grid-column: 1 / -1;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  min-width: 0;
  width: 100%;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  @media (max-width: 680px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
`;

export const EmptyWrap = styled.div`
  grid-column: 1 / -1;
  border: 1px dashed #cbd5e1;
  background: ${surface};
  border-radius: 20px;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  min-width: 0;
  overflow: hidden;

  @media (max-width: 640px) {
    padding: 20px 14px;
    border-radius: 16px;
  }

  h3 {
    margin: 10px 0 8px;
    font-size: 20px;
    font-weight: 800;
    color: ${ink};
    letter-spacing: -0.02em;

    @media (max-width: 640px) {
      font-size: 18px;
    }
  }

  p {
    margin: 0 auto;
    max-width: 520px;
    color: ${sub};
    font-size: 14px;
    line-height: 1.55;

    @media (max-width: 640px) {
      font-size: 13px;
    }
  }

  .actions {
    margin-top: 18px;
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .btn {
    height: 40px;
    padding: 0 16px;
    border-radius: 11px;
    border: 1px solid ${border};
    background: #fff;
    cursor: pointer;
    font-weight: 700;
    font-size: 13px;
    color: ${ink};

    @media (max-width: 640px) {
      height: 44px;
      width: 100%;
    }
  }

  .btn.primary {
    background: linear-gradient(180deg, ${primary} 0%, ${primaryDark} 100%);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.22);
  }

  .hint {
    margin-top: 12px;
    font-size: 12px;
    color: #94a3b8;
    padding: 0 8px;
  }
`;

export const ListSingle = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
  justify-items: center; /* чтобы по центру на больших экранах */
  width: 100%;

  /* на широких — оставляем одну, но центрируем и ограничиваем ширину */
  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
    > * {
      max-width: 800px; /* или 720px, под твой макет */
      width: 100%;
    }
  }

  /* на планшете и ниже — просто одна карточка на всю ширину */
  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
    > * {
      width: 100%;
    }
  }
`;

export const emptyCSS = `
.empty {
  border: 1px dashed #e7ecf3;
  background: #fafafa;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
}
.empty h3 {
  margin: 10px 0 6px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}
.empty p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}
.empty .actions {
  margin-top: 14px;
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
.empty .btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e7ecf3;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
}
.empty .btn.primary {
  background: #1e5cfb;
  border-color: #1e5cfb;
  color: #fff;
}
.empty .hint {
  margin-top: 10px;
  font-size: 12px;
  color: #94a3b8;
}
`;
