import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeScript } from "@/components/ui/theme-script";
import { getSiteConfig } from "@/lib/queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Industrial con J",
  description: "Plataforma editorial, comunidad y patrocinio para el podcast Industrial con J."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteConfig = await getSiteConfig();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeScript />
        <div className="grain min-h-screen">
          <SiteHeader showCommunityLink={siteConfig.showCommunityLink} />
          <main>{children}</main>
          <SiteFooter showCommunityLink={siteConfig.showCommunityLink} />
        </div>
      </body>
    </html>
  );
}
