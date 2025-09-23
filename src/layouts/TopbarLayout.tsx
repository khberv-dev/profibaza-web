/* TopbarLayout.tsx */
import { Outlet, Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useAuthStore } from "../shared/stores/auth"; // ← читаем роль/авторизацию при желании

export function TopbarLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Можно учитывать роль, если какие-то пункты скрывать для ролей:
  // const role = useAuthStore((s) => s.role);

  // NAV зависит от языка — пересчёт по смене i18n.language
  const NAV_ITEMS = useMemo(
    () => [
      { to: "/app/find", label: t("nav.find") },
      { to: "/app/orders", label: t("nav.orders") },
      { to: "/app/jobs", label: t("nav.jobs") },
      { to: "/app/forMasters", label: t("nav.forMasters") },
      { to: "/app/help", label: t("nav.help") },
    ],
    [i18n.language, t]
  );

  const activePath = useMemo(() => {
    const found = NAV_ITEMS.find((n) => location.pathname.startsWith(n.to));
    return found?.to ?? "";
  }, [location.pathname, NAV_ITEMS]);

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
