import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "../shared/auth/roles";
import { useAuthStore } from "../shared/stores/auth";

export function RoleGuard({ allow }: { allow: UserRole[] }) {
  const role = useAuthStore((s) => s.role);
  return role && allow.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
}