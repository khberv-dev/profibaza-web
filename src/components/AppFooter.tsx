// src/components/footer/AppFooter.tsx
import React from "react";

export function AppFooter() {
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
        {/* Левая колонка */}
        <div>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>PROFIBAZA</div>
          <nav
            style={{
              display: "grid",
              gap: 10,
              maxWidth: 420,
            }}
          >
            {[
              { label: "О компании", href: "/about" },
              { label: "Помощь", href: "/help" },
              { label: "Наши вакансии", href: "/jobs" },
              { label: "Реклама на сайте", href: "/ads" },
              { label: "Требования к ПО", href: "/requirements" },
              { label: "Каталог компаний", href: "/companies" },
              { label: "Работа по профессиям", href: "/professions" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none",
                  color: "#374151",
                  fontSize: 14,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Правая колонка */}
        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>
            Мобильное приложение
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
            {/* Подставь ваш src на QR */}
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

      {/* Линейки и нижняя полоса */}
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
          {[
            { label: "Этика и комплаенс", href: "/legal/ethics" },
            { label: "Оказание услуг", href: "/legal/services" },
            { label: "Использование сайтов", href: "/legal/terms" },
            { label: "Защита персональных данных", href: "/legal/privacy" },
            { label: "Пользовательское соглашение", href: "/legal/user" },
          ].map((l, i, arr) => (
            <span key={l.href} style={{ display: "inline-flex", gap: 10 }}>
              <a
                href={l.href}
                style={{ color: "#6b7280", textDecoration: "none" }}
              >
                {l.label}
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
            {/* Иконка языка (упрощённая) */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#6b7280"
                strokeWidth="1.5"
              />
              <path
                d="M3 12h18M12 3v18M6 6c2 2 10 2 12 0M6 18c2-2 10-2 12 0"
                stroke="#6b7280"
                strokeWidth="1.2"
              />
            </svg>
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#374151",
                fontSize: 14,
                cursor: "pointer",
                padding: 0,
              }}
              // onClick={() => changeLang('ru')}
              title="Сменить язык"
            >
              Русский
            </button>
          </div>

          <div style={{ color: "#6b7280", fontSize: 13 }}>
            © 2025 Группа компаний PROFIBAZA
          </div>
        </div>
      </div>
    </footer>
  );
}
