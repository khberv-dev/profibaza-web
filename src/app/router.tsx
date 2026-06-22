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
import LegalOrdersPage from "../features/orders/pages/legal/LegalOrdersPage";
import ExperienceFormPage from "../features/profile/pages/components/worker/experience/ExperienceFormPage";
import VacancyEditorPage from "../features/vacancy/CreateVacancyPage";
import WorkerVacanciesSearchPage from "../features/worker-vacancies/WorkerVacanciesSearchPage";
import LegalOffersPage from "../features/legal-offers/LegalOffersPage";

// ⬇️ Новое: импорт админских страниц и лейаута
import { AdminLayout } from "../layouts/admin/AdminLayout";
import AdminDashboardPage from "../features/admin/AdminDashboardPage";
import AdminInvoicesPage from "../features/admin/AdminInvoicesPage";
import { FindLayout } from "../layouts/FindLayout";
import WorkerDetailPage from "../pages/worker-search/WorkerDetailPage";
import { FindOrTopbarLayout } from "../layouts/FindOrTopbarLayout";
import InvestorCreateProject from "../features/profile/pages/components/InvestorCreateProject";
import InvestorsPage from "../pages/investors/Investors";
import InvestorOffersPage from "../features/investor-offers/InvestorOffersPage";
import InvestorOrdersPage from "../features/orders/pages/legal/InvestorOrdersPage";
import InvestorDetailPage from "../pages/investors/InvestorDetailPage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot", element: <ForgotPasswordPage /> },
  { path: "/register", element: <OtpPage /> },
  {
    path: "find",
    element: <FindOrTopbarLayout />,
    children: [
      { index: true, element: <WorkerSearchPage /> },
      { path: "worker/:id", element: <WorkerDetailPage /> },
      { path: "investors", element: <InvestorsPage /> },
      { path: "investor/:investorId", element: <InvestorDetailPage /> }
    ],
  },

  {
    element: <InactiveOnly />,
    children: [{ path: "/activate", element: <ActivationPage /> }],
  },

  {
    element: <ActiveOnly />,
    children: [
      {
        element: <Protected />,
        children: [
          // ===== Основное приложение
          {
            path: "/app",
            element: <TopbarLayout />,
            children: [
              { index: true, element: <SearchPage /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "notifications", element: <NotificationsPage /> },
              { path: "settings", element: <SettingsPage /> },
              { path: "orders/new", element: <NewOrderPage /> },
              { path: "orders/my", element: <MyOrdersPage /> },
              { path: "find", element: <WorkerSearchPage /> },

              // LEGAL
              {
                element: <RoleGuard allow={["LEGAL"]} />,
                children: [
                  { path: "company/profile", element: <CompanyProfilePage /> },

                  { path: "legal/orders", element: <LegalOrdersPage /> },
                  { path: "legal/vacancy", element: <VacancyEditorPage /> },
                  { path: "legal/offers", element: <LegalOffersPage /> },
                ],
              },

              // CLIENT
              {
                element: <RoleGuard allow={["CLIENT"]} />,
                children: [
                  { path: "client/orders", element: <ClientOrdersPage /> },
                ],
              },
              {
                element: <RoleGuard allow={["INVESTOR"]} />,
                children: [
                  {
                    path: "investor/projects/create",
                    element: <InvestorCreateProject />,
                  },
                  { path: "investor/offers", element: <InvestorOffersPage /> },
                  { path: "investor/orders", element: <InvestorOrdersPage /> },
                ],
              },
              {
                element: <RoleGuard allow={["CLIENT", "LEGAL", "INVESTOR"]} />,
                children: [
                  { path: "client/create-order", element: <CreateOrderPage /> },
                ],
              },

              // WORKER
              {
                element: <RoleGuard allow={["WORKER", "INVESTOR"]} />,
                children: [
                  { path: "worker/jobs", element: <NewWorkerOrdersPage /> },
                  {
                    path: "worker/vacancies",
                    element: <WorkerVacanciesSearchPage />,
                  },
                  {
                    path: "worker/profile/:rowId/edit",
                    element: <WorkerProfessionFormPage mode="edit" />,
                  },
                  {
                    path: "worker/profile/new",
                    element: <WorkerProfessionFormPage mode="create" />,
                  },
                  {
                    path: "worker/profile/experience/new",
                    element: <ExperienceFormPage mode="create" />,
                  },
                  {
                    path: "worker/profile/experience/:rowId/edit",
                    element: <ExperienceFormPage mode="edit" />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <ActiveOnly />,
    children: [
      {
        element: <Protected />,
        children: [
          // ===== Основное приложение
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              // LEGAL
              {
                element: <RoleGuard allow={["ADMIN"]} />,
                children: [
                  { path: "stats", element: <AdminDashboardPage /> },
                  { path: "invoices", element: <AdminInvoicesPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <Page404 /> },
]);
