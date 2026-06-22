import styled from "@emotion/styled";
import { EditBtn } from "../../../pro-profile-section.style";
const iconCss = `
  & .icon {
width: 18px; height: 18px; opacity: .9;
   
  }
`;

/* ===== Design tokens ===== */
export const UI = {
  max: 1120,
  text: "#0F172A",
  textMuted: "#64748B",
  line: "#E5E7EB",
  lineSoft: "#F3F4F6",
  bg: "#FFFFFF",
  bgSoft: "#FAFAFA",
  primary: "#1E5CFB",
  primaryDark: "#174CDF",
  success: "#16A34A",
  danger: "#DC2626",
  focus: "0 0 0 3px rgba(30, 92, 251, 0.12)",
  rLg: 8,
  rMd: 6,
  rSm: 6,
  shadow: "none",
};

export const ProfList = styled.div`
  display: grid;
  gap: 14px;

  @media (max-width: 640px) {
    gap: 10px;
  }
`;

export const ProfIconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%);
  border: 1px solid rgba(37, 99, 235, 0.12);

  img {
    width: 26px;
    height: 26px;
    opacity: 0.92;
  }

  @media (max-width: 640px) {
    width: 44px;
    height: 44px;
    border-radius: 12px;

    img {
      width: 22px;
      height: 22px;
    }
  }
`;

export const ProfHeadBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
`;

export const JobItem = styled.article`
  position: relative;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  overflow: hidden;
  border: 1px solid ${UI.line};
  border-radius: ${UI.rMd}px;
  background: ${UI.bg};
  padding: 16px;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: #d1d5db;
  }

  @media (max-width: 640px) {
    padding: 14px 12px;
    border-radius: 10px;
    background: ${UI.bgSoft};
  }
`;
export const JobTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
  min-width: 0;
  letter-spacing: -0.01em;
  color: ${UI.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 520px) {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
  }
`;

export const Meta = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: ${UI.textMuted};
  min-width: 0;

  /* длинная дата не должна толкать layout */
  flex-wrap: wrap;
  word-break: break-word;
`;
export const Subtle = styled.div`
  font-size: 14px;
  color: ${UI.textMuted};
  margin-bottom: 12px;
`;

export const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 12px 0 14px;

  @media (max-width: 640px) {
    gap: 6px;
    margin: 10px 0 12px;
  }

  @media (max-width: 360px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    > :nth-child(3) {
      grid-column: 1 / -1;
    }
  }
`;

export const StatPill = styled.div`
  ${iconCss}
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  min-width: 0;

  .icon {
    color: ${UI.primary};
    margin-bottom: 2px;
  }

  > b {
    font-size: 15px;
    font-weight: 800;
    color: ${UI.text};
    line-height: 1.2;
  }

  > span {
    font-size: 11px;
    color: ${UI.textMuted};
    line-height: 1.35;
  }

  @media (max-width: 640px) {
    padding: 10px 8px;
    border-radius: 10px;
    gap: 2px;

    .icon {
      width: 14px;
      height: 14px;
      margin-bottom: 0;
    }

    > b {
      font-size: 13px;
      font-weight: 700;
    }

    > span {
      font-size: 10px;
      line-height: 1.25;
    }
  }
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 2px;
  }
`;

export const SoftPill = styled.span`
  ${iconCss}
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba(37, 99, 235, 0.12);
  background: rgba(37, 99, 235, 0.06);
  font-weight: 700;
  font-size: 12px;
  color: #1d4ed8;

  .icon {
    color: #2563eb;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
    padding: 8px 10px;
    font-size: 11px;
    line-height: 1.25;
    text-align: center;
  }
