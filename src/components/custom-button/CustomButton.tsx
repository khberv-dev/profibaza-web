import { ReactNode, CSSProperties, ButtonHTMLAttributes } from "react";
import { Spinner, StyledButton } from "./style";

// Наследуем все стандартные пропсы кнопки
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  style?: CSSProperties;
};

export function CustomButton({
  children,
  fullWidth,
  disabled,
  loading = false,
  type = "button",
  onClick,
  style,
  ...rest
}: Props) {
  return (
    <StyledButton
      fullWidth={fullWidth}
      disabled={disabled}
      type={type}
      onClick={onClick}
      loading={loading}
      style={style}
      {...rest}
    >
      {loading ? <Spinner /> : children}
    </StyledButton>
  );
}
