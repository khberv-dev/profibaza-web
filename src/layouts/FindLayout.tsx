import { PageTransition } from "../components/PageTransition";
import { useNavigate, Link } from "react-router-dom";
import styled from "@emotion/styled";
import { AppFooter } from "../components/AppFooter";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";

export const FindLayout = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("common");


  // нормализованный код языка для кнопки
  const currentLang = useMemo(
    () => (i18n.language?.split("-")[0] || "ru").toUpperCase(),
    [i18n.language]
  );

  useEffect(() => {
    const saved = localStorage.getItem("lng");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);
  
  const toggleLang = () => {
    const next = i18n.language.startsWith("ru") ? "uz" : "ru";
    i18n.changeLanguage(next);
    localStorage.setItem("lng", next);
  };

  return (
    <Wrapper>
      <Navbar>
        <NavInner>
          <Brand to="/">PROFIBAZA</Brand>

          <NavMenu>
            {/* примеры если решишь включить */}
            {/* <NavItem to="/for-whom">{t("rolesTitle")}</NavItem>
            <NavItem to="/why">{t("why")}</NavItem>
            <NavItem to="/find">{t("nav.find")}</NavItem> */}
          </NavMenu>

          <RightGroup>
            <LangBtn onClick={toggleLang}>
              {currentLang}
            </LangBtn>

            <AuthBtn onClick={() => navigate("/login")}>
              {t("loginCta", "Войти")}
            </AuthBtn>

            <PrimaryBtn onClick={() => navigate("/register")}>
              {t("ctaExec", "Стать исполнителем")}
            </PrimaryBtn>
          </RightGroup>
        </NavInner>
      </Navbar>

      <Main>
        <PageTransition />
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
  height: 56px;
  padding: 0 14px;
  background: #000;
  color: #fff;
  z-index: 50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

  @media (max-width: 640px) {
    padding: 0 10px;
  }
`;

const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  height: 56px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-width: 0;

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

const Brand = styled(Link)`
  font-weight: 800;
  letter-spacing: 0.2px;
  font-size: 18px;
  color: #fff;
  text-decoration: none;
  flex-shrink: 0;

  @media (max-width: 640px) {
    font-size: 15px;
    letter-spacing: 0;
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 640px) {
    gap: 6px;
  }
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



const LangBtn = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgb(229, 231, 235);
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 640px) {
    padding: 8px 9px;
    border-radius: 9px;
    font-size: 12px;
  }
`;

const AuthBtn = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 640px) {
    padding: 8px 10px;
    border-radius: 9px;
    font-size: 12px;
  }
`;

const PrimaryBtn = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background: #1d4ed8;
  }

  @media (max-width: 640px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`;

const Main = styled.main`
  flex: 1;
  background: #f9fafb;
  min-height: 60vh;
  padding: 40px 20px;
`;
