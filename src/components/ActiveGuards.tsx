// src/app/components/ActiveGuards.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../shared/stores/auth";
import ActivationGate from "./ActivationGate";

function Splash() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b0f19", color: "#cbd5ff" }}>
      Загрузка…
    </div>
  );
}

/** Разрешает детей только если active === true */
export function ActiveOnly() {
  const active = useAuthStore((s) => s.active);
  const me = useAuthStore((s) => s.me);

  // ещё не знаем состояние
  if (typeof active !== "boolean" && !me) return <Splash />;

  // если не активен — отправим на /activate
  if (active === false) return <Navigate to="/activate" replace />;

  return <Outlet />;
}

/** Разрешает детей только если active === false.
 *  Полезно для страницы активации. */
export function InactiveOnly() {
  const active = useAuthStore((s) => s.active);
  const me = useAuthStore((s) => s.me);
  const location = useLocation();

  if (typeof active !== "boolean" && !me) return <Splash />;

  // уже активен — если здесь по ошибке, отправим в приложение
  if (active === true) {
    // если пришли со страницы логина/лендинга — можно в /app
    return <Navigate to="/app" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

/** Просто обёртка для рендера экрана активации как страницы */
export function ActivationPage() {
  return <ActivationGate />;
}
