import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export type StatusTone = "green" | "blue" | "amber" | "slate";

const TOKENS = {
    maxw: "1180px",
  
    bg: "#F6F8FB",
    card: "#FFFFFF",
    line: "#E6EAF1",
  
    text: "#0F172A",
    muted: "#64748B",
  
    shadowSm: "0 4px 16px rgba(15, 23, 42, .06)",
    shadowMd: "0 16px 48px rgba(2, 32, 71, .08)",
  
    rLg: "16px",
    rMd: "12px",
    rSm: "10px",
  
    /* === PRIMARY (BLUE) === */
    primary: "#2563EB",        // основной синий
    primaryHover: "#1D4ED8",   // hover
    primaryRing: "rgba(37, 99, 235, .35)",
  
    /* === SEMANTIC === */
    blue: "#2563EB",
    green: "#10B981",
    amber: "#F59E0B",
    slate: "#64748B",
  };
  

export const Page = styled.div`
  min-height: 100vh;
  background: ${TOKENS.bg};
`;

export const Top = styled.div`
  padding: 22px 16px 0;
`;

export const TopInner = styled.div`
  max-width: ${TOKENS.maxw};
  margin: 0 auto;
`;

export const TitleRow = styled.div`
  margin-bottom: 14px;
`;

export const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 28px;
  font-weight: 900;
  color: ${TOKENS.text};
  letter-spacing: -0.02em;

  @media (max-width: 520px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${TOKENS.muted};
  line-height: 1.5;
`;

export const FiltersCard = styled.div`
  background: ${TOKENS.card};
  border: 1px solid ${TOKENS.line};
  border-radius: ${TOKENS.rLg};
  box-shadow: ${TOKENS.shadowSm};
  padding: 14px;
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr repeat(5, 1fr) auto;
  gap: 10px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchWrap = styled.div`
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  border: 1px solid ${TOKENS.line};
  border-radius: ${TOKENS.rMd};
  overflow: hidden;
  background: #fff;
`;

export const SearchIcon = styled.div`
  height: 42px;
  display: grid;
  place-items: center;
  color: ${TOKENS.muted};
  background: #fbfcff;
  border-right: 1px solid ${TOKENS.line};
`;

export const SearchInput = styled.input`
  height: 42px;
  border: 0;
  outline: none;
  padding: 0 12px;
  color: ${TOKENS.text};
  &::placeholder {
    color: #94a3b8;
  }
`;

export const Select = styled.select`
  height: 42px;
  border-radius: ${TOKENS.rMd};
  border: 1px solid ${TOKENS.line};
  background: #fff;
  color: ${TOKENS.text};
  padding: 0 10px;
  outline: none;

  &:disabled {
    opacity: 0.65;
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

export const FilterActions = styled.div`
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 980px) {
    justify-content: flex-start;
  }
`;

export const ResetBtn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: ${TOKENS.rMd};
  border: 1px solid ${TOKENS.line};
  background: #fff;
  color: ${TOKENS.text};
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.06s;

  &:hover {
    background: #fbfcff;
    border-color: #dde3ee;
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const CountBadge = styled.div`
  min-width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid ${TOKENS.line};
  background: #fbfcff;
  color: ${TOKENS.muted};
  font-weight: 900;
`;

export const Content = styled.div`
  max-width: ${TOKENS.maxw};
  margin: 0 auto;
  padding: 16px 16px 28px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${TOKENS.card};
  border: 1px solid ${TOKENS.line};
  border-radius: ${TOKENS.rLg};
  box-shadow: ${TOKENS.shadowMd};
  padding: 16px;
  display: grid;
  gap: 12px;
`;

export const CardHead = styled.div`
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 12px;
  align-items: center;
`;

export const LogoCircle = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 999px;
  background:rgb(236, 243, 253);
  border: 1px solidrgb(209, 228, 250);
  display: grid;
  place-items: center;
  font-weight: 900;
  color: ${TOKENS.primary};
`;

export const CompanyTitle = styled.div`
  font-weight: 900;
  color: ${TOKENS.text};
  letter-spacing: -0.01em;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetaLine = styled.div`
  margin-top: 6px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

export const MetaItem = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: ${TOKENS.muted};
  font-weight: 700;
  font-size: 13px;
`;

export const Dot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #cbd5e1;
  display: inline-block;
`;

export const StatusPill = styled.span<{ tone: StatusTone }>`
  --c: ${({ tone }) =>
    tone === "green"
      ? TOKENS.green
      : tone === "blue"
      ? TOKENS.blue
      : tone === "amber"
      ? TOKENS.amber
      : TOKENS.slate};

  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  background: color-mix(in oklab, var(--c) 12%, white);
  color: var(--c);
  border: 1px solid color-mix(in oklab, var(--c) 22%, white);
`;

