import React from "react";
import ReactDOM from "react-dom/client";
import { QueryProvider } from "@/api/queries";
import { RouterProvider } from "@tanstack/react-router";
import { i18nReady } from "@/i18n";
import { router } from "@/router";
import "@/styles/globals.css";

async function init() {
  await i18nReady;
  const root = document.getElementById("root");
  if (!root) return;

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </React.StrictMode>,
  );
}

init().catch((error) => {
  console.error("Failed to initialize application:", error);
});
