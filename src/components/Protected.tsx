// src/components/Protected.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../shared/stores/auth";

export function Protected() {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
}
