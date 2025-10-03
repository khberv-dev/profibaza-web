// src/app/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import { Protected } from "../components/Protected";
import { RoleGuard } from "../components/RoleGuard";

import LoginPage from "../features/auth/pages/LoginPage";
import OtpPage from "../features/auth/pages/OtpPage";
import ForgotPasswordPage from "../features/auth/forgot/ForgotPasswordPage";

import LandingPage from "../pages/landing/LandingPage";
import Page404 from "../pages/not-found/Page404";

import { TopbarLayout } from "../layouts/TopbarLayout";

import SearchPage from "../features/search/pages/SearchPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import NewOrderPage from "../features/orders/pages/NewOrderPage";
import MyOrdersPage from "../features/orders/pages/MyOrdersPage";
import CompanyProfilePage from "../features/profile/pages/CompanyProfilePage";
import MastersSearchPage from "../features/search/pages/MasterCard";
import { WorkerSearchPage } from "../pages/worker-search/WorkerSearchPage";
import CreateOrderPage from "../pages/worker-search/create-order/CreateOrderPage";
import ClientOrdersPage from "../features/orders/pages/client/ClientOrdersPage";
import NewWorkerOrdersPage from "../features/orders/pages/worker/NewWorkerOrdersPage";

export const router = createBrowserRouter([
  // Публичные
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot", element: <ForgotPasswordPage /> },
  { path: "/register", element: <OtpPage /> },

  // Всё ниже — только после входа
  {
    element: <Protected />,
    children: [
      {
        path: "/app",
        element: <TopbarLayout />,
        children: [
          { index: true, element: <SearchPage /> }, // /app
          { path: "profile", element: <ProfilePage /> }, // /app/profile
          { path: "settings", element: <SettingsPage /> }, // /app/settings
          { path: "orders/new", element: <NewOrderPage /> }, // /app/orders/new
          { path: "orders/my", element: <MyOrdersPage /> }, // /app/orders/my // /app/orders/my
          // { path: "find", element: <MastersSearchPage /> },
          { path: "find", element: <WorkerSearchPage /> },

          // Раздел только для LEGAL (компании)
          {
            element: <RoleGuard allow={["LEGAL", "WORKER"]} />,
            children: [
              { path: "company/profile", element: <CompanyProfilePage /> }, // /app/company/profile
            ],
          },

          // при необходимости добавим блоки для CLIENT/WORKER
          {
            element: <RoleGuard allow={["CLIENT"]} />,
            children: [
              { path: "client/create-order", element: <CreateOrderPage /> },
              { path: "client/orders", element: <ClientOrdersPage /> },
            ],
          },
          {
            element: <RoleGuard allow={["WORKER"]} />,
            children: [{ path: "worker/jobs", element: <NewWorkerOrdersPage /> }],
          },
        ],
      },
    ],
  },

  // 404
  { path: "*", element: <Page404 /> },
]);
