import styled from "@emotion/styled";

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box; /* ✅ */
  min-width: 0; /* ✅ */
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box; /* ✅ */
  min-width: 0; /* ✅ важно в грид/флекс */
`;
export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #0f172a;
  margin-bottom: 6px;
  text-transform: none;
  overflow-wrap: anywhere;
`;

export const Description = styled.span`
  font-size: 12px;
  color: #737373;
`;

export const HelperText = styled.span<{ hasError?: boolean }>`
  font-size: 12px;
  color: ${({ hasError }) =>
    hasError ? "#ef4444" : "#6b7280"}; /* красный при error */
`;

export const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444; /* red-500 */
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 12px; /* ✅ отступ внутри поля */
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 24px;
  height: 24px;
`;

export const ToggleIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  opacity: 0.7;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
`;

export const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  box-sizing: border-box; /* ✅ чтобы паддинги учитывались */
  padding: 10px 40px 10px 12px; /* ✅ фиксированный внутренний отступ справа */
  border-radius: 10px;
  border: 1px solid ${({ hasError }) => (hasError ? "#ef4444" : "#e7ecf3")};
  background: #fff;
  color: #000;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-size: 16px;

  &:focus {
    border-color: ${({ hasError }) => (hasError ? "#f87171" : "#1e5cfb")};
    box-shadow: 0 0 0 3px
      ${({ hasError }) =>
        hasError ? "rgba(248,113,113,.25)" : "rgba(30,92,251,.18)"};
  }

  &::placeholder {
    color: ${({ hasError }) => (hasError ? "#ef4444" : "#9ca3af")};
  }

  &:disabled {
    background: #f4f4f5;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;
