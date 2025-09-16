import { createBrowserRouter } from "react-router-dom";
import { Protected } from "../components/Protected";
import LoginPage from "../features/auth/pages/LoginPage";
import OtpPage from "../features/auth/pages/OtpPage";
import SearchPage from "../features/search/pages/SearchPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import NewOrderPage from "../features/orders/pages/NewOrderPage";
import MyOrdersPage from "../features/orders/pages/MyOrdersPage";
import { RoleGuard } from "../components/RoleGuard";
import CompanyProfilePage from "../features/profile/pages/CompanyProfilePage";
import LandingPage from "../pages/landing/LandingPage";
import Page404 from "../pages/not-found/Page404";

export const router = createBrowserRouter([
  // Публичные страницы
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <OtpPage /> },

  // Приложение — только после входа
  {
    path: "/app",
    element: <Protected />,
    children: [
      { index: true, element: <SearchPage /> }, // /app
      { path: "profile", element: <ProfilePage /> }, // /app/profile
      { path: "orders/new", element: <NewOrderPage /> }, // /app/orders/new
      { path: "orders/my", element: <MyOrdersPage /> }, // /app/orders/my

      {
        element: <RoleGuard allow={["client_company"]} />,
        children: [
          { path: "company/profile", element: <CompanyProfilePage /> }, // /app/company/profile
        ],
      },
    ],
  },

  // 404 (по желанию)
  { path: "*", element: <Page404 /> },
]);
