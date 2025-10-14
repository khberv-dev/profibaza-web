/* topbar-layout.style.ts */
import styled from "@emotion/styled";
import { Link, LinkProps } from "react-router-dom";

export const Shell = styled.div`
  min-height: 100vh;
  background: #0b0b0f;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Topbar = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 14px;
  background: #0b0b0f;
  color: #e5e7eb;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export const BrandDot = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 12px;
  text-transform: lowercase;
`;

export const BrandText = styled.div`
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.2px;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 12px;
  flex: 1;

  @media (max-width: 1024px) {
    position: fixed; /* вместо absolute */
    left: 0;
    right: 0;
    top: 56px;
    z-index: 200; /* ← выше, чем Topbar, чтобы ничто не перекрывало */
    background: #0b0b0f;
    padding: 12px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    box-sizing: border-box;
    display: none;

    margin-left: 0; /* ← важное: убираем смещение слева */
    max-height: calc(100dvh - 56px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;

    &[data-open="true"] {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
  }
`;

export const NavItem = styled(Link)<
  LinkProps & { "data-active"?: "true" | "false" }
>`
  position: relative;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
  padding: 10px 12px; /* ↑ чуть больше зона тапа на мобилке */
  border-radius: 10px;
  transition: background 0.15s, color 0.15s;
  word-break: break-word; /* длинные слова не ломают ширину */

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }
  &[data-active="true"] {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const NavBadge = styled.span`
  margin-left: 6px;
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  font-size: 11px;
  background: #fff;
  color: #0b0b0f;
  font-weight: 700;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const GhostBtn = styled.button`
  position: relative;
  height: 36px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  &::after {
    content: attr(data-badge);
    display: ${(p) => ((p as any)["data-badge"] ? "grid" : "none")};
    place-items: center;
    position: absolute;
    top: -6px;
    right: -6px;
    width: 18px;
    height: 18px;
    border-radius: 9px;
    background: #fff;
    color: #0b0b0f;
    font-weight: 700;
    font-size: 11px;
  }

  .label {
    display: none;
  }
  @media (min-width: 1280px) {
    .label {
      display: inline;
      color: #d1d5db;
      font-size: 14px;
    }
  }
`;

export const IconImg = styled.img`
  width: 18px;
  height: 18px;
  opacity: 0.9;
  filter: brightness(0) invert(1);
`;

export const PrimaryBtn = styled(Link)<LinkProps>`
  height: 36px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #374151;
  color: #e5e7eb;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  &:hover {
    background: #4b5563;
    border-color: rgba(255, 255, 255, 0.14);
  }
`;

export const Burger = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex-direction: column;
  cursor: pointer;

  span {
    width: 18px;
    height: 2px;
    background: #e5e7eb;
    border-radius: 1px;
  }
  @media (min-width: 1025px) {
    display: none;
  }
`;

export const Main = styled.div`
  flex: 1;
  // background: #f7f8fc;
  background: #fff;
`;

export const Content = styled.main`
  max-width: 100%;
  margin: 0 auto;
  padding: 0px;
`;
