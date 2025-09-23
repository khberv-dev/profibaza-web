// src/features/search/pages/components/CustomSelect.tsx
import React, { useEffect, useId, useRef, useState } from "react";
import {
  SortSelect,
  SelectBtn,
  Caret,
  SelectMenu,
  SelectOption,
} from "../../masters-search.style";

export type Option<T extends string | number> = { value: T; label: string };

type Props<T extends string | number> = {
  options: Option<T>[];
  value: T | null | undefined;
  onChange: (val: T) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  width?: number | string;
  onOpenChange?: (open: boolean) => void;
};

function CustomSelect<T extends string | number>({
  options,
  value,
  onChange,
  label,
  placeholder = "Выберите…",
  disabled = false,
  width = 220,
  onOpenChange,
}: Props<T>) {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);

  const currentIdx = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const currentLabel = options[currentIdx]?.label ?? placeholder;

  // открыть — сфокусироваться на текущем и прокрутить к нему
  useEffect(() => {
    if (!open) return;
    const idx = currentIdx === -1 ? 0 : currentIdx;
    setFocusIdx(idx);
    // небольшой тик для корректной прокрутки после рендера
    requestAnimationFrame(() => {
      optionRefs.current[idx]?.scrollIntoView({ block: "nearest" });
    });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // клик вне — закрываем
  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        onOpenChange?.(false);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [onOpenChange]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((v) => {
      onOpenChange?.(!v);
      return !v;
    });
  };

  const closeMenu = () => {
    setOpen(false);
    onOpenChange?.(false);
    btnRef.current?.focus();
  };

  // клавиатура
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    // открытие по Enter/Space/ArrowDown
    if (!open && ["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      onOpenChange?.(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIdx((i) => (i + 1) % options.length);
      optionRefs.current[(focusIdx + 1) % options.length]?.scrollIntoView({
        block: "nearest",
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIdx((i) => (i - 1 + options.length) % options.length);
      optionRefs.current[
        (focusIdx - 1 + options.length) % options.length
      ]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocusIdx(0);
      optionRefs.current[0]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "End") {
      e.preventDefault();
      setFocusIdx(options.length - 1);
      optionRefs.current[options.length - 1]?.scrollIntoView({
        block: "nearest",
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[focusIdx];
      if (opt) onChange(opt.value);
      closeMenu();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
    }
  };

  return (
    <SortSelect ref={rootRef} style={{ width }}>
      {label && (
        <label
          htmlFor={`${uid}-btn`}
          style={{ fontWeight: 800, marginRight: 8 }}
        >
          {label}
        </label>
      )}

      <SelectBtn
        id={`${uid}-btn`}
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-open={open}
      >
        <span>{currentLabel}</span>
        <Caret />
      </SelectBtn>

      {open && (
        <SelectMenu
          role="listbox"
          aria-activedescendant={`${uid}-opt-${focusIdx}`}
        >
          {options.map((opt, idx) => {
            const selected = value === opt.value;
            return (
              <SelectOption
                key={String(opt.value)}
                id={`${uid}-opt-${idx}`}
                role="option"
                ref={(el) => {
                  optionRefs.current[idx] = el;
                }}
                aria-selected={selected}
                data-active={idx === focusIdx}
                onMouseEnter={() => setFocusIdx(idx)}
                onClick={() => {
                  onChange(opt.value);
                  closeMenu();
                }}
              >
                {opt.label}
              </SelectOption>
            );
          })}
        </SelectMenu>
      )}
    </SortSelect>
  );
}

export default CustomSelect;
