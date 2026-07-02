import type { CustomAd } from "@/types/admin"
import { AdImage } from "./ad-image"

interface CustomAdBannerProps {
  ads: CustomAd[]
}

export const CustomAdBanner = ({ ads }: CustomAdBannerProps) => {
  if (ads.length === 0) return null
  const ad = ads[0]!

  return (
    <a
      href={ad.linkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={ad.altText || ad.title}
      className={[
        "group flex items-center gap-4 w-full rounded-xl overflow-hidden",
        "border border-border bg-card",
        "hover:border-violet-500/60 hover:shadow-md hover:shadow-violet-500/5",
        "transition-all duration-200",
        "min-h-[72px]",
      ].join(" ")}
    >
      {/* Thumbnail — fixed width on all screen sizes */}
      <div className="relative shrink-0 w-28 sm:w-36 self-stretch min-h-[72px] overflow-hidden bg-muted">
        <AdImage
          src={ad.imageUrl}
          alt={ad.altText || ad.title}
          mode="fill"
          sizes="144px"
        />
      </div>

      {/* Text content */}
      <div className="flex-1 py-3 pr-4 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider bg-violet-500/15 text-violet-500 dark:text-violet-400">
            Sponsored
          </span>
        </div>
        <p className="text-sm font-mono font-semibold text-foreground line-clamp-1">
          {ad.title}
        </p>
        <p className="text-[11px] text-muted-foreground font-mono truncate">
          {ad.linkUrl.replace(/^https?:\/\//, "").split("/")[0]}
        </p>
      </div>

      {/* Arrow */}
      <div className="shrink-0 pr-4 text-muted-foreground group-hover:text-violet-400 transition-colors">
        <svg
          className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </a>
  )
}
