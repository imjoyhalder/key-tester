import type { Metadata, Viewport } from "next"


import "@workspace/ui/globals.css"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"


const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] ?? "https://keytester.io"
const ADSENSE_ID = process.env["NEXT_PUBLIC_ADSENSE_CLIENT_ID"] ?? ""
const GA_MEASUREMENT_ID = process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"] ?? ""

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}

export const metadata: Metadata = {
  title: {
    default: "Keyboard Tester – Free Online Key Test | KeyTester.io",
    template: "%s | KeyTester.io",
  },
  description:
    "Test your keyboard online for free. Press each key to see it register, check key combinations, and troubleshoot unresponsive keys. No download or sign-up.",
  metadataBase: new URL(APP_URL),
  applicationName: "KeyTester.io",
  creator: "KeyTester.io",
  publisher: "KeyTester.io",
  openGraph: {
    type: "website",
    siteName: "KeyTester.io",
    title: "Keyboard Tester – Free Online Key Test",
    description:
      "Know every key works. Test your keyboard in your browser, with instant visual feedback.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KeyTester.io — Know every key works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyboard Tester – Free Online Key Test",
    description: "Know every key works. No download or sign-up.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  category: "technology",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": APP_URL + "/#organization",
      name: "KeyTester.io",
      url: APP_URL,
      logo: APP_URL + "/logo-512.png",
    },
    {
      "@type": "WebSite",
      "@id": APP_URL + "/#website",
      name: "KeyTester.io",
      url: APP_URL,
      publisher: { "@id": APP_URL + "/#organization" },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="font-sans antialiased"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/* Preconnect for ad image CDN — improves LCP when sidebar ads are above fold */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
