// pages/settings/settings.style.ts
import styled from "@emotion/styled";

export const PageWrap = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 24px 16px 40px;

  @media (max-width: 900px) {
    padding: 20px 14px 32px;
  }
  @media (max-width: 640px) {
    padding: 16px 12px 28px;
  }
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin: 8px 0 12px;

  @media (max-width: 900px) {
    font-size: 28px;
    margin-bottom: 10px;
  }
    
  @media (max-width: 640px) {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
  border-bottom: 1px solid rgba(15, 18, 25, 0.08);
  margin-bottom: 24px;

  /* горизонтальный скролл на маленьких экранах */
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 640px) {
    gap: 14px;
    margin-bottom: 18px;
  }
`;

export const TabBtn = styled.button<{ active?: boolean }>`
  appearance: none;
  background: none;
  border: none;
  padding: 12px 0;
  margin-bottom: -1px;
  font-size: 15px;
  white-space: nowrap; /* чтобы не переносились метки */
  cursor: pointer;
  color: ${(p) => (p.active ? "#0070ff" : "#2a3137")};
  font-weight: 500;
  border-bottom: 2px solid ${(p) => (p.active ? "#0070ff" : "transparent")};

  &:hover {
    color: #2563eb;
  }

  @media (max-width: 640px) {
    font-size: 14px;
    padding: 10px 0;
  }
`;

export const Section = styled.div`
  display: grid;
  gap: 16px;
  max-width: 720px;

  @media (max-width: 900px) {
    max-width: 100%;
    gap: 14px;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const PrimaryBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  background: #0070ff;
  color: #fff;
  border: 1px solid #0070ff;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  @media (max-width: 640px) {
    width: 100%;
    height: 44px;
  }
`;

export const GhostBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  background: #f3f4f6;
  color: #111827;
  border: 1px solid rgba(15, 18, 25, 0.12);
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 640px) {
    width: 100%;
    height: 44px;
  }
`;

export const Card = styled.div`
  margin-top: 28px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(15, 18, 25, 0.08);
  background: #fff;

  @media (max-width: 640px) {
    border-radius: 12px;
    margin-top: 20px;
  }
`;

export const Card = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #f9fafb;

  &:nth-of-type(n + 2) {
    background: #fff;
    border-top: 1px solid rgba(15, 18, 25, 0.06);
  }

  .label {
    color: #111827;
    font-weight: 600;
  }
  .value {
    color: #374151;
  }
  .action {
    color: #0070ff;
    font-weight: 500;
    cursor: pointer;
    background: none;
    font-size: 14px;
    border: none;
    padding: 8px 10px;
    border-radius: 8px;
  }

  /* планшет: ужимаем первую колонку */
  @media (max-width: 900px) {
    grid-template-columns: 200px 1fr auto;
    padding: 12px 14px;
  }

  /* мобильный: в столбик, аккуратный порядок */
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 12px;

    .label {
      order: 1;
      font-size: 14px;
    }
    .value {
      order: 2;
      font-size: 14px;
    }
    .action {
      order: 3;
      align-self: start;
      justify-self: start;
      padding: 6px 0;
    }
  }
`;