`;

export const LinkRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const TextLink = styled.button`
  border: 0;
  background: none;
  padding: 0;
  color: ${UI.primary};
  font-weight: 700;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const MutedBar = styled.div`
  margin-top: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  color: ${UI.textMuted};
  font-size: 13px;
  line-height: 1.5;
  min-width: 0;
  flex-wrap: wrap;
  word-break: break-word;

  b {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    color: ${UI.text};
    font-weight: 700;
  }

  @media (max-width: 640px) {
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    line-height: 1.45;
  }
`;
export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${UI.line};
  background: ${UI.bgSoft};
  font-size: 12px;
  color: ${UI.textMuted};
  font-weight: 600;
`;

/* ===== Page shell ===== */
export const Page = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  color: ${UI.text};
  box-sizing: border-box;
`;

export const Header = styled.header`
  margin: 4px 0 18px;
`;

export const Title = styled.h2`
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${UI.text};
`;

export const SectionHint = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: ${UI.textMuted};
  max-width: 720px;
`;

/* ===== Layout ===== */
export const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
  align-items: start;
  width: 100%;
`;

export const Main = styled.div`
  display: grid;
  gap: 18px;
  min-width: 0;
`;

export const Aside = styled.aside`
  position: sticky;
  top: 72px;
  height: fit-content;
  min-width: 0;

  @media (max-width: 1024px) {
    position: static;
  }
`;

/* ===== Cards ===== */
export const Card = styled.section`
  background: ${UI.bg};
  border: 1px solid ${UI.line};
  border-radius: ${UI.rLg}px;
  overflow: hidden;

  @media (max-width: 640px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

export const CardHeader = styled.div`
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 16px 12px;

    > button,
    > a {
      width: 100%;
    }
  }
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${UI.text};
`;

export const CardBody = styled.div`
  padding: 18px 20px 20px;

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

/* ===== Form grid ===== */
export const FormGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns ?? 2}, 1fr);
  gap: 12px 16px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const Input = styled.input`
  height: 40px;
  width: 100%;
  min-width: 0;
  padding: 0 12px;
  background: ${UI.bg};
  border: 1px solid ${UI.line};
  border-radius: ${UI.rSm}px;
  font-size: 16px; /* ✅ iOS no-zoom */
  color: ${UI.text};
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover { border-color: #d7dce3; }
  &:focus { border-color: ${UI.primary}; box-shadow: ${UI.focus}; }

  &::placeholder { color: #9ca3af; }

  @media (min-width: 821px) {
    font-size: 14px;
  }
`;

export const ZoneRow = styled.div`
  width: 100%;
  min-width: 0;

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
`;

export const RadiusBlock = styled.div`
  display: grid;
  gap: 6px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const RadiusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    input {
      width: 100% !important;
    }
  }
`;

export const RemoveBtn = styled(EditBtn)`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.span`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${UI.textMuted};
  margin-bottom: 8px;

  @media (max-width: 640px) {
    font-size: 12px;
    margin-bottom: 6px;
  }
`;

export const Help = styled.span`
  font-size: 13px;
  color: ${UI.textMuted};
`;

/* ===== Inputs ===== */


export const HeadRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;

  min-width: 0;

  flex-wrap: wrap;

  > :first-child {
    min-width: 0;
    flex: 1 1 160px;
  }

  > :last-child {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
    flex: 0 1 auto;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 8px;

    > :first-child {
      flex: 1 1 auto;
    }

    > :last-child {
      width: 100%;
      justify-content: stretch;
    }
  }
`;

export const HeadActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  a {
    text-decoration: none;
    display: block;
    min-width: 0;
  }

  @media (max-width: 640px) {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    a,
    button {
      width: 100%;
      min-width: 0;
    }
  }
