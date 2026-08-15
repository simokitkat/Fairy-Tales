import { Outlet } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
