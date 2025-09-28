import "./lib/i18n.ts";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppTheme } from "./app/theme.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.tsx";
import { queryClient } from "./app/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppTheme>
      <RouterProvider router={router} />
    </AppTheme>
  </QueryClientProvider>
);
