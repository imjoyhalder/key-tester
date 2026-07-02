import type { CustomAd } from "@/types/admin"
import { AdImage } from "./ad-image"

interface CustomAdSidebarProps {
  ads: CustomAd[]
}

export const CustomAdSidebar = ({ ads }: CustomAdSidebarProps) => {
  if (ads.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={ad.altText || ad.title}
          className={[
            "group block rounded-xl overflow-hidden border border-border bg-card",
            "hover:border-violet-500/60 hover:shadow-md hover:shadow-violet-500/5",
            "transition-all duration-200",
          ].join(" ")}
        >
          {/* Image — the wrapper adopts the creative's real aspect ratio, so the
              full banner fills the width with no crop and no letterbox. */}
          <div className="relative w-full">
            <AdImage
              src={ad.imageUrl}
              alt={ad.altText || ad.title}
              mode="natural"
              className="rounded-t-xl"
              sizes="(max-width: 1280px) 100vw, 900px"
              priority
            />
            {/* Sponsored badge */}
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider bg-black/60 text-white/90 backdrop-blur-sm">
              Sponsored
            </span>
          </div>

          {/* Caption */}
          <div className="px-3 py-2.5 flex items-center justify-between gap-2">
            <p className="text-xs font-mono font-medium text-foreground line-clamp-1 flex-1">
              {ad.title}
            </p>
            {/* Arrow indicator */}
            <svg
              className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </a>
      ))}
    </div>
  )
}
