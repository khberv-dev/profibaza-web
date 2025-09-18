import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { TOKEN_KEY } from "../shared/api/client";
import {
  LayoutWrap,
  Sidebar,
  NavItem,
  Main,
  Header,
  Brand,
  Content,
} from "./protected-layout.style";

const navItems = [
  { path: "/app/profile", label: "Профиль" },
  { path: "/app/settings", label: "Настройки" },
  { path: "/app/help", label: "Помощь" },
];

export function ProtectedLayout() {
  const token = localStorage.getItem(TOKEN_KEY);
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <LayoutWrap>
      <Sidebar>
        <Brand>ChatPlace</Brand>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            as={Link}
            $active={location.pathname === item.path}
          >
            {item.label}
          </NavItem>
        ))}
      </Sidebar>

      <Main>
        <Header>
          <div>🔔</div>
          <div>👤</div>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Main>
    </LayoutWrap>
  );
}
