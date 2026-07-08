import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ThemeProvider } from "@/hooks/useTheme";
// Side-effect import: registers the `beforeinstallprompt` window listener
// at the earliest possible point in the bundle, before any route renders,
// so the event can't be lost to a React-mount race.
import "@/hooks/pwaInstallStore";
// Side-effect import: initializes i18next + the language detector (reads
// localStorage["lng"], falling back to the browser language) before any
// route renders. `useTranslation()` then re-renders consumers on
// `i18n.changeLanguage()` with no provider required.
import "@/i18n";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

const noFlashScript = `(function(){try{var m=localStorage.getItem('theme');if(m!=='light'&&m!=='dark'&&m!=='auto')m='auto';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var r=m==='auto'?(d?'dark':'light'):m;if(m!=='auto'){document.documentElement.setAttribute('data-theme',m);}document.documentElement.style.colorScheme=r;var a=localStorage.getItem('accent');var ids=['blue','purple','red','orange','yellow','green'];if(ids.indexOf(a)<0)a='blue';document.documentElement.classList.add('theme-'+a);}catch(e){}})();`;

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">{t("errors.notFoundCode")}</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("errors.notFoundTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("errors.notFoundDesc")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("errors.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("errors.errorTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("errors.errorDesc")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("errors.tryAgain")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("errors.goHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "apple-mobile-web-app-title", content: "SilverChat" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { title: "SilverChat — Futuristic messaging" },
      { name: "description", content: "A sleek, silver-and-neon messaging experience." },
      { name: "author", content: "SilverChat" },
      { property: "og:title", content: "SilverChat" },
      { property: "og:description", content: "A sleek, silver-and-neon messaging experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon-96x96.png?v=1", sizes: "96x96" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=1" },
      { rel: "shortcut icon", href: "/favicon.ico?v=1" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=1" },
      { rel: "manifest", href: "/manifest.json?v=3" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { i18n } = useTranslation();

  // Keep `<html lang>` in sync with the active i18next language so screen
  // readers and `toLocaleDateString` use the right locale, and persist the
  // resolved locale (e.g. narrowing "es-ES" → "es") back into i18next.
  useEffect(() => {
    const el = document.documentElement;
    if (el.lang !== i18n.language) el.lang = i18n.language;
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        {/* Global toast portal — renders into <body> via sonner's portal. */}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
