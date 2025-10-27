import { Outlet, useNavigate, Link } from "react-router-dom";
import styled from "@emotion/styled";
import { AppFooter } from "../components/AppFooter";

export const FindLayout = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Navbar>
        <NavInner>
          <Brand to="/">PROFIBAZA</Brand>

          <NavMenu>
            {/* <NavItem to="/for-whom">Кому подходит</NavItem>
            <NavItem to="/why">Почему ProfiBaza</NavItem>
            <NavItem to="/find">Найти мастера</NavItem> */}
          </NavMenu>

          <RightGroup>
            <LangBtn>RU</LangBtn>
            <AuthBtn onClick={() => navigate("/login")}>Войти</AuthBtn>
            <PrimaryBtn onClick={() => navigate("/register")}>
              Стать исполнителем
            </PrimaryBtn>
          </RightGroup>
        </NavInner>
      </Navbar>

      <Main>
        <Outlet />
      </Main>

      <AppFooter />
    </Wrapper>
  );
};

/* ===== СТИЛИ ===== */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #0f0f0f;
  overflow-x: hidden; /* ← предотвращает вылезание */
`;

const Navbar = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background: #000;
  color: #fff;
  z-index: 50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const NavInner = styled.div`
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Brand = styled(Link)`
  font-weight: 800;
  font-size: 20px;
  color: #fff;
  text-decoration: none;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 860px) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  font-weight: 600;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
`;

const LangBtn = styled.button`
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 6px 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const AuthBtn = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const PrimaryBtn = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 7px 18px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #1d4ed8;
  }
`;

const Main = styled.main`
  flex: 1;
  background: #f9fafb;
  min-height: 60vh;
  padding: 40px 20px;
`;
