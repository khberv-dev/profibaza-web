import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

/* animations */
const fadeIn = keyframes`
  from { opacity: 0 }
  to   { opacity: 1 }
`;
const pop = keyframes`
  from { transform: translateY(6px) scale(0.98); opacity: .8 }
  to   { transform: translateY(0)   scale(1);     opacity: 1 }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  //   background: rgba(10, 11, 15, 0.58);
  background: #20262b99;
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 1000;
  animation: ${fadeIn} 120ms ease-out;
`;

export const Dialog = styled.div`
  background: #ffffff;
  color: #0b0b0f;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08);
  outline: none;
  animation: ${pop} 140ms cubic-bezier(0.2, 0.75, 0.2, 1);

  display: flex;
  flex-direction: column;
  max-height: 85vh;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 12px 20px;
`;

export const Title = styled.h2`
  font-size: 22px;
  line-height: 28px;
  font-weight: 700;
  margin: 0;
`;

export const CloseBtn = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  //   border: 1px solid rgba(15, 18, 25, 0.08);
  border: none;
  //   background: #f3f4f6;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.08s;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  //   &:hover {
  //     background: #eef0f4;
  //     border-color: rgba(15, 18, 25, 0.14);
  //   }
  &:active {
    transform: translateY(1px);
  }

  /* "X" icon */
  span {
    position: absolute;
    width: 18px;
    height: 2px;
    background: #0f172a;
    border-radius: 1px;
  }
  span:first-of-type {
    transform: rotate(45deg);
  }
  span:last-of-type {
    transform: rotate(-45deg);
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: rgba(15, 18, 25, 0.06);
`;

export const Body = styled.div`
  padding: 16px 20px;

  /* адаптивные отступы для мобильных */
  @media (max-width: 480px) {
    padding: 12px 14px;
  }
`;

export const Footer = styled.div`
  padding: 14px 20px 18px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
