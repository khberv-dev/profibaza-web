/* topbar-layout.style.ts */
import styled from "@emotion/styled";
import { Link, LinkProps } from "react-router-dom";

export const Shell = styled.div`
  min-height: 100vh;
  background: #0b0b0f;
  display: flex;
  flex-direction: column;
  position: relative;

  /* чтобы не было горизонтального скролла на мобилке */
  overflow-x: clip;
`;

export const Topbar = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 12px;
  background: rgba(11, 11, 15, 0.92);
  color: #e5e7eb;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 300;

  /* приятный blur как в ios */
  backdrop-filter: blur(10px);

  @media (max-width: 480px) {
    height: 60px;
    padding: 0 10px;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 1;
  min-width: 0; /* важно для ellipsis */
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
  flex: 0 0 auto;
`;

export const BrandText = styled.div`
  color: #fff;
  font-weight: 800;
  letter-spacing: 0.2px;

  /* чтобы на мобилке не ломало */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 14px;
    max-width: 150px;
  }
`;

/* затемнение фона при открытом меню на мобилке */
export const NavOverlay = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 56px 0 0 0; /* ниже топбара */
    background: rgba(0, 0, 0, 0.55);
    z-index: 180;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.18s ease;
  }

  &[data-open="true"] {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 10px;
  flex: 1;
  min-width: 0;

  @media (max-width: 1024px) {
    position: fixed;
    left: 0;
    right: 0;
    top: 56px;
    z-index: 220;

    background: rgba(11, 11, 15, 0.98);
    padding: 12px 12px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    box-sizing: border-box;

    margin-left: 0;
    max-height: calc(100dvh - 56px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;

    /* скрыто по умолчанию */
    opacity: 0;
    transform: translateY(-6px);
    pointer-events: none;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;

    transition: opacity 0.18s ease, transform 0.18s ease;

    &[data-open="true"] {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  }

  @media (max-width: 480px) {
    top: 60px;
    max-height: calc(100dvh - 60px);
  }
`;

export const NavItem = styled(Link)<
  LinkProps & { "data-active"?: "true" | "false" }
>`
  position: relative;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;

  /* идеальная зона тапа */
  min-height: 44px;
  padding: 12px 12px;
  border-radius: 12px;

  transition: background 0.15s, color 0.15s, transform 0.12s;
  word-break: break-word;

  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  &:active {
    transform: scale(0.99);
  }

  &[data-active="true"] {
    color: #fff;
    background: rgba(255, 255, 255, 0.09);
  }
`;

export const NavBadge = styled.span`
  margin-left: 10px;
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 11px;
  background: #fff;
  color: #0b0b0f;
  font-weight: 800;
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
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.12s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  &:active {
    transform: scale(0.98);
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
    font-weight: 800;
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

  /* на мобилке делаем компактнее и “чище” */
  @media (max-width: 480px) {
    height: 38px;
    padding: 0 10px;
    border-radius: 12px;
  }
`;

export const IconImg = styled.img`
  width: 18px;
  height: 18px;
  opacity: 0.95;
  filter: brightness(0) invert(1);
`;

export const PrimaryBtn = styled(Link)<LinkProps>`
  height: 36px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #374151;
  color: #e5e7eb;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.15s, border-color 0.15s, transform 0.12s;

  &:hover {
    background: #4b5563;
    border-color: rgba(255, 255, 255, 0.14);
  }

  &:active {
    transform: scale(0.98);
  }

  /* ✅ на мобилке убираем кнопку профиля (оставляем bell/иконки) */
  @media (max-width: 640px) {
    display: none;
  }
`;

export const Burger = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex-direction: column;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.12s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  &:active {
    transform: scale(0.98);
  }

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
  background: #fff;
`;

export const Content = styled.main`
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
`;