export const InfoRow = styled.div`
  display: grid;
  gap: 8px;
`;

export const InfoItem = styled.div`
  display: inline-flex;
  gap: 10px;
  align-items: center;
  color: ${TOKENS.muted};
  font-weight: 700;
  font-size: 13px;

  svg {
    flex: 0 0 auto;
  }
`;

export const Block = styled.div`
  display: grid;
  gap: 8px;
`;

export const BlockTitle = styled.div`
  font-weight: 900;
  color: ${TOKENS.text};
  font-size: 13px;
`;

export const Desc = styled.p`
  margin: 0;
  color: ${TOKENS.muted};
  font-size: 13.5px;
  line-height: 1.45;
`;

export const Badges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Badge = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: ${TOKENS.text};
  font-weight: 800;
  font-size: 12px;
`;

export const Contacts = styled.div`
  display: grid;
  gap: 8px;
`;

export const ContactRow = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 10px;
  align-items: center;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`;

export const ContactLabel = styled.div`
  color: ${TOKENS.muted};
  font-weight: 800;
  font-size: 12.5px;
`;

export const ContactValue = styled.a`
  color: ${TOKENS.text};
  font-weight: 900;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Muted = styled.div`
  color: ${TOKENS.muted};
  font-size: 13px;
  font-weight: 700;
`;

export const Gate = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: ${TOKENS.rMd};
  border: 1px dashed #d3e2ff;
  background: #ffffff;
  color: ${TOKENS.muted};
  font-weight: 800;
  font-size: 13px;
  flex-wrap: wrap;
`;

export const GateBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  font-weight: 900;
  border: 1px solid ${TOKENS.blue};
  background: #eef4ff;
  color: #1d4ed8;
  cursor: pointer;
  transition: transform 0.06s ease, background 0.15s ease;

  &:hover {
    background: #e6efff;
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 4px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const PrimaryBtn = styled.button`
  height: 44px;
  border-radius: ${TOKENS.rMd};
  border: 0;
  cursor: pointer;
  font-weight: 600;
  color: #fff;
  background:${TOKENS.primary};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 2px solid ${TOKENS.primary};
    outline-offset: 2px;
  }
`;

export const SecondaryBtn = styled.button`
  height: 44px;
  border-radius: ${TOKENS.rMd};
  cursor: pointer;
  font-weight: 900;
  color: ${TOKENS.text};
  background: #fff;
  border: 1.5px solid ${TOKENS.line};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${TOKENS.primary};
    background: #ecfdf5;
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const Empty = styled.div`
  background: ${TOKENS.card};
  border: 1px solid ${TOKENS.line};
  border-radius: ${TOKENS.rLg};
  box-shadow: ${TOKENS.shadowMd};
  padding: 34px 18px;
  text-align: center;
  color: ${TOKENS.text};

  h3 {
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 900;
  }
  p {
    margin: 0;
    color: ${TOKENS.muted};
  }
`;

/* ===== skeleton ===== */

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const SkeletonCard = styled.div`
  height: 320px;
  border-radius: ${TOKENS.rLg};
  border: 1px solid ${TOKENS.line};
  background: linear-gradient(90deg, #fff 25%, #f3f6fb 37%, #fff 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s infinite;
  box-shadow: ${TOKENS.shadowSm};

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;


export const PrimaryLink = styled(Link)`
  box-sizing: border-box;

  height: 44px;
  padding: 0 18px;

  border-radius: ${TOKENS.rMd};
  border: 0;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;

  color: #0b1b13;
  background: linear-gradient(
    180deg,
    ${TOKENS.primary} 0%,
    ${TOKENS.primaryHover} 100%
  );
  box-shadow: 0 10px 24px rgba(16, 185, 129, 0.24);
  text-decoration: none;

  transition: transform 0.06s ease, box-shadow 0.15s ease, filter 0.15s ease;

  &:hover {
    filter: brightness(1.02);
    box-shadow: 0 12px 28px rgba(16, 109, 185, 0.28);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${TOKENS.primary};
    outline-offset: 2px;
  }
`;






export const SecondaryLink = styled(Link)`
  box-sizing: border-box;

  height: 44px;
  padding: 0 16px;

  border-radius: ${TOKENS.rMd};
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;

  color: ${TOKENS.text};
  background: #fff;
  border: 1.5px solid ${TOKENS.line};
  text-decoration: none;

  transition: transform 0.06s ease, border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: ${TOKENS.primary};
    background:rgb(255, 255, 255);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${TOKENS.primary};
    outline-offset: 2px;
  }
`;
