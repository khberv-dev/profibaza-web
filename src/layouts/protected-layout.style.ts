import styled from "@emotion/styled";

export const LayoutWrap = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  background: #f8fafc;
`;

export const Sidebar = styled.nav`
  background: #1e293b;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const Brand = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 8px;
  color: ${(p) => (p.$active ? "#fff" : "#cbd5e1")};
  background: ${(p) => (p.$active ? "#334155" : "transparent")};
  text-decoration: none;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #475569;
    color: #fff;
  }
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  gap: 16px;
`;

export const Content = styled.main`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;
