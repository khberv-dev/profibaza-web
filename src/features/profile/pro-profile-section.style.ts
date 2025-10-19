// src/features/profile/pages/ProProfileSection.style.ts
import styled from "@emotion/styled";

/* ===== Spacing & tokens ===== */
const padMobile = 18;
const padTablet = 22;
const padDesktop = 28;

const gapMobile = 14;
const gapTablet = 20;
const gapDesktop = 28;

const colStickyMin = 260; // px
const colStickyMax = 360; // px;

/* ===== Section title ===== */
export const SectionTitle = styled.h2`
  margin: 26px 0 18px;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;

  @media (min-width: 1200px) {
    margin: 32px 0 20px;
    font-size: 22px;
  }
`;

/* ===== Card ===== */
export const Card = styled.section`
  border: 1px solid #e9edf5;
  border-radius: 16px;
  background: #ffffff;
  margin-bottom: 28px;
  margin-top: 14px;
  //   box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
`;

/* padded content */
export const CardBody = styled.div`
  padding: ${padMobile}px;

  // @media (min-width: 640px) {
  //   padding: ${padTablet}px;
  // }
  // @media (min-width: 1024px) {
  //   padding: ${padDesktop}px;
  // }
`;

export const EditBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  gap: 8px;
  color: #0f172a;
  background: #f1f4f9;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
  transition: all 0.15s ease;
  width: max-content;

  svg {
    color: #0f172a !important;
    flex-shrink: 0;
  }

  &:hover {
    background: #f1f5f9;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  }

  &:active {
    transform: translateY(1px);
    background: #e2e8f0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
    box-shadow: none;
  }
`;

export const CancelBtn = styled(EditBtn)`
  color: #1e40af;
  background: #eff6ff;
  border-color: #bfdbfe;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }

  &:active {
    background: #bfdbfe;
  }
`;

/* ===== Buttons ===== */
export const PrimaryBtn = styled.button`
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  border: 0;
  background: #1e5cfb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.08s ease, box-shadow 0.2s ease;
  box-shadow: 0 6px 14px rgba(30, 92, 251, 0.18);

  &:hover:not(:disabled) {
    background: #174cdf;
    box-shadow: 0 8px 18px rgba(30, 92, 251, 0.22);
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.6;
    box-shadow: none;
    cursor: default;
  }
`;

export const GhostBtn = styled.button`
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid #e7ecf3;
  background: #fff;
  color: #1e5cfb;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.08s ease, border-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #f4f7ff;
    border-color: #cfe0ff;
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

/* ===== Notice ===== */
export const Notice = styled.div<{ tone?: "error" | "muted" }>`
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 14px;
  margin-top: 14px;
  background: ${(p) =>
    p.tone === "error"
      ? "#fef2f2"
      : p.tone === "muted"
      ? "#f5f8fc"
      : "#f8fafc"};
  color: ${(p) =>
    p.tone === "error"
      ? "#7f1d1d"
      : p.tone === "muted"
      ? "#475569"
      : "#0f172a"};
  border: 1px solid
    ${(p) =>
      p.tone === "error"
        ? "#fee2e2"
        : p.tone === "muted"
        ? "#e7ecf3"
        : "#e7ecf3"};
`;

/* ===== Grids ===== */
export const Row = styled.div`
  display: grid;
  gap: ${gapMobile + 2}px;
  grid-template-columns: 1fr;
  margin-top: 18px;

  @media (min-width: 820px) {
    gap: ${gapTablet + 2}px;
    /* чтобы контент не выпирал за колонку */
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  @media (min-width: 1280px) {
    gap: ${gapDesktop}px;
  }

  /* все прямые дети не расширяются сверх контейнера */
  & > * {
    min-width: 0;
    max-width: 100%;
  }
`;

/* Left rail sticky + right content */
export const RailRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${gapMobile + 4}px;

  @media (min-width: 980px) {
    grid-template-columns: clamp(${colStickyMin}px, 26vw, ${colStickyMax}px) minmax(
        0,
        1fr
      );
    gap: ${gapTablet + 4}px;
  }
  @media (min-width: 1280px) {
    gap: ${gapDesktop + 4}px;
  }

  /* липкий левый сайдбар — в духе HH */
  @media (min-width: 1024px) {
    & > :first-of-type {
      position: sticky;
      top: 18px; /* чётко под шапкой */
      align-self: start;
    }
  }

  & > * {
    min-width: 0;
    max-width: 100%;
  }
`;

/* ===== Fields ===== */
export const Field = styled.label`
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: visible; /* если вдруг внутри будет длинная строка */
  & > * + * {
    margin-top: 10px;
  }

  @media (min-width: 1024px) {
    & > * + * {
      margin-top: 12px;
    }
  }
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #0f172a;
  margin-bottom: 6px;
  text-transform: none;
  overflow-wrap: anywhere;
`;

export const Input = styled.input`
  width: 100%;
  max-width: 100%;
  height: 46px;
  border: 1px solid #e7ecf3;
  border-radius: 12px;
  padding: 0 14px;
  background: #fff;
  outline: none;
  box-sizing: border-box; /* защищаем от переполнения */
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    background 0.15s ease;

  &::placeholder {
    color: #9aa5b1;
  }
  &:hover {
    border-color: #d7deeb;
    background: #fcfdff;
  }
  &:focus {
    border-color: #1e5cfb;
    box-shadow: 0 0 0 4px rgba(30, 92, 251, 0.08);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  max-width: 100%;
  min-height: 110px;
  border: 1px solid #e7ecf3;
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff;
  outline: none;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    background 0.15s ease;

  &::placeholder {
    color: #9aa5b1;
  }
  &:hover {
    border-color: #d7deeb;
    background: #fcfdff;
  }
  &:focus {
    border-color: #1e5cfb;
    box-shadow: 0 0 0 4px rgba(30, 92, 251, 0.08);
  }
`;

export const Hint = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
  overflow-wrap: anywhere;
`;

/* ===== Chips ===== */
export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  min-width: 0;
  max-width: 100%;
`;

export const ChipsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  max-width: 100%;
`;

export const Chip = styled.button<{ active?: boolean }>`
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.active ? "#1e5cfb" : "#e7ecf3")};
  background: ${(p) => (p.active ? "#eef3ff" : "#fff")};
  color: ${(p) => (p.active ? "#0f1e5f" : "#0f172a")};
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s ease;
  white-space: nowrap;
  max-width: 100%;

  &:hover {
    background: ${(p) => (p.active ? "#e4ebff" : "#f8fafc")};
    border-color: ${(p) => (p.active ? "#bfd0ff" : "#e7ecf3")};
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const RailChip = styled(Chip)`
  width: 100%;
  justify-content: flex-start;
`;

/* ===== Switches ===== */
export const SwitchWrap = styled.div`
  display: inline-flex;
  border: 1px solid #e7ecf3;
  border-radius: 12px;
  overflow: hidden;
  max-width: 100%;
`;

export const SwitchBtn = styled.button<{ active?: boolean }>`
  min-height: 38px;
  padding: 0 18px;
  border: 0;
  background: ${(p) => (p.active ? "#1e5cfb" : "#fff")};
  color: ${(p) => (p.active ? "#fff" : "#0f172a")};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  max-width: 100%;
`;

/* ===== Upload ===== */
export const Upload = styled.label`
  display: grid;
  place-items: center;
  text-align: center;
  gap: 10px;
  min-height: 170px;
  padding: 14px;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  background: #fafbff;
  color: #334155;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.08s ease,
    box-shadow 0.2s ease;

  &:hover {
    background: #f3f6ff;
    border-color: #b9cdfd;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
  }
  &:active {
    transform: translateY(1px);
  }

  @media (min-width: 1024px) {
    min-height: 190px;
  }
`;

/* ===== Price: каждый инпут с новой строки и без переполнений ===== */
export const PriceRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  & > * {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  @media (min-width: 1024px) {
    gap: 18px;
  }
`;

/* ===== Inline groups ===== */
export const Inline = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  max-width: 100%;

  & > * {
    min-width: 0;
    max-width: 100%;
  }

  @media (min-width: 1280px) {
    gap: 16px;
  }
`;

/* ===== Pills / small text ===== */
export const PillLink = styled.button`
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid #e7ecf3;
  background: #fff;
  font-weight: 600;
  color: #1e5cfb;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.08s ease;

  &:hover {
    background: #f2f6ff;
    border-color: #cfe0ff;
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const Small = styled.div`
  font-size: 12px;
  color: #64748b;
  overflow-wrap: anywhere;
`;

/* ===== Divider ===== */
export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #eef2f7;
  margin: 22px 0;

  @media (min-width: 1024px) {
    margin: 26px 0;
  }
`;

export const HotRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

export const HotChip = styled.button<{ active?: boolean }>`
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.active ? "#1e5cfb" : "#e7ecf3")};
  background: ${(p) => (p.active ? "#eef3ff" : "#fff")};
  color: ${(p) => (p.active ? "#0f1e5f" : "#0f172a")};
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${(p) => (p.active ? "#e4ebff" : "#f8fafc")};
  }
