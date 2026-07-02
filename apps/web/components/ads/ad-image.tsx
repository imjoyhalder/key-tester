"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface AdImageProps {
  src: string
  alt: string
  sizes?: string
  /**
   * "natural" (default): the wrapper adopts the image's real aspect ratio once
   *   loaded, so the full creative fills the width with no crop and no letterbox.
   * "fill": fills the parent (which must be `relative` + sized) and crops with
   *   object-cover — used for the fixed-size thumbnail.
   */
  mode?: "natural" | "fill"
  /** Fallback aspect ratio shown by the skeleton before the image loads. */
  defaultAspect?: string
  className?: string
  /** Load eagerly (for prominent, above-the-fold ad slots). */
  priority?: boolean
}

// Ad creative via next/image (server-optimized → reliable, fast) with a shimmer
// skeleton underneath while it decodes.
export const AdImage = ({
  src,
  alt,
  sizes = "100vw",
  mode = "natural",
  defaultAspect = "16 / 6",
  className,
  priority = false,
}: AdImageProps) => {
  const [aspect, setAspect] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    if (el.naturalWidth && el.naturalHeight) {
      setAspect(`${el.naturalWidth} / ${el.naturalHeight}`)
    }
    setLoaded(true)
  }

  const skeleton = !loaded ? (
    <div
      className="absolute inset-0 animate-pulse bg-linear-to-br from-muted to-muted-foreground/10"
      aria-hidden="true"
    />
  ) : null

  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onLoad={handleLoad}
      className={cn(
        "object-cover transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0"
      )}
    />
  )

  // Parent supplies the sized, relative container.
  if (mode === "fill") {
    return (
      <>
        {skeleton}
        {image}
      </>
    )
  }

  // Wrapper adopts the image's real aspect ratio → no crop, no letterbox.
  return (
    <div
      className={cn("relative w-full overflow-hidden bg-muted", className)}
      style={{ aspectRatio: aspect ?? defaultAspect }}
    >
      {skeleton}
      {image}
    </div>
  )
}
