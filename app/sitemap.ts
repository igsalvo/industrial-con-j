import type { MetadataRoute } from "next";

const siteUrl = "https://industrialconj.cl";

const publicRoutes = [
  "",
  "/podcast",
  "/events",
  "/honor",
  "/guests",
  "/sponsors",
  "/donations",
  "/contact",
  "/tiendiita",
  "/identity",
  "/community",
  "/episodes"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));
}
