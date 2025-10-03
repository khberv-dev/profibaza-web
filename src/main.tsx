import "./lib/i18n.ts";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppTheme } from "./app/theme.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.tsx";
import { queryClient } from "./app/queryClient.ts";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppTheme>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0b0b0f",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "14px",
          },
        }}
      />
    </AppTheme>
  </QueryClientProvider>
);
