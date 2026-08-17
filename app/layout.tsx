import type { Metadata } from "next";
import { Newsreader, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shell/Sidebar";
import { PHOTOS, verdictOf, isUndecided } from "@/lib/data";

/* Newsreader carries the display type — a serif built for serious long-form
   reading, restrained rather than decorative, the register of an official
   report rather than a product landing page. Public Sans is the US federal
   design-system face: institutional, quiet, and not the Inter that every
   dashboard defaults to. Plex Mono handles anything measured — coordinates,
   chainage, contract references. */
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

// Vercel injects VERCEL_PROJECT_PRODUCTION_URL (the stable production domain)
// and VERCEL_URL (this specific deployment's URL, changes per-preview) at
// build time. Preferring the production one means preview deployments still
// resolve social-share images against the real domain rather than their own
// throwaway URL. Falls back to localhost so `next build` never warns in dev.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MoT National Project Intelligence Platform",
  description:
    "See how national transport projects are going, backed by photos from the site and where the money's going.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const flagged = PHOTOS.filter((p) => verdictOf(p) === "flagged" && isUndecided(p)).length;

  return (
    <html lang="en-NG" className={`${newsreader.variable} ${publicSans.variable} ${plexMono.variable}`}>
      <head>
        {/* Photo placeholders come from an external CDN until real site
            photography is dropped into public/evidence — opening the
            connection early shaves the DNS/TLS handshake off the first
            image request on every page. */}
        <link rel="preconnect" href="https://loremflickr.com" />
        <link rel="dns-prefetch" href="https://loremflickr.com" />
      </head>
      <body>
        <Sidebar flagged={flagged} />
        <div className="lg:pl-58">{children}</div>
      </body>
    </html>
  );
}
