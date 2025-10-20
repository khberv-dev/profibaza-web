import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { UserRole } from "../../shared/auth/roles";
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
} from "../topbar-layout.style";
import { useAuthStore } from "../../shared/stores/auth";
import { Modal } from "../../components/modal/Modal";
import { AppFooter } from "../../components/AppFooter";

type NavDef = { to: string; label: string; roles?: UserRole[] };

const getOrdersPath = (role?: UserRole | null) => {
  switch (role) {
    case "CLIENT":
      return "/app/client/orders";
    case "WORKER":
      return "/app/worker/jobs";
    case "LEGAL":
      return "/app/legal/orders";
    default:
      return "/app/orders";
  }
};

export function AdminLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const role = useAuthStore((s) => s.role); // 'CLIENT' | 'WORKER' | 'LEGAL' | 'ADMIN' | null
  const [helpOpen, setHelpOpen] = useState(false);
  const ORDERS_TO = getOrdersPath(role);
  const navigate = useNavigate();

  const NAV_ITEMS: NavDef[] = useMemo(() => {
    const items: NavDef[] = [
      { to: "/admin/stats", label: "Статистика" },
      { to: "/admin/invoices", label: "Инвойсы" },
      { to: "/app/help", label: t("nav.help") },
    ];

    // фильтр по ролям, если roles не указаны — доступно всем
    const byRole = items.filter((it) =>
      it.roles ? !!role && it.roles.includes(role) : true
    );

    // убираем дубли
    return byRole.filter(
      (it, i, arr) => arr.findIndex((x) => x.to === it.to) === i
    );
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
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            textDecoration: "none",
          }}
          aria-label={t("topbar.goProfile")}
        >
          <Brand>
            <BrandText>{t("brand")} ADMIN</BrandText>
          </Brand>
        </Link>

        <Nav data-open={open ? "true" : "false"}>
          {NAV_ITEMS.map((item) => {
            const isHelp = item.to === "/app/help";
            return (
              <NavItem
                key={item.to}
                to={isHelp ? "#" : item.to}
                data-active={activePath === item.to ? "true" : "false"}
                onClick={(e) => {
                  setOpen(false);
                  if (isHelp) {
                    e.preventDefault();
                    setHelpOpen(true);
                  }
                }}
              >
                {item.label}
              </NavItem>
            );
          })}
        </Nav>

        <Right>
{/* 
          <GhostBtn
            onClick={() => navigate("/app/profile")}
            title={t("topbar.notifications")}
            data-badge="1"
            aria-label={t("topbar.notifications")}
          >
            <IconImg src="/bell.svg" alt="" />
          </GhostBtn> */}

          {/* <PrimaryBtn to="/app/profile" aria-label={t("topbar.profileBtn")}>
            {t("topbar.profileBtn")}
          </PrimaryBtn> */}

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

      <AppFooter />
      <Modal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title=""
        width={520}
      >
        <div
          style={{
            display: "grid",
            gap: 14,
            padding: "6px 4px 2px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Нужна помощь?
          </div>
          <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.45 }}>
            Можно спросить в поддержке или найти ответ самостоятельно
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 6,
            }}
          >
            {/* Найти ответ */}
            <a
              href="/" // ← поменяй на вашу страницу/Центр помощи
              onClick={() => setHelpOpen(false)}
              style={{
                textDecoration: "none",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: "flex-start",
                boxShadow: "0 1px 0 rgba(2,6,23,0.02)",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#f3f4f6",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e5e7eb",
                  color: "#000",
                  flex: "0 0 auto",
                }}
                aria-hidden
              >
                {/* ? */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  focusable="false"
                  className="magritte-icon___rRr4Q_12-3-5 magritte-icon_initial-primary___KhLAU_12-3-5"
                >
                  <g>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.78905 5.58983C3.42413 7.22773 2.8 9.51743 2.8 12C2.8 14.4826 3.42413 16.7723 4.78905 18.4102C6.10584 19.9903 8.30787 21.2 12 21.2C15.6921 21.2 17.8942 19.9903 19.211 18.4102C20.5759 16.7723 21.2 14.4826 21.2 12C21.2 9.51743 20.5759 7.22773 19.211 5.58983C17.8942 4.00968 15.6921 2.8 12 2.8C8.30787 2.8 6.10584 4.00968 4.78905 5.58983ZM12 1C3.75 0.999999 1 6.5 1 12C1 17.5 3.75 23 12 23C20.25 23 23 17.5 23 12C23 6.5 20.25 1 12 1ZM12 7.4001C10.8804 7.4001 10.15 8.10631 10.15 9.0001H8.34998C8.34998 6.89389 10.1197 5.6001 12 5.6001C13.8805 5.6001 15.65 6.89394 15.65 9.0001C15.65 9.81169 15.4197 10.4404 15.0403 10.9463C14.7002 11.3998 14.2614 11.7186 13.9388 11.9529L13.9044 11.978C13.5421 12.2414 13.313 12.4162 13.1497 12.6338C13.0135 12.8154 12.9 13.0617 12.9 13.5001H11.1C11.1 12.6885 11.3303 12.0598 11.7097 11.5539C12.0498 11.1004 12.4886 10.7816 12.8112 10.5473L12.8456 10.5222C13.2079 10.2588 13.4371 10.084 13.6003 9.86635C13.7365 9.68477 13.85 9.4385 13.85 9.0001C13.85 8.10626 13.1196 7.4001 12 7.4001ZM12 15C12.6904 15 13.25 15.5596 13.25 16.25C13.25 16.9404 12.6904 17.5 12 17.5C11.3096 17.5 10.75 16.9404 10.75 16.25C10.75 15.5596 11.3096 15 12 15Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </span>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                Найти ответ
              </div>
            </a>

            {/* Написать на почту */}
            <a
              href="mailto:support@pointer.uz" // ← поставь вашу почту
              onClick={() => setHelpOpen(false)}
              style={{
                textDecoration: "none",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
                boxShadow: "0 1px 0 rgba(2,6,23,0.02)",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#f3f4f6",
                  display: "inline-flex",
                  alignItems: "center",
                  color: "#000",
                  justifyContent: "center",
                  border: "1px solid #e5e7eb",
                  flex: "0 0 auto",
                }}
                aria-hidden
              >
                {/* @ */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  focusable="false"
                  className="magritte-icon___rRr4Q_12-3-5 magritte-icon_initial-primary___KhLAU_12-3-5"
                >
                  <g>
                    <path
                      d="M15.3127 11.9965C15.3127 13.8236 13.8305 15.3059 12.0034 15.3059C10.1764 15.3059 8.69414 13.8236 8.69414 11.9965C8.69414 10.1695 10.1764 8.68724 12.0034 8.68724C13.8305 8.68724 15.3127 10.1764 15.3127 11.9965ZM12.0034 1C5.93638 1 1 5.93638 1 12.0034C1 18.0705 5.93638 23 12.0034 23C14.2234 23 16.3676 22.3381 18.2015 21.0834L18.236 21.0627L16.7537 19.3391L16.7261 19.3529C15.3127 20.256 13.6857 20.7386 12.0034 20.7386C7.18427 20.7386 3.26136 16.8157 3.26136 11.9965C3.26136 7.17737 7.18427 3.25446 12.0034 3.25446C16.8226 3.25446 20.7455 7.17737 20.7455 11.9965C20.7455 12.6239 20.6766 13.2513 20.5387 13.8787C20.2629 15.0163 19.4701 15.361 18.8703 15.3127C18.2704 15.2645 17.5672 14.837 17.5603 13.7891V11.9965C17.5603 8.92854 15.0646 6.43278 11.9965 6.43278C8.92855 6.43278 6.43278 8.92854 6.43278 11.9965C6.43278 15.0646 8.92855 17.5603 11.9965 17.5603C13.4857 17.5603 14.8853 16.9743 15.9401 15.9195C16.5537 16.8709 17.5534 17.4707 18.691 17.5603C18.7875 17.5672 18.8909 17.5741 18.9875 17.5741C19.7872 17.5741 20.5801 17.3052 21.2212 16.8226C21.8831 16.3193 22.3726 15.5954 22.6415 14.7267C22.6828 14.5888 22.7656 14.2648 22.7656 14.2648V14.251C22.9242 13.5547 23 12.8583 23 11.9965C23.0069 5.93638 18.0705 1 12.0034 1Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </span>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                Написать на почту
              </div>
            </a>
          </div>
        </div>
      </Modal>
    </Shell>
  );
}
