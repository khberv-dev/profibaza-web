import React from "react";
import { useTranslation } from "react-i18next";
import LangSwitcher from "./lang-switcher/LangSwitcher";

const FOOTER_NAV = [
  { key: "about", href: "/about" },
  { key: "help", href: "/help" },
  { key: "jobs", href: "/jobs" },
  { key: "ads", href: "/ads" },
  { key: "requirements", href: "/requirements" },
  { key: "companies", href: "/companies" },
  { key: "professions", href: "/professions" },
] as const;

const FOOTER_LEGAL = [
  { key: "ethics", href: "/legal/ethics" },
  { key: "services", href: "/legal/services" },
  { key: "terms", href: "/legal/terms" },
  { key: "privacy", href: "/legal/privacy" },
  { key: "userAgreement", href: "/legal/user" },
] as const;

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer
      className="app-footer"
      style={{
        paddingTop: 40,
        borderTop: "1px solid #e5e7eb",
        padding: "32px 0 20px",
        color: "#111827",
        background: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 16px",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>{t("brand")}</div>
          <nav
            style={{
              display: "grid",
              gap: 10,
              maxWidth: 420,
            }}
          >
            {FOOTER_NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none",
                  color: "#374151",
                  fontSize: 14,
                }}
              >
                {t(`footerLinks.${link.key}`)}
              </a>
            ))}
          </nav>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>
            {t("footerLinks.mobileApp")}
          </div>
          <div
            style={{
              display: "inline-flex",
              padding: 10,
              borderRadius: 10,
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
            }}
          >
            <img
              src="/qr.png"
              alt="QR"
              width={132}
              height={132}
              style={{ display: "block", borderRadius: 6 }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1120,
          margin: "24px auto 0",
          padding: "0 16px",
          color: "#6b7280",
          fontSize: 13,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            borderTop: "1px solid #eef2f7",
            paddingTop: 16,
          }}
        >
          {FOOTER_LEGAL.map((l, i, arr) => (
            <span key={l.href} style={{ display: "inline-flex", gap: 10 }}>
              <a
                href={l.href}
                style={{ color: "#6b7280", textDecoration: "none" }}
              >
                {t(`footerLinks.${l.key}`)}
              </a>
              {i !== arr.length - 1 && <span>·</span>}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #eef2f7",
            marginTop: 16,
            paddingTop: 16,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LangSwitcher />
          </div>

          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {t("footerLinks.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
}
