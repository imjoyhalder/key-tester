import type { Metadata, Viewport } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { GsapEntranceLoader } from "@/components/ui/gsap-entrance-loader"

// Initial states applied synchronously before first paint so elements are never
// briefly visible before GSAP takes over. Header + statsbar are NOT hidden —
// they contain the LCP element and must be visible immediately.
const ENTRANCE_STYLES = `
  html.kt-loading [data-gsap="sidebar-left"] > *   { opacity:0; transform:translateX(-18px) }
  html.kt-loading [data-gsap="keyboard-card"]      { transform:translateY(18px) scale(0.972) }
  html.kt-loading [data-gsap="keyboard-extras"] > *{ opacity:0; transform:translateY(10px) }
  html.kt-loading [data-gsap="sidebar-right"] > *  { opacity:0; transform:translateX(18px) }
  html.kt-loading [data-gsap="footer"]             { opacity:0; transform:translateY(10px) }
`

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

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
    default: "KeyTester.io – Free Online Keyboard Tester",
    template: "%s | KeyTester.io",
  },
  description:
    "Free online keyboard tester — press every key and instantly see which ones work. Diagnose stuck keys, test N-Key Rollover (NKRO), measure input latency, and verify keyboard ghosting. No download required.",
  keywords: [
    "keyboard tester",
    "online keyboard tester",
    "keyboard key test",
    "keyboard checker",
    "mechanical keyboard test",
    "keyboard not working",
    "key not registering",
    "keyboard ghosting test",
    "NKRO test",
    "N-Key Rollover test",
    "keyboard rollover",
    "keyboard latency test",
    "keyboard switch test",
    "keyboard diagnostic",
    "test keyboard online",
    "which keys are broken",
    "keyboard key checker",
  ],
  authors: [{ name: "KeyTester.io" }],
  creator: "KeyTester.io",
  publisher: "KeyTester.io",
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "KeyTester.io",
    title: "KeyTester.io – Free Online Keyboard Tester",
    description:
      "Press any key and instantly see if it works. Free keyboard diagnostic tool — no download, no sign-up. Detects stuck keys, rollover issues, and input latency.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KeyTester.io – Free Online Keyboard Diagnostic Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyTester.io – Free Online Keyboard Tester",
    description:
      "Press any key and instantly see if it works. Free, private, no install needed.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "technology",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "KeyTester.io",
  alternateName: ["Keyboard Tester", "Keyboard Checker", "Online Keyboard Checker"],
  url: APP_URL,
  description:
    "Free online keyboard tester. Press every key and instantly verify which keys work, test N-Key Rollover, and measure input latency — no download required.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time key press detection",
    "N-Key Rollover (NKRO) test",
    "Keyboard ghosting detection",
    "Input latency measurement",
    "ANSI and ISO layout support",
    "Works offline",
    "No sign-up required",
  ],
  screenshot: `${APP_URL}/og-image.png`,
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
      className={cn("antialiased", fontSans.variable, fontMono.variable, "font-mono")}
    >
      <head>
        {/* Entrance initial states — must come before body so elements start hidden */}
        <style dangerouslySetInnerHTML={{ __html: ENTRANCE_STYLES }} />
        {/* Sync script sets class before any body content renders → no flash */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("kt-loading")' }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
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
          <TooltipProvider>
            <GsapEntranceLoader />
            {children}
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
