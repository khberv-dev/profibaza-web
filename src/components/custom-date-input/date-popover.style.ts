import styled from "@emotion/styled";

export const PopWrap = styled.div`
  position: absolute;
  z-index: 40;
  top: calc(100% + 6px);
  left: 0;
`;

export const Panel = styled.div`
  width: 296px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #e7ecf3;
  box-shadow: 0 14px 36px rgba(2,32,71,.12);
  padding: 12px;
`;

export const CalHeader = styled.div`
  margin-bottom: 8px;
`;

export const CalControls = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr 28px;
  gap: 6px;
  align-items: center;

  button {
    height: 28px; border-radius: 8px; border: 1px solid #e7ecf3; background: #fff;
    cursor: pointer;
    &:hover { box-shadow: 0 2px 10px rgba(2,32,71,.06); }
  }
`;

export const CalTitle = styled.div`
  text-align: center;
  font-weight: 800;
  color: #12284a;
  text-transform: capitalize; /* «сентябрь 2025» */
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 36px);
  gap: 6px;
  justify-content: center;
`;

export const WeekCell = styled.div`
  font-size: 12px;
  color: #6b7a90;
  text-align: center;
  padding: 6px 0;
`;

export const DayCellBtn = styled.button`
  height: 34px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: #fff;
  color: #12284a;
  font-weight: 400;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &[data-other] {
    color: #9aa3b2;
    font-weight: 400;
  }

  &[data-today] {
    outline: 2px solid rgba(47,107,255,.25);
    outline-offset: 2px;
  }

  &[data-selected] {
    background: #2f6bff;
    color: #fff;
  }

  &:hover:not(:disabled):not([data-selected]) {
    border-color: #e7ecf3;
    background: #f5f8ff;
  }

  &:disabled {
    color: #c6cbd6;
    cursor: not-allowed;
  }
`;

export const FooterRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 8px;
  margin-top: 10px;

  .spacer { }

  .link {
    background: transparent;
    border: 0;
    color: #3558ff;
    font-weight: 700;
    cursor: pointer;
  }

  .ghost {
    height: 32px; padding: 0 12px; border-radius: 10px;
    border: 1px solid #e7ecf3; background: #fff; color: #0f172a;
    cursor: pointer;
  }
  .primary {
    height: 32px; padding: 0 12px; border-radius: 10px;
    border: 1px solid #2f6bff; background: #2f6bff; color: #fff; font-weight: 800;
    cursor: pointer;
  }
`;


