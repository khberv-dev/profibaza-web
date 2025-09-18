/* TopbarLayout.tsx */
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next"; // ⬅️
import { TOKEN_KEY } from "../shared/api/client";
import {
  Shell,
  Topbar,
  Brand,
  BrandText,
  Nav,
  NavItem,
  Right,
  GhostBtn,
  IconImg,
  PrimaryBtn,
  Burger,
  Main,
  Content,
} from "./topbar-layout.style";

export function TopbarLayout() {
  const { t } = useTranslation(); // ⬅️
  const token = localStorage.getItem(TOKEN_KEY);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // делаем NAV_ITEMS зависимым от t, чтобы реагировало на смену языка
  const NAV_ITEMS = [
    { to: "/app/find", label: t("nav.find") },
    { to: "/app/orders", label: t("nav.orders") },
    { to: "/app/jobs", label: t("nav.jobs") },
    { to: "/app/forMasters", label: t("nav.forMasters") },
    { to: "/app/help", label: t("nav.help") },
  ];

  const activePath = useMemo(() => {
    const found = NAV_ITEMS.find((n) => location.pathname.startsWith(n.to));
    return found?.to ?? "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, t]); // пересчитать при смене языка

  if (!token) return <Navigate to="/login" replace />;

  return (
    <Shell>
      <Topbar>
        <Link
          to="/app/profile"
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            textDecoration: "none",
          }}
          aria-label={t("topbar.goProfile")}
        >
          <Brand>
            {/* <BrandDot>pb</BrandDot> */}
            <BrandText>{t("brand")}</BrandText>
          </Brand>
        </Link>

        <Nav data-open={open ? "true" : "false"}>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              data-active={activePath === item.to ? "true" : "false"}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavItem>
          ))}
        </Nav>

        <Right>
          <GhostBtn title={t("topbar.search")}>
            <IconImg src="/search.svg" alt="" />
            <span className="label">{t("topbar.search")}</span>
          </GhostBtn>

          <GhostBtn
            title={t("topbar.notifications")}
            data-badge="1"
            aria-label={t("topbar.notifications")}
          >
            <IconImg src="/bell.svg" alt="" />
          </GhostBtn>

          <PrimaryBtn to="/app/profile" aria-label={t("topbar.profileBtn")}>
            {t("topbar.profileBtn")}
          </PrimaryBtn>

          <Burger
            onClick={() => setOpen((v) => !v)}
            aria-label={t("topbar.menu")}
          >
            <span />
            <span />
            <span />
          </Burger>
        </Right>
      </Topbar>

      <Main>
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  );
}
