import styled from "@emotion/styled";

export const PageWrap = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px 40px;

  @media (max-width: 640px) {
    padding: 16px 12px 28px;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 20px;
  color: #0f172a;

  @media (max-width: 640px) {
    font-size: 24px;
    margin-bottom: 16px;
  }
`;

export const Empty = styled.div`
  padding: 40px 24px;
  border-radius: 16px;
  border: 1px dashed #dbeafe;
  background: #f8fbff;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 8px;
  color: #0f172a;

  .ico {
    color: #2563eb;
  }

  h2 {
    margin: 8px 0 0;
    font-size: 18px;
    font-weight: 700;
  }

  p {
    margin: 0;
    max-width: 360px;
    color: #6b7a90;
    font-size: 14px;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    padding: 32px 16px;
    border-radius: 12px;
  }
`;
