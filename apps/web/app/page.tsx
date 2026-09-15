import type { Metadata } from "next"
import { KeyboardHelp } from "@/components/keyboard/keyboard-help"
export const metadata: Metadata = { alternates: { canonical: "/" } }
export const revalidate = 60

import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { CenterSection } from "@/components/layout/center-section"
import { RightSidebar } from "@/components/layout/right-sidebar"
import type { CustomAd } from "@/types/admin"

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:4000"

const getActiveAds = async (slot: string): Promise<CustomAd[]> => {
  try {
    const res = await fetch(`${API_URL}/api/ads/active?slot=${slot}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const json = (await res.json()) as { success: boolean; data: CustomAd[] }
    return json.success ? json.data : []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [leftAds, rightAds, bannerAds] = await Promise.all([
    getActiveAds("sidebar-left"),
    getActiveAds("sidebar"),
    getActiveAds("banner"),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "KeyTester.io",
            url: process.env["NEXT_PUBLIC_APP_URL"] ?? "https://key-tester-web.vercel.app",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript and a physical keyboard",
            description:
              "A free browser-based keyboard tester with visual feedback for received key presses.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <PageHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 2xl:max-w-400">
        <div
          className={`grid grid-cols-1 gap-4 ${rightAds.length > 0 ? "xl:grid-cols-[1fr_230px]" : ""}`}
        >
          <CenterSection sponsorAds={leftAds} bannerAds={bannerAds} />
          {rightAds.length > 0 && <RightSidebar ads={rightAds} />}
        </div>
        <KeyboardHelp />
      </main>

      <PageFooter />
    </div>
  )
}
