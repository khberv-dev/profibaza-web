import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Controller } from "react-hook-form";
import {
  InputWrapper,
  Label,
  Description,
  HelperText,
  ErrorText,
  InputContainer,
  StyledInput,
} from "../custom-input/style"; // ← твои стили
import {
  PopWrap,
  Panel,
  CalHeader,
  CalControls,
  CalTitle,
  Grid,
  WeekCell,
  DayCellBtn,
  FooterRow,
} from "./date-popover.style";

type Props = {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  helperText?: string;
  rules?: any;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  // Твоя кастомная иконка/кнопка справа (необязательно). Никакой встроенной иконки нет.
  rightSlot?: React.ReactNode;
};

dayjs.locale("ru");

const startOfWeek = (d: dayjs.Dayjs) => d.startOf("week").add(1, "day"); // понедельник
const endOfWeek = (d: dayjs.Dayjs) => d.endOf("week").add(1, "day");


function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

/** Превращает произвольный ввод в YYYY-MM-DD с автодефисами по мере набора */
function maskToYMD(raw: string): string {
  // берём только цифры, максимум 8 шт (YYYYMMDD)
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  // YYYY
  const y = digits.slice(0, 4);
  if (digits.length <= 4) return y;

  // MM
  let m = digits.slice(4, 6);
  // нормализуем месяц в 01..12
  const mNum = clamp(parseInt(m || "0", 10), 1, 12);
  if (m.length === 1 && parseInt(m, 10) > 1) {
    // если первая цифра месяца >1 — добавим ведущий 0: "3" → "03"
    m = `0${m}`;
  } else if (m.length === 2) {
    m = String(mNum).padStart(2, "0");
  }

  if (digits.length <= 6) return `${y}-${m}`;

  // DD
  let d = digits.slice(6, 8);
  // нормализуем день 01..31 (простая защита, без учёта месяца)
  const dNum = clamp(parseInt(d || "0", 10), 1, 31);
  if (d.length === 1 && parseInt(d, 10) > 3) {
    d = `0${d}`;
  } else if (d.length === 2) {
    d = String(dNum).padStart(2, "0");
  }

  return `${y}-${m}-${d}`;
}

/** На blur пытаемся довести значение до строгого YYYY-MM-DD или очистить, если всё пусто */
function normalizeOnBlur(v: string): string {
  const digits = v.replace(/\D/g, "");
  if (!digits) return "";
  const masked = maskToYMD(v);
  // Проверим валидность через dayjs в строгом режиме
  const d = dayjs(masked, "YYYY-MM-DD", true);
  if (d.isValid()) return masked;
  // Если неполная дата типа "2025-01", оставим как есть (пусть покажет ошибку в rules)
  return masked;
}


export function DatePopoverInput({
  control,
  name,
  label,
  placeholder = "ГГГГ-ММ-ДД",
  required,
  disabled,
  description,
  helperText,
  rules,
  min,
  max,
  rightSlot,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <DateInner
          field={field}
          fieldState={fieldState}
          label={label}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          description={description}
          helperText={helperText}
          min={min}
          max={max}
          rightSlot={rightSlot}
        />
      )}
    />
  );
}

