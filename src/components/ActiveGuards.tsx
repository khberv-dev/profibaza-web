import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../shared/stores/auth";
import ActivationGate from "./ActivationGate";

/** Разрешает детей только если active === true */
export function ActiveOnly() {
  const token = useAuthStore((s) => s.token);
  const active = useAuthStore((s) => s.active);
  const me = useAuthStore((s) => s.me);

  // 🔹 если нет токена — сразу на логин
  if (!token) return <Navigate to="/login" replace />;

  // 🔹 если статус ещё не определён — ничего не рендерим
  if (typeof active !== "boolean" && !me) return null;

  // 🔹 если не активен — направляем на /activate
  if (active === false) return <Navigate to="/activate" replace />;

  // 🔹 если активен — пускаем внутрь
  return <Outlet />;
}

/** Разрешает детей только если active === false (страница активации) */
export function InactiveOnly() {
  const token = useAuthStore((s) => s.token);
  const active = useAuthStore((s) => s.active);
  const me = useAuthStore((s) => s.me);
  const location = useLocation();

  // 🔹 если нет токена — сразу на логин
  if (!token) return <Navigate to="/login" replace />;

  // 🔹 пока неизвестно — ничего не показываем
  if (typeof active !== "boolean" && !me) return null;

  // 🔹 если уже активен — направляем в приложение
  if (active === true)
    return <Navigate to="/app" state={{ from: location }} replace />;

  // 🔹 иначе показываем контент (экран активации)
  return <Outlet />;
}

/** Просто страница активации */
export function ActivationPage() {
  return <ActivationGate />;
}
