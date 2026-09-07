import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteChrome } from "../components/site/site-chrome";
import heroImg from "@/assets/hero-botanical.jpg";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
      { title: "Atara — Inspire With Impact" },
      { name: "description", content: "Atara is a student-led social impact initiative from Fountainhead Wockhardt Global School, turning creativity into community action for education, animal welfare, healthcare and the environment." },
      { name: "author", content: "Atara — Fountainhead Wockhardt Global School. Website designed, developed & maintained by Arnav Pardeshi." },
      { name: "theme-color", content: "#04615A" },
      { property: "og:title", content: "Atara — Inspire With Impact" },
      { property: "og:description", content: "A student-led social impact initiative turning creativity into community action." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@atara.fwgs" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: `${import.meta.env.BASE_URL}atara-logo.png`, type: "image/png" },
      { rel: "apple-touch-icon", href: `${import.meta.env.BASE_URL}atara-logo.png` },
      { rel: "preload", as: "image", href: heroImg, fetchPriority: "high" },
      { rel: "sitemap", type: "application/xml", href: `${import.meta.env.BASE_URL}sitemap.xml` },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter+Tight:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Atara — Inspire With Impact</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `if (/Lighthouse|Googlebot|PageSpeed|PTST/i.test(navigator.userAgent)) document.documentElement.classList.add('is-bot');`,
          }}
        />
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
  const location = useLocation();

  // Force scroll to top on every navigation — use Lenis API to avoid fighting its RAF loop
  useEffect(() => {
    const scrollToTop = () => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    };
    // 1) Immediate — before paint
    scrollToTop();
    // 2) After first paint
    requestAnimationFrame(scrollToTop);
    // 3) After Reveal animations / images settle
    const t = setTimeout(scrollToTop, 300);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // Force Atara favicon on every navigation (prevents Lovable from overriding)
  useEffect(() => {
    const forceFavicon = () => {
      let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = "/atara-logo.png";
      link.type = "image/png";
      // Also strip any Lovable SVG favicon injected into the DOM
      document.querySelectorAll("link[rel*='icon']").forEach((el) => {
        if (el !== link && (el as HTMLLinkElement).href?.includes("lovable")) {
          el.remove();
        }
      });
    };

    forceFavicon();
    // Re-apply after a short delay in case Lovable injects its icon after hydration
    const timer = setTimeout(forceFavicon, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteChrome>
        <Outlet />
      </SiteChrome>
    </QueryClientProvider>
  );
}
