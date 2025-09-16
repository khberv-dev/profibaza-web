import styled from "@emotion/styled";

export const Wrap = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #f7f8fc;
  padding: 16px;
  box-sizing: border-box;
`;

export const Card = styled.form`
  width: min(100%, 420px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid #eef1f6;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.04);
  box-sizing: border-box;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #111827;
`;

export const Sub = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

export const PhoneRow = styled.div`
  font-weight: 600;
  color: #111827;
  margin-top: -6px;
`;

export const CodeRow = styled.div`
  margin-top: 4px;
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 4px;
  flex-wrap: wrap;
`;

export const Hint = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

export const ResendBtn = styled.button`
  padding: 0;
  border: none;
  background: transparent;
  color: #1e5cfb;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    text-decoration: underline;
  }
`;
