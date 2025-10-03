import { Controller } from "react-hook-form";
import { useMemo } from "react";
import { Calendar, X } from "lucide-react";
import {
  InputWrapper,
  Label,
  Description,
  HelperText,
  ErrorText,
  InputContainer,
  StyledInput,
} from "../custom-input/style"; // ← те же стили, что и у CustomInput
import { DateIconBtn, ClearBtn } from "./style";

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
  min?: string; // "YYYY-MM-DD"
  max?: string; // "YYYY-MM-DD"
};

export function CustomDateInput({
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
}: Props) {
  const inputMode = useMemo(() => "none", []); // чтобы мобильная клавиатура не мешала

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;
        const value = field.value || "";

        return (
          <InputWrapper>
            {label && <Label>{label} {required && <span aria-hidden="true" style={{color:"#ef4444"}}>*</span>}</Label>}

            <InputContainer>
              <StyledInput
                {...field}
                type="date"
                value={value}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                hasError={hasError}
                aria-invalid={hasError}
                min={min}
                max={max}
                inputMode={inputMode as any}
                // чтобы RHF триггерил onBlur для валидации
                onBlur={(e) => field.onBlur()}
              />

              {/* иконка календаря (декоративно) */}
              <DateIconBtn type="button" tabIndex={-1} aria-hidden="true">
                <Calendar size={18} />
              </DateIconBtn>

              {/* очистка значения */}
              {value && !disabled && (
                <ClearBtn
                  type="button"
                  onClick={() => field.onChange("")}
                  aria-label="Очистить дату"
                  title="Очистить дату"
                >
                  <X size={16} />
                </ClearBtn>
              )}
            </InputContainer>

            {description && <Description>{description}</Description>}
            {helperText && <HelperText hasError={hasError}>{helperText}</HelperText>}
            {hasError && <ErrorText>{fieldState.error?.message}</ErrorText>}
          </InputWrapper>
        );
      }}
    />
  );
}
