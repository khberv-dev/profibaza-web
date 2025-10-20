// src/pages/admin/AdminDashboardPage.tsx
import React from "react";
import { useAdminOverall } from "../../shared/modules/admin";
import {
  LuUser,
  LuUsers,
  LuUserCheck,
  LuClipboardList,
  LuCheckCheck,
} from "react-icons/lu";

const Card: React.FC<
  React.PropsWithChildren<{
    title: string;
    value?: number;
    tone?: "blue" | "green" | "violet" | "orange";
    hint?: string;
    icon: React.ReactNode;
  }>
> = ({ title, value, tone = "blue", hint, icon, children }) => {
  const tones = {
    blue:   { text: "#2563EB", glow: "0 0 20px rgba(37,99,235,0.2)" },
    green:  { text: "#059669", glow: "0 0 20px rgba(5,150,105,0.2)" },
    violet: { text: "#7C3AED", glow: "0 0 20px rgba(124,58,237,0.2)" },
    orange: { text: "#EA580C", glow: "0 0 20px rgba(234,88,12,0.2)" },
  }[tone];

  return (
    <div
      style={{
        position: "relative",
        background: "#ffffff",
        border: "1px solid #E5E7EB",
        borderRadius: 16,
        padding: 28,
        display: "grid",
        alignContent: "space-between",
        gap: 12,
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
      }}
    >
      {/* ——— фон-иконка ——— */}
      <div
        style={{
          position: "absolute",
          bottom: -10,
          right: -10,
          fontSize: 120,
          opacity: 0.07,
          color: tones.text,
          pointerEvents: "none",
          transform: "rotate(-10deg)",
        }}
      >
        {icon}
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280" }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          color: tones.text,
          textShadow: tones.glow,
        }}
      >
        {typeof value === "number" ? value.toLocaleString("ru-RU") : "—"}
      </div>
      {hint && (
        <div style={{ fontSize: 13, color: "#9CA3AF" }}>{hint}</div>
      )}
      {children}
    </div>
  );
};

const Skel: React.FC<{ h?: number }> = ({ h = 22 }) => (
  <div
    style={{
      height: h,
      borderRadius: 8,
      background: "#F3F4F6",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: "translateX(-100%)",
        background:
          "linear-gradient(90deg, rgba(243,244,246,0) 0%, rgba(255,255,255,0.5) 50%, rgba(243,244,246,0) 100%)",
        animation: "sk 1.4s infinite",
      }}
    />
    <style>{`@keyframes sk {100%{transform:translateX(100%);}}`}</style>
  </div>
);

export default function AdminDashboardPage() {
  const { data, isFetching, refetch } = useAdminOverall();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        padding: "40px 32px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 28,
            color: "#111827",
          }}
        >
          Статистика
        </h2>
        <button
          onClick={() => refetch()}
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            border: "1px solid #D1D5DB",
            background: "#2563EB",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
        >
          Обновить
        </button>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <Card
          title="Пользователи"
          value={data?.usersCount}
          tone="blue"
          icon={<LuUsers />}
        >
          {isFetching && <Skel h={12} />}
        </Card>

        <Card
          title="Клиенты"
          value={data?.clientsCount}
          tone="violet"
          icon={<LuUser />}
        >
          {isFetching && <Skel h={12} />}
        </Card>

        <Card
          title="Исполнители"
          value={data?.workersCount}
          tone="green"
          icon={<LuUserCheck />}
        >
          {isFetching && <Skel h={12} />}
        </Card>

        <Card
          title="Заказы всего"
          value={data?.ordersCount}
          tone="orange"
          icon={<LuClipboardList />}
        >
          {isFetching && <Skel h={12} />}
        </Card>

        <Card
          title="Завершено"
          value={data?.finishedOrdersCount}
          tone="green"
          icon={<LuCheckCheck />}
        >
          {isFetching && <Skel h={12} />}
        </Card>
      </div>
    </div>
  );
}