`;



export const SelectBox = styled.div`
  position: relative;
  > .trigger {
    height: 40px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid ${UI.line};
    border-radius: ${UI.rSm}px;
    background: ${UI.bg};
    cursor: pointer;
    font-size: 14px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  &:has(.trigger:focus-visible) .trigger {
    border-color: ${UI.primary};
    box-shadow: ${UI.focus};
  }
`;

export const Inline = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

/* ===== Switch / Toggle group ===== */
export const ToggleGroup = styled.div`
  display: inline-flex;
  border: 1px solid ${UI.line};
  border-radius: ${UI.rSm}px;
  padding: 2px;
  background: ${UI.bgSoft};
`;
export const Toggle = styled.button<{ active?: boolean }>`
  border: 0;
  background: ${({ active }) => (active ? UI.bg : "#0000")};
  padding: 8px 12px;
  border-radius: ${UI.rSm - 2}px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ active }) => (active ? UI.primary : UI.textMuted)};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  &:hover {
    background: #fff;
  }
`;

/* ===== Upload ===== */
export const Upload = styled.label`
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  padding: 22px 16px;
  background: linear-gradient(180deg, #fafbfd 0%, #f8fafc 100%);
  display: grid;
  gap: 6px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: #94a3b8;
    background: #f1f5f9;
  }

  input {
    display: none;
  }
`;

/* ===== Doc list ===== */
export const DocList = styled.div`
  display: grid;
  gap: 10px;
`;

export const DocItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  background: #fafbfd;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

/* ===== Notices ===== */
export const Notice = styled.div<{ tone?: "success" | "error" | "neutral" }>`
  border-radius: 14px;
  padding: 18px 16px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  border: 1px dashed
    ${({ tone }) =>
      tone === "success"
        ? "rgba(22,163,74,.35)"
        : tone === "error"
        ? "rgba(220,38,38,.35)"
        : "#cbd5e1"};
  background: ${({ tone }) =>
    tone === "success"
      ? "rgba(22,163,74,.06)"
      : tone === "error"
      ? "rgba(220,38,38,.06)"
      : "#f8fafc"};
  color: ${({ tone }) =>
    tone === "success"
      ? UI.success
      : tone === "error"
      ? UI.danger
      : UI.textMuted};
`;

/* ===== Buttons ===== */
export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const PrimaryBtn = styled.button`
  ${iconCss}
  height: 40px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 11px;
  background: linear-gradient(180deg, ${UI.primary} 0%, ${UI.primaryDark} 100%);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.22);
  transition: transform 0.12s ease, box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.28);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

export const ProfCardHeader = styled(CardHeader)`
  @media (max-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 14px 16px 12px;

    > :first-child {
      flex: 1;
      min-width: 0;
    }
  }
`;

export const ProfCreateBtn = styled(PrimaryBtn)`
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: auto;
    height: 36px;
    padding: 0 12px;
    font-size: 12px;
    box-shadow: none;
    white-space: nowrap;
  }

  @media (max-width: 380px) {
    padding: 0 10px;

    .create-label {
      display: none;
    }
  }
`;

export const ProfEditBtn = styled(EditBtn)`
  @media (max-width: 640px) {
    width: 100%;
    max-width: none;
    padding: 9px 10px;
    font-size: 13px;
    border-radius: 8px;
    justify-content: center;
  }
`;

export const ProfResumeBtn = styled(EditBtn)`
  @media (max-width: 640px) {
    width: 100%;
    max-width: none;
    padding: 9px 10px;
    font-size: 13px;
    border-radius: 8px;
    justify-content: center;
  }

  @media (max-width: 400px) {
    .resume-label {
      display: none;
    }
  }
`;

export const GhostBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 11px;
  border: 1px solid ${UI.line};
  background: #fff;
  color: ${UI.text};
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;

  &:hover {
    background: ${UI.bgSoft};
    border-color: #cbd5e1;
  }
`;

/* ===== Progress ===== */
export const Progress = styled.div`
  height: 8px;
  background: #eef2f7;
  border-radius: 999px;
  overflow: hidden;

  > i {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #60a5fa);
    transition: width 0.25s ease;
  }
`;

export const ProgressMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  color: ${UI.textMuted};
  font-weight: 600;
`;

/* ===== Tiny muted text ===== */
export const Small = styled.small`
  color: ${UI.textMuted};
  font-size: 13px;
`;
