import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env["NEXT_PUBLIC_APP_URL"] ?? "https://keytester.io"

  return [
    {
      url: base,
      lastModified: new Date("2025-05-14"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date("2025-05-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date("2025-05-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
