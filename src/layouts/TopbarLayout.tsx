/* TopbarLayout.tsx */
import { Outlet, Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { UserRole } from "../shared/auth/roles";
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
import { useAuthStore } from "../shared/stores/auth";

type NavDef = { to: string; label: string; roles?: UserRole[] };

const getOrdersPath = (role?: UserRole | null) => {
  switch (role) {
    case "CLIENT":
      return "/app/client/orders";
    case "WORKER":
      return "/app/worker/jobs";
    case "LEGAL":
      return "/admin/orders";
    default:
      return "/app/orders";
  }
};

export function TopbarLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const role = useAuthStore((s) => s.role); // 'CLIENT' | 'WORKER' | 'ADMIN' | undefined

  const ORDERS_TO = getOrdersPath(role);

  // Формируем меню с учётом роли и избегаем дублей
  const NAV_ITEMS: NavDef[] = useMemo(() => {
    const items: NavDef[] = [
      { to: "/app/find", label: t("nav.find") },
      { to: ORDERS_TO, label: t("nav.orders") }, // ← динамический маршрут
      // jobs добавляем только если он не совпал с ORDERS_TO
      ...(ORDERS_TO !== "/app/worker/jobs"
        ? [{ to: "/app/worker/jobs", label: t("nav.jobs"), roles: ["WORKER", "ADMIN"] } as NavDef]
        : []),
      { to: "/app/forMasters", label: t("nav.forMasters") },
      { to: "/app/help", label: t("nav.help") },
    ];

    // фильтр по ролям (если roles не указан — доступно всем)
    const byRole = items.filter((it) => (it.roles ? !!role && it.roles.includes(role) : true));

    // защита от случайных дублей по to
    return byRole.filter((it, i, arr) => arr.findIndex((x) => x.to === it.to) === i);
  }, [i18n.language, t, role, ORDERS_TO]);

  const activePath = useMemo(() => {
    const found = NAV_ITEMS.find((n) => location.pathname.startsWith(n.to));
    return found?.to ?? "";
  }, [location.pathname, NAV_ITEMS]);

  return (
    <Shell>
      <Topbar>
        <Link
          to="/app/profile"
          style={{ display: "flex", gap: 10, alignItems: "center", textDecoration: "none" }}
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

          <GhostBtn title={t("topbar.notifications")} data-badge="1" aria-label={t("topbar.notifications")}>
            <IconImg src="/bell.svg" alt="" />
          </GhostBtn>

          <PrimaryBtn to="/app/profile" aria-label={t("topbar.profileBtn")}>
            {t("topbar.profileBtn")}
          </PrimaryBtn>

          <Burger onClick={() => setOpen((v) => !v)} aria-label={t("topbar.menu")}>
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
