import { useEffect, useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { Control, Controller } from "react-hook-form";

/* ===== Стили ===== */
const OTPWrap = styled.div<{ hasError?: boolean }>`
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
  justify-content: center;
  margin: 6px 0 4px;
  ${(p) =>
    p.hasError
      ? `--otp-border: #ef4444; --otp-shadow: rgba(239,68,68,.12);`
      : `--otp-border: rgba(15,18,25,.18); --otp-shadow: rgba(2,32,71,.08);`}
`;

const Box = styled.input`
  width: 54px;
  height: 64px;
  border-radius: 12px;
  border: 1.5px solid var(--otp-border);
  outline: none;
  background: #fff;
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  box-shadow: 0 6px 20px var(--otp-shadow);
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    transform 0.06s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.18);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #c7ced6;
  }

  @media (max-width: 420px) {
    width: 48px;
    height: 58px;
    font-size: 24px;
  }
`;

const ErrorText = styled.div`
  text-align: center;
  color: #b91c1c;
  font-size: 13px;
  margin-top: 6px;
`;

/* ===== Логика ===== */
type OTPCodeProps = {
  control: Control<any>;
  name: string; // RHF имя
  length?: number; // кол-во цифр (по умолчанию 5)
  autoFocus?: boolean; // автофокус на первую ячейку
  placeholderChar?: string; // плейсхолдер в пустых ячейках (•)
  disabled?: boolean;
};

export default function OTPCode({
  control,
  name,
  length = 5,
  autoFocus = true,
  placeholderChar = "•",
  disabled,
}: OTPCodeProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Создаём массив индексов [0..length-1]
  const slots = useMemo(() => Array.from({ length }, (_, i) => i), [length]);

  // Фокус на первую ячейку при маунте
  useEffect(() => {
    if (!autoFocus) return;
    const el = inputsRef.current[0];
    el?.focus();
    el?.select?.();
  }, [autoFocus]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = (field.value || "") as string; // например "00000"
        const chars = Array.from({ length }, (_, i) => value[i] || "");

        const setCharAt = (idx: number, ch: string) => {
          const next = (
            value.substring(0, idx) +
            ch +
            value.substring(idx + 1)
          ).slice(0, length);
          field.onChange(next);
        };

        const handleChange =
          (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            const digit = raw.replace(/\D/g, "").slice(0, 1);

            // Пустой ввод — просто перерисуем
            if (!digit) {
              setCharAt(idx, "");
              return;
            }

            setCharAt(idx, digit);

            // Авто-переход к следующему
            const next = inputsRef.current[idx + 1];
            if (next) {
              next.focus();
              next.select?.();
            }
          };

        const handleKeyDown =
          (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Backspace") {
              if (chars[idx]) {
                // очистить текущую
                setCharAt(idx, "");
              } else {
                // перейти на предыдущий
                const prev = inputsRef.current[idx - 1];
                if (prev) {
                  prev.focus();
                  prev.select?.();
                  setCharAt(idx - 1, "");
                }
              }
              e.preventDefault();
            }
            if (e.key === "ArrowLeft") {
              inputsRef.current[idx - 1]?.focus();
              e.preventDefault();
            }
            if (e.key === "ArrowRight") {
              inputsRef.current[idx + 1]?.focus();
              e.preventDefault();
            }
          };

        const handlePaste =
          (idx: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const text = (e.clipboardData.getData("text") || "").replace(
              /\D/g,
              ""
            );
            if (!text) return;

            // Вставляем подряд с текущей позиции
            let next = value.split("");
            for (let i = 0; i < text.length && idx + i < length; i++) {
              next[idx + i] = text[i];
            }
            const joined = next.join("").slice(0, length);
            field.onChange(joined);

            // Фокус в конец вставки
            const focusIdx = Math.min(idx + text.length, length - 1);
            inputsRef.current[focusIdx]?.focus();
            inputsRef.current[focusIdx]?.select?.();
          };

        return (
          <>
            <OTPWrap hasError={!!fieldState.error}>
              {slots.map((i) => (
                <Box
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  value={chars[i]}
                  placeholder={placeholderChar}
                  onChange={handleChange(i)}
                  onKeyDown={handleKeyDown(i)}
                  onPaste={handlePaste(i)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  aria-label={`Digit ${i + 1} of ${length}`}
                  disabled={disabled}
                />
              ))}
            </OTPWrap>
            {fieldState.error && (
              <ErrorText>{fieldState.error.message}</ErrorText>
            )}
          </>
        );
      }}
    />
  );
}
