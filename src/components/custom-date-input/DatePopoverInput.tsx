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
          onChange={(e) => field.onChange(e.target.value)} // ручной ввод тоже ок
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={field.onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          hasError={hasError}
          aria-invalid={hasError}
          type="text" // показываем как обычный текст, чтобы не всплывал нативный календарь
          inputMode="none"
          readOnly // можно переключить на false, если хочешь ручной ввод
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
