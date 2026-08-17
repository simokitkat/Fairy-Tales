import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryProvider } from "@/api/queries";
import { getDefaultLocale, validateLocale } from "@/i18n";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ChannelsPage from "@/routes/$locale/channels";
import StoriesPage from "@/routes/$locale/stories";
import TaleDetailPage from "@/routes/$locale/tales/$slug";
import VideoDetailPage from "@/routes/$locale/videos/$youtubeId";
import VideosPage from "@/routes/$locale/videos";

const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-cloud text-ink antialiased">
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <Outlet />
      </div>
    </QueryProvider>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: `/${getDefaultLocale()}` as any });
  },
});

const localeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale",
  beforeLoad: ({ params }) => {
    if (!validateLocale(params.locale)) {
      throw redirect({ to: `/${getDefaultLocale()}` as any });
    }
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}

const localeStoriesRoute = createRoute({
  getParentRoute: () => localeRoute,
  path: "stories",
  component: StoriesPage,
});

const localeTaleRoute = createRoute({
  getParentRoute: () => localeRoute,
  path: "tales/$slug",
  component: TaleDetailPage,
});

const localeVideosRoute = createRoute({
  getParentRoute: () => localeRoute,
  path: "videos",
  component: VideosPage,
});

const localeVideoRoute = createRoute({
  getParentRoute: () => localeRoute,
  path: "videos/$youtubeId",
  component: VideoDetailPage,
});

const localeChannelsRoute = createRoute({
  getParentRoute: () => localeRoute,
  path: "channels",
  component: ChannelsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  localeRoute.addChildren([
    localeStoriesRoute,
    localeTaleRoute,
    localeVideosRoute,
    localeVideoRoute,
    localeChannelsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
