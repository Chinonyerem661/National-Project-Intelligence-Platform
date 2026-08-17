import type { Metadata } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shell/Sidebar";
import { PHOTOS, verdictOf, isUndecided } from "@/lib/data";

/* Fraunces carries the display type — a serif with sharp, flared terminals
   that reads as considered and a little characterful rather than another
   flat grotesque, without tipping into decorative. Public Sans is the US
   federal design-system face: institutional, quiet, and not the Inter that
   every dashboard defaults to. Plex Mono handles anything measured —
   coordinates, chainage, contract references. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
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

export const metadata: Metadata = {
  title: "MoT National Project Intelligence Platform",
  description:
    "Portfolio oversight, site evidence verification and disbursement control for national transport infrastructure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const flagged = PHOTOS.filter((p) => verdictOf(p) === "flagged" && isUndecided(p)).length;

  return (
    <html lang="en-NG" className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable}`}>
      <body>
        <Sidebar flagged={flagged} />
        <div className="lg:pl-58">{children}</div>
      </body>
    </html>
  );
}
