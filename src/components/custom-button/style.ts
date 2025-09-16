import styled from "@emotion/styled";

export const StyledButton = styled.button<{
  fullWidth?: boolean;
  loading?: boolean;
}>`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  font-family: "Inter", sans-serif;
  color: ${({ loading }) => (loading ? "#3f3f46" : "#ffffff")};
  background-color: ${({ loading }) =>
    loading ? "rgb(242,242,247)" : "var(--color-blue, #1e5cfb)"};
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  position: relative;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0);
  transition: background-color 0.25s, color 0.25s;
  text-decoration: none;

  &:hover {
    background: ${({ loading }) =>
      loading
        ? "rgb(242,242,247)"
        : "rgb(4.0174672489,66.288209607,225.9825327511)"};
  }

  &:disabled {
    background: ${({ loading }) => (loading ? "rgb(242,242,247)" : "#93c5fd")};
    cursor: not-allowed;
  }
`;

/* Серый спиннер */
export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db; /* светло-серый */
  border-top-color: #6b7280; /* темно-серый */
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
