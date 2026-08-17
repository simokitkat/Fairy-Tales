import { QueryProvider } from "@/api/queries";
import { RouterProvider } from "@tanstack/react-router";
import { i18n } from "@/i18n";
import { router } from "@/router";
import "@/styles/globals.css";

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
