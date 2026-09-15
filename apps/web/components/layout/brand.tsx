import Image from "next/image"

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/logo.svg"
        alt=""
        width={40}
        height={40}
        className={compact ? "size-8" : "size-10"}
      />
      <span className="text-xl font-semibold tracking-tight text-foreground">
        KeyTester<span className="text-muted-foreground">.io</span>
      </span>
    </span>
  )
}
