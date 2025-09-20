import { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { PiCaretDownBold, PiCheckBold } from "react-icons/pi";

export type SelectOption = { value: string | number; label: string };

type Props = {
  options: SelectOption[];
  value?: string | number | null;
  onChange: (value: string | number | null, option?: SelectOption) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  menuMaxHeight?: number; // px
  width?: number | string;
  id?: string;
};

const Wrap = styled.div<{ $w?: number | string }>`
  position: relative;
  width: ${({ $w }) => (typeof $w === "number" ? `${$w}px` : $w || "100%")};
`;

const Trigger = styled.button<{ disabled?: boolean }>`
  height: 38px;
  width: 100%;
  padding: 0 36px 0 12px;
  border-radius: 10px;
  border: 1px solid #e7ecf3;
  background: #fff;
  color: #0f172a;
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    transform 0.06s ease;

  &:hover {
    border-color: ${({ disabled }) => (disabled ? "#e7ecf3" : "#dfe7f1")};
  }
  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(30, 92, 251, 0.2);
  }
  &:disabled {
    background: #f9fafb;
    color: #94a3b8;
  }
`;

const Caret = styled.span`
  position: absolute;
  right: 10px;
  top: 0;
  height: 100%;
  display: grid;
  place-items: center;
  pointer-events: none;
  color: #64748b;
`;

const Menu = styled.div<{ $maxh: number }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 40;
  border: 1px solid #e7ecf3;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(2, 32, 71, 0.12);
  overflow: auto;
  max-height: ${({ $maxh }) => `${$maxh}px`};
`;

const Item = styled.div<{ $active?: boolean; $selected?: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 20px;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: ${({ $active }) => ($active ? "#0f172a" : "#111827")};
  background: ${({ $active }) => ($active ? "#f5f7fb" : "#fff")};
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;

  &:hover {
    background: #f5f7fb;
  }

  .check {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    display: ${({ $selected }) => ($selected ? "grid" : "none")};
    place-items: center;
    background: #1e5cfb;
    color: #fff;
    box-shadow: 0 4px 12px rgba(30, 92, 251, 0.25);
  }
`;

const Hint = styled.div`
  padding: 10px 12px;
  font-size: 13px;
  color: #667085;
`;

const Divider = styled.div`
  height: 1px;
  background: #eef2f6;
`;

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "—",
  disabled,
  loading,
  menuMaxHeight = 280,
  width,
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = id ? `${id}-listbox` : undefined;

  const selectedIndex = useMemo(
    () => options.findIndex((o) => String(o.value) === String(value ?? "")),
    [options, value]
  );
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    // при открытии подсветим текущий выбранный
    if (open) setHighlight(selectedIndex);
  }, [open, selectedIndex]);

  const choose = (idx: number) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value, opt);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlight >= 0) choose(highlight);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => {
        const next = Math.min(options.length - 1, (h < 0 ? -1 : h) + 1);
        return next;
      });
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, (h < 0 ? 0 : h) - 1));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setHighlight(options.length - 1);
      return;
    }
  };

  return (
    <Wrap ref={wrapRef} $w={width}>
      <Trigger
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => !disabled && !loading && setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        {loading ? "…" : selected?.label || placeholder}
        <Caret>
          <PiCaretDownBold />
        </Caret>
      </Trigger>

      {open && (
        <Menu role="listbox" id={listId} $maxh={menuMaxHeight}>
          {loading && <Hint>Загрузка…</Hint>}
          {!loading && options.length === 0 && <Hint>Нет вариантов</Hint>}
          {!loading &&
            options.map((opt, idx) => (
              <Item
                key={String(opt.value)}
                role="option"
                aria-selected={selectedIndex === idx}
                $active={highlight === idx}
                $selected={selectedIndex === idx}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => choose(idx)}
              >
                <span>{opt.label}</span>
                <span className="check">
                  <PiCheckBold />
                </span>
              </Item>
            ))}
          {!loading && options.length > 0 && <Divider />}
          {!loading && (
            <Hint style={{ fontSize: 12 }}>Esc — закрыть • ↑/↓ — выбор</Hint>
          )}
        </Menu>
      )}
    </Wrap>
  );
}

export default CustomSelect;
