import { Navigate, Outlet } from "react-router-dom";

export function Protected() {
  const token = localStorage.getItem("pb_token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
