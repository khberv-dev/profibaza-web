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
import { WorkerSearchPage } from "../pages/worker-search/WorkerSearchPage";
import CreateOrderPage from "../pages/worker-search/create-order/CreateOrderPage";
import ClientOrdersPage from "../features/orders/pages/client/ClientOrdersPage";
import NewWorkerOrdersPage from "../features/orders/pages/worker/NewWorkerOrdersPage";
import WorkerProfessionFormPage from "../features/profile/pages/components/worker/WorkerProfessionFormPage";

import {
  ActiveOnly,
  InactiveOnly,
  ActivationPage,
} from "../components/ActiveGuards";

export const router = createBrowserRouter([
  /* ===== Публичные: доступны всегда, независимо от active ===== */
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot", element: <ForgotPasswordPage /> },
  { path: "/register", element: <OtpPage /> },

  /* ===== Зона «не активен»: показываем страницу активации и
     любые дополнительные публичные страницы для неактивных ===== */
  {
    element: <InactiveOnly />,
    children: [
      { path: "/activate", element: <ActivationPage /> },
      // если нужно, можно добавить сюда и другие страницы, доступные только до активации
      // например: { path: "/pricing", element: <PricingPage /> },
    ],
  },

  /* ===== Зона «активен»: основное приложение под /app ===== */
  {
    element: <ActiveOnly />, // пускает только active === true
    children: [
      {
        element: <Protected />, // ваша авторизация/токен
        children: [
          {
            path: "/app",
            element: <TopbarLayout />,
            children: [
              { index: true, element: <SearchPage /> }, // /app
              { path: "profile", element: <ProfilePage /> },
              { path: "settings", element: <SettingsPage /> },
              { path: "orders/new", element: <NewOrderPage /> },
              { path: "orders/my", element: <MyOrdersPage /> },
              { path: "find", element: <WorkerSearchPage /> },

              // Раздел только для LEGAL (компании)
              {
                element: <RoleGuard allow={["LEGAL", "WORKER"]} />,
                children: [
                  { path: "company/profile", element: <CompanyProfilePage /> },
                  { path: "client/create-order", element: <CreateOrderPage /> },
                  { path: "legal/orders", element: <ClientOrdersPage /> },
                ],
              },

              // Блоки для CLIENT
              {
                element: <RoleGuard allow={["CLIENT"]} />,
                children: [
                  { path: "client/create-order", element: <CreateOrderPage /> },
                  { path: "client/orders", element: <ClientOrdersPage /> },
                ],
              },

              // Блоки для WORKER
              {
                element: <RoleGuard allow={["WORKER"]} />,
                children: [
                  { path: "worker/jobs", element: <NewWorkerOrdersPage /> },
                  {
                    path: "worker/profile/:rowId/edit",
                    element: <WorkerProfessionFormPage mode="edit" />,
                  },
                  {
                    path: "worker/profile/new",
                    element: <WorkerProfessionFormPage mode="create" />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  /* ===== 404 ===== */
  { path: "*", element: <Page404 /> },
]);
