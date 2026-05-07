import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/ui/providers";
import { getSiteConfig } from "@/lib/queries";

export const dynamic = "force-dynamic";

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
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="grain min-h-screen">
            <SiteHeader
              showPodcastLink={siteConfig.showPodcastSection}
              showEventsLink={siteConfig.showEventsSection}
              showHonorLink={siteConfig.showHonorSection}
              showProductsLink={siteConfig.showProductsSection}
              showCommunityLink={siteConfig.showCommunityLink}
              showDonationsLink={siteConfig.showDonationsSection}
              logoUrl={siteConfig.logoUrl}
            />
            <main>{children}</main>
            <SiteFooter
              showCommunityLink={siteConfig.showCommunityLink}
              showDonationsLink={siteConfig.showDonationsSection}
              footerTitle={siteConfig.footerTitle}
              footerDescription={siteConfig.footerDescription}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
