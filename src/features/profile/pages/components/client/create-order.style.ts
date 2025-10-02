import styled from "@emotion/styled";

/** Двухколоночная сетка: форма + сайдбар */
export const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 20px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

/** Карточка */
export const CardWrap = styled.div`
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e7ecf3;
  box-shadow: 0 10px 30px rgba(2, 32, 71, 0.06);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #e7ecf3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, #fff, #fbfdff);
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: #0f172a;
`;

export const CardBody = styled.div`
  padding: 16px;
`;

/** Ряд */
export const Row = styled.div<{ gap?: number }>`
  display: grid;
  gap: ${({ gap }) => (gap ? `${gap}px` : "14px")};
  grid-template-columns: 1fr;
  margin-bottom: 14px;
`;

export const SectionLabel = styled.div`
  font-size: 13px;
  color: #475467;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 2px 0 6px;
`;

export const TwoCol = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ThreeCol = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.button<{ active?: boolean }>`
  appearance: none;
  border: 1px solid ${({ active }) => (active ? "#1e5cfb" : "#e7ecf3")};
  background: ${({ active }) => (active ? "rgba(30,92,251,0.08)" : "#f8fafc")};
  color: #0f172a;
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 13px;
  line-height: 1;
  transition: all 0.15s ease;
  cursor: pointer;

  &:hover {
    border-color: #dfe7f1;
    background: #f3f6fb;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const BudgetChip = styled(Chip)`
  font-weight: 600;
`;

export const Hint = styled.div`
  margin-top: 6px;
  color: #667085;
  font-size: 12px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

export const SummaryList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    gap: 12px;
    border-bottom: 1px dashed #eef2f6;

    span {
      color: #475467;
      font-size: 13px;
    }

    b {
      color: #111827;
      font-weight: 600;
      font-size: 14px;
      text-align: right;
      max-width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  li:last-of-type {
    border-bottom: none;
  }
`;

export const SoftBar = styled.div`
  margin-top: 12px;
  background: #f8fafc;
  border: 1px solid #e7ecf3;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  color: #475467;
`;

export const Small = styled.span`
  font-size: 12px;
  color: #667085;
`;

export const DropdownScroll = styled.div`
  max-height: 260px;
  overflow: auto;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(2, 32, 71, 0.18);
    border-radius: 999px;
  }
`;
