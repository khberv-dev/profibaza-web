import styled from "@emotion/styled";
const iconCss = `
  & .icon {
width: 18px; height: 18px; opacity: .9;
   
  }
`;

/* ===== Design tokens (HH-like) ===== */
export const UI = {
  max: 1860,
  text: "#0F172A",
  textMuted: "#475569",
  line: "#E5E7EB",
  lineSoft: "#F1F5F9",
  bg: "#FFFFFF",
  bgSoft: "#F8FAFC",
  primary: "#2C64FF",
  primaryHover: "#1F4DE0",
  success: "#16A34A",
  danger: "#DC2626",
  focus: "0 0 0 3px rgba(44,100,255,.18)",
  rLg: 16,
  rMd: 12,
  rSm: 10,
  shadow: "0 8px 24px rgba(15, 23, 42, .06)",
};

export const JobItem = styled.div`
  border: 1px solid ${UI.line};
  border-radius: 21px;
  background: ${UI.bg};
  padding: 16px;
  transition: box-shadow 0.15s ease, transform 0.05s ease,
    border-color 0.15s ease;
  &:hover {
    box-shadow: ${UI.shadow};
    border-color: #dbe2ea;
  }
`;

export const JobTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 4px 0;
`;

export const Subtle = styled.div`
  font-size: 12px;
  color: ${UI.textMuted};
  margin-bottom: 12px;
`;

export const StatRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0 14px;
`;

export const StatPill = styled.div`
  ${iconCss}
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  // border: 1px solid ${UI.line};
  border-radius: 12px;
  background: #f1f4f9;
  > b {
    font-size: 14px;
    font-weight: 800;
  }
  > span {
    font-size: 12px;
    color: ${UI.textMuted};
    white-space: nowrap;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

export const SoftPill = styled.span`
  ${iconCss}
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 122px;
  // background: #f1f4f9;
  border: 1px solid ${UI.line};
  font-weight: 700;
  font-size: 12px;
  color: ${UI.textMuted};
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
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: ${UI.rMd}px;
  background: #f1f4f9;
  // border: 1px solid ${UI.lineSoft};
  color: ${UI.textMuted};
  font-size: 13px;
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
  max-width: ${UI.max}px;
  margin: 0 auto;
  padding: 24px;
  color: ${UI.text};
  @media (max-width: 960px) {
    // padding: 16px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

/* ===== Layout (Main + Aside) ===== */
export const Layout = styled.section`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const Main = styled.div`
  display: grid;
  gap: 16px;
`;

export const Aside = styled.aside`
  position: sticky;
  top: 16px;
  height: fit-content;
  @media (max-width: 1100px) {
    position: static;
  }
`;

/* ===== Cards ===== */
export const Card = styled.section`
  background: ${UI.bg};
  border: 1px solid ${UI.line};
  border-radius: ${UI.rLg}px;
  box-shadow: ${UI.shadow};
`;

export const CardHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid ${UI.line};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
`;

export const CardBody = styled.div`
  padding: 16px;
`;

/* ===== Form grid ===== */
export const FormGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns ?? 2}, 1fr);
  gap: 12px 16px;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${UI.textMuted};
`;

export const Help = styled.span`
  font-size: 12px;
  color: ${UI.textMuted};
`;

/* ===== Inputs ===== */
export const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  background: ${UI.bg};
  border: 1px solid ${UI.line};
  border-radius: ${UI.rSm}px;
  font-size: 14px;
  color: ${UI.text};
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover {
    border-color: #d7dce3;
  }
  &:focus {
    border-color: ${UI.primary};
    box-shadow: ${UI.focus};
  }
  &::placeholder {
    color: #9ca3af;
  }
`;

export const HeadRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
`;

export const Meta = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: ${UI.textMuted};
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
  border: 1px dashed ${UI.line};
  border-radius: ${UI.rSm}px;
  padding: 14px;
  background: ${UI.bgSoft};
  display: grid;
  gap: 6px;
  cursor: pointer;
  &:hover {
    background: #f3f6fb;
  }
  input {
    display: none;
  }
`;

/* ===== Doc list ===== */
export const DocList = styled.div`
  display: grid;
  gap: 8px;
`;
export const DocItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid ${UI.line};
  border-radius: ${UI.rSm}px;
  background: ${UI.bg};
`;

/* ===== Notices ===== */
export const Notice = styled.div<{ tone?: "success" | "error" | "neutral" }>`
  border-radius: ${UI.rSm}px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid
    ${({ tone }) =>
      tone === "success"
        ? "rgba(22,163,74,.25)"
        : tone === "error"
        ? "rgba(220,38,38,.25)"
        : UI.line};
  background: ${({ tone }) =>
    tone === "success"
      ? "rgba(22,163,74,.06)"
      : tone === "error"
      ? "rgba(220,38,38,.06)"
      : UI.bgSoft};
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
`;

export const PrimaryBtn = styled.button`
  ${iconCss}
  height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: ${UI.rSm}px;
  background: ${UI.primary};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.05s ease, background 0.15s ease, box-shadow 0.15s ease;
  &:hover {
    background: ${UI.primaryHover};
  }
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GhostBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: ${UI.rSm}px;
  border: 1px solid ${UI.line};
  background: #0000;
  color: ${UI.text};
  cursor: pointer;
  font-weight: 700;
  &:hover {
    background: ${UI.bgSoft};
  }
`;

/* ===== Progress ===== */
export const Progress = styled.div`
  height: 6px;
  background: ${UI.lineSoft};
  border-radius: 999px;
  overflow: hidden;
  > i {
    display: block;
    height: 100%;
    background: ${UI.success};
    transition: width 0.2s;
  }
`;

/* ===== Tiny muted text ===== */
export const Small = styled.small`
  color: ${UI.textMuted};
  font-size: 12px;
`;