`;

export const ProfPickerWrap = styled.div`
  position: relative;
  border: 1px solid #e7ecf3;
  border-radius: 12px;
  padding: 8px;
  background: #fff;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;

  &:focus-within {
    border-color: #1e5cfb;
    box-shadow: 0 0 0 4px rgba(30, 92, 251, 0.08);
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 10px;
  background: #f1f5f9;
  color: #0f172a;
  border-radius: 999px;
  font-weight: 600;

  & > button {
    background: transparent;
    border: 0;
    color: #64748b;
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
  }
`;

export const InputBase = styled.input`
  min-width: 180px;
  flex: 1 1 auto;
  border: 0;
  outline: none;
  height: 30px;
  padding: 0 6px;
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;

  &::placeholder {
    color: #9aa5b1;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  z-index: 10;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  background: #fff;
  border: 1px solid #e7ecf3;
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  padding: 8px;
  max-height: 280px;
  overflow: auto;
`;

export const GroupLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin: 8px 6px 6px;
`;

export const OptionRow = styled.button`
  width: 100%;
  text-align: left;
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  gap: 8px;
  padding: 10px 10px;
  border-radius: 10px;
  background: #fff;
  border: 0;
  cursor: pointer;
  transition: background 0.12s ease;

  &:hover {
    background: #f8fafc;
  }

  & > span {
    font-size: 15px;
    color: #0f172a;
    font-weight: 500;
    overflow-wrap: anywhere;
  }
`;

export const OptionCheck = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid #cbd5e1;
  display: inline-block;
  position: relative;

  &[data-active="true"] {
    border-color: #1e5cfb;
    background: #1e5cfb;
  }

  &[data-active="true"]::after {
    content: "";
    position: absolute;
    left: 3px;
    top: 1px;
    width: 8px;
    height: 12px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

export const Empty = styled.div`
  padding: 12px;
  color: #64748b;
  font-size: 14px;
`;

export const AddGhost = styled.button`
  border: 0;
  background: transparent;
  color: #1e5cfb;
  font-weight: 800;
  cursor: pointer;
`;
