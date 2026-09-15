import { TestStatus } from "@/components/keyboard/test-status"
import { KeyboardLayout } from "@/components/keyboard/keyboard-layout"
import { CustomAdSidebar } from "@/components/ads/custom-ad-sidebar"
import { CustomAdBanner } from "@/components/ads/custom-ad-banner"
import { SponsorCta } from "@/components/ads/sponsor-cta"
import { SoundToggle } from "@/components/controls/sound-toggle"
import type { CustomAd } from "@/types/admin"

interface CenterSectionProps {
  sponsorAds: CustomAd[]
  bannerAds: CustomAd[]
}

export const CenterSection = ({
  sponsorAds,
  bannerAds,
}: CenterSectionProps) => {
  const ctaAd = sponsorAds[0] ?? bannerAds[0]
  const hasBelow = sponsorAds.length > 0 || bannerAds.length > 0

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        data-gsap="keyboard-card"
        className="rounded-xl border border-border bg-card px-4 pt-4 pb-6 shadow-sm"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Free online keyboard tester
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Press a key on your keyboard. See it light up instantly.
            </p>
          </div>
          <SoundToggle />
        </div>
        <p className="mb-3 text-xs text-muted-foreground md:hidden">
          Swipe across the keyboard to see every key. Use a physical keyboard to
          test.
        </p>
        <KeyboardLayout />
        <TestStatus />
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          US QWERTY labels · Windows key = Command on Mac. Some system shortcuts
          may open outside this page.
        </p>
      </div>

      {hasBelow && (
        <div data-gsap="keyboard-extras" className="flex flex-col gap-3">
          {/* Intent-triggered CTA — appears on a faulty key / engaged session */}
          {ctaAd && <SponsorCta ad={ctaAd} />}
          {/* Primary sponsor — the prominent image ad, placed directly below the
              keyboard where user attention naturally lands after testing */}
          {sponsorAds.length > 0 && <CustomAdSidebar ads={sponsorAds} />}
          {bannerAds.length > 0 && <CustomAdBanner ads={bannerAds} />}
        </div>
      )}
    </div>
  )
}
