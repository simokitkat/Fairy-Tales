import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { RootLayout } from "@/routes/__root";
import { LocaleLayout } from "@/routes/$locale";
import { StoriesPage } from "@/routes/$locale/stories";

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/en" });
  },
});

const localeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale",
  component: LocaleLayout,
});

const localeStoriesRoute = createRoute({
  getParentRoute: () => localeRoute,
  path: "stories",
  component: StoriesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  localeRoute.addChildren([localeStoriesRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
