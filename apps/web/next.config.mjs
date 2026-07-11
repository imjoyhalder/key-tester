/** @type {import('next').NextConfig} */

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:4000"
const isDev = process.env.NODE_ENV === "development"

// unsafe-eval is required by Turbopack in dev but must not ship to production.
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  isDev ? "'unsafe-eval'" : null,
  "https://pagead2.googlesyndication.com",
  "https://www.googletagservices.com",
  "https://partner.googleadservices.com",
  "https://adservice.google.com",
  "https://www.googletagmanager.com",
  "https://va.vercel-scripts.com",
].filter(Boolean).join(" ")

const CSP = [
  `default-src 'self'`,
  `script-src ${scriptSrc}`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  `img-src 'self' data: https: blob:`,
  `connect-src 'self' ${API_URL} ws://localhost:* wss://localhost:* https://www.google-analytics.com https://vitals.vercel-insights.com https://*.adtrafficquality.google`,
  `frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.adtrafficquality.google`,
  `object-src 'none'`,
  `base-uri 'self'`,
].join("; ")

const securityHeaders = [
  { key: "X-Frame-Options",              value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",       value: "nosniff" },
  { key: "Referrer-Policy",              value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy",   value: "same-origin-allow-popups" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "Permissions-Policy",           value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security",    value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection",            value: "1; mode=block" },
  { key: "Content-Security-Policy",      value: CSP },
]

const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  compress: true,
  poweredByHeader: false,
  images: {
    // Ad creatives are served from Cloudinary — allow next/image to optimize them.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
  // Proxy API calls through this app's own origin so the auth session cookie
  // (set on the response to these requests) is scoped to this domain instead
  // of the API's — the web app and API are on different vercel.app
  // subdomains with no shared parent domain, so a cross-domain cookie can
  // never be read by this app's own middleware. Real routes under /api
  // (e.g. /api/revalidate) are checked first and take priority over this.
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API_URL}/api/:path*` },
    ]
  },
}

export default nextConfig
