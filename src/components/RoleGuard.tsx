import { Navigate, Outlet } from "react-router-dom";
/** roles: "client_person","client_company","exec_graduate","exec_master" */
export function RoleGuard({ allow }: { allow: string[] }) {
  const raw = localStorage.getItem("pb_user");
  const user = raw ? JSON.parse(raw) : null;
  const role = user?.role as string | undefined;
  return role && allow.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
}
