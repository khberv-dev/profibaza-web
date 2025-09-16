import { useState, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import IMask, { InputMask } from "imask";
import {
  InputWrapper,
  Label,
  StyledInput,
  ErrorText,
  HelperText,
  Description,
  InputContainer,
  ToggleButton,
  ToggleIcon,
} from "./style";

type Props = {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  helperText?: string;
  rules?: any;
};

const MASK_PATTERN = "+{998} (00) 000-00-00";

export function CustomInput({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required,
  disabled,
  description,
  helperText,
  rules,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maskRef = useRef<InputMask<any> | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules} // ✅ пробрасываем
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;

        // ---- PHONE ----
        if (type === "phone") {
          useEffect(() => {
            if (!inputRef.current) return;

            const mask = IMask(inputRef.current, {
              mask: MASK_PATTERN,
              lazy: false,
              overwrite: true,
            });

            // инициализация из RHF -> маску
            const initDigits = String(field.value ?? "").replace(/\D/g, "");
            if (initDigits) mask.unmaskedValue = initDigits;
            else mask.value = ""; // покажем шаблон

            // при вводе: кладём в RHF только цифры
            mask.on("accept", () => {
              field.onChange(mask.unmaskedValue); // <- RHF хранит "998900012644"
            });

            // onBlur чтобы RHF валидировал при потере фокуса
            const onBlur = () => field.onBlur();
            inputRef.current.addEventListener("blur", onBlur);

            maskRef.current = mask;
            return () => {
              inputRef.current?.removeEventListener("blur", onBlur);
              mask.destroy();
              maskRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);

          // если извне поменяли значение — синхронизируем в маску
          useEffect(() => {
            const mask = maskRef.current;
            if (!mask) return;
            const next = String(field.value ?? "").replace(/\D/g, "");
            if (mask.unmaskedValue !== next) {
              mask.unmaskedValue = next;
            }
          }, [field.value]);

          return (
            <InputWrapper>
              {label && <Label>{label}</Label>}
              <InputContainer>
                <StyledInput
                  ref={(el) => {
                    inputRef.current = el;
                    field.ref(el);
                  }}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder={placeholder || MASK_PATTERN}
                  required={required}
                  disabled={disabled}
                  hasError={hasError}
                  aria-invalid={hasError}
                />
              </InputContainer>

              {description && <Description>{description}</Description>}
              {helperText && (
                <HelperText hasError={hasError}>{helperText}</HelperText>
              )}
              {hasError && <ErrorText>{fieldState.error?.message}</ErrorText>}
            </InputWrapper>
          );
        }

        // ---- TEXT/PASSWORD ----
        return (
          <InputWrapper>
            {label && <Label>{label}</Label>}
            <InputContainer>
              <StyledInput
                {...field}
                autoComplete="off"
                type={
                  type === "password" && !showPassword ? "password" : "text"
                }
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                hasError={hasError}
                aria-invalid={hasError}
              />
              {type === "password" && (
                <ToggleButton
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={
                    showPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                >
                  <ToggleIcon
                    src={showPassword ? "/close.svg" : "/open.svg"}
                    alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  />
                </ToggleButton>
              )}
            </InputContainer>

            {description && <Description>{description}</Description>}
            {helperText && (
              <HelperText hasError={hasError}>{helperText}</HelperText>
            )}
            {hasError && <ErrorText>{fieldState.error?.message}</ErrorText>}
          </InputWrapper>
        );
      }}
    />
  );
}
