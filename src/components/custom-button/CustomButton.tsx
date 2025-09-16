import { ReactNode } from "react";
import { Spinner, StyledButton } from "./style";

type Props = {
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export function CustomButton({
  children,
  fullWidth,
  disabled,
  loading = false,
  type = "button",
  onClick,
}: Props) {
  return (
    <StyledButton
      fullWidth={fullWidth}
      disabled={disabled}
      type={type}
      onClick={onClick}
      loading={loading}
    >
      {loading ? <Spinner /> : children}
    </StyledButton>
  );
}