function DateInner({
  field,
  fieldState,
  label,
  placeholder,
  required,
  disabled,
  description,
  helperText,
  min,
  max,
  rightSlot,
}: any) {
  const hasError = !!fieldState?.error;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const selected = field.value ? dayjs(field.value) : null;
  const [viewMonth, setViewMonth] = useState<dayjs.Dayjs>(
    selected ?? dayjs()
  );

  useEffect(() => {
    if (selected) setViewMonth(selected);
  }, [field.value]); // если дата изменилась извне

  const minD = useMemo(() => (min ? dayjs(min) : null), [min]);
  const maxD = useMemo(() => (max ? dayjs(max) : null), [max]);

  // закрытие по клику вне
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current || !anchorRef.current) return;
      if (
        !panelRef.current.contains(t) &&
        !anchorRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const weeks = useMemo(() => {
    const start = startOfWeek(viewMonth.startOf("month"));
    const end = endOfWeek(viewMonth.endOf("month"));
    const days: dayjs.Dayjs[] = [];
    let cur = start;
    while (cur.isBefore(end) || cur.isSame(end, "day")) {
      days.push(cur);
      cur = cur.add(1, "day");
    }
    // разбиваем на недели по 7
    const chunks: dayjs.Dayjs[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      chunks.push(days.slice(i, i + 7));
    }
    return chunks;
  }, [viewMonth]);

  const isDisabledDate = (d: dayjs.Dayjs) => {
    if (minD && d.isBefore(minD, "day")) return true;
    if (maxD && d.isAfter(maxD, "day")) return true;
    return false;
  };

  const onPick = (d: dayjs.Dayjs) => {
    if (disabled || isDisabledDate(d)) return;
    field.onChange(d.format("YYYY-MM-DD"));
    setOpen(false);
  };

  const goPrev = () => setViewMonth((m: dayjs.Dayjs) => m.subtract(1, "month"));
  const goNext = () => setViewMonth((m: dayjs.Dayjs) => m.add(1, "month"));
  const clear = () => field.onChange("");

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <InputWrapper>
      {label && (
        <Label>
          {label} {required && <span style={{ color: "#ef4444" }} aria-hidden>*</span>}
        </Label>
      )}

      {/* Anchor: инпут без иконки; поповер всплывает отсюда */}
      <InputContainer ref={anchorRef}>
      <StyledInput
  value={field.value || ""}

  onChange={(e) => {
    const next = maskToYMD(e.target.value);
    field.onChange(next);
  }}

  onBlur={(e) => {
    const normalized = normalizeOnBlur(e.target.value);
    field.onChange(normalized);
    field.onBlur();
  }}

  onClick={() => setOpen((v) => !v)}
  placeholder={placeholder}
  required={required}
  disabled={disabled}
  hasError={hasError}
  aria-invalid={hasError}
  type="text"
  inputMode="numeric"
/>
        {/* твоя кастомная иконка/кнопка: опционально */}
        {rightSlot ?? null}

        {/* Поповер */}
        {open && !disabled && (
          <PopWrap ref={panelRef} role="dialog" aria-modal="true">
            <Panel>
              <CalHeader>
                <CalControls>
                  <button type="button" onClick={goPrev} aria-label="Предыдущий месяц">‹</button>
                  <CalTitle>{viewMonth.format("MMMM YYYY")}</CalTitle>
                  <button type="button" onClick={goNext} aria-label="Следующий месяц">›</button>
                </CalControls>
              </CalHeader>

              <Grid>
                {weekDays.map((w) => (
                  <WeekCell key={w}>{w}</WeekCell>
                ))}

                {weeks.map((week, wi) =>
                  week.map((d) => {
                    const isSel = !!(selected && d.isSame(selected, "day"));
                    const isToday = d.isSame(dayjs(), "day");
                    const isOther = !d.isSame(viewMonth, "month");
                    const dis = isDisabledDate(d);

                    return (
                      <DayCellBtn
                        key={`${wi}-${d.format("YYYY-MM-DD")}`}
                        data-other={isOther || undefined}
                        data-today={isToday || undefined}
                        aria-current={isToday ? "date" : undefined}
                        aria-pressed={isSel}
                        data-selected={isSel || undefined}
                        disabled={dis}
                        onClick={() => onPick(d)}
                        type="button"
                        title={d.format("DD.MM.YYYY")}
                      >
                        {d.date()}
                      </DayCellBtn>
                    );
                  })
                )}
              </Grid>

              <FooterRow>
                <button
                  type="button"
                  onClick={() => setViewMonth(dayjs())}
                  className="link"
                >
                  Сегодня
                </button>
                <div className="spacer" />
                <button type="button" onClick={clear} className="ghost">
                  Очистить
                </button>
                <button type="button" onClick={() => setOpen(false)} className="primary">
                  Готово
                </button>
              </FooterRow>
            </Panel>
          </PopWrap>
        )}
      </InputContainer>

      {description && <Description>{description}</Description>}
      {helperText && <HelperText hasError={hasError}>{helperText}</HelperText>}
      {hasError && <ErrorText>{fieldState?.error?.message}</ErrorText>}
    </InputWrapper>
  );
}
