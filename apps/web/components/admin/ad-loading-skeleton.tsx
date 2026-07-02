import { Skeleton } from "@workspace/ui/components/skeleton"

export const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-border/50">
        <Skeleton className="w-full sm:w-24 h-16 rounded-md shrink-0" />
        <div className="flex-1 space-y-2 w-full">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="h-8 w-full sm:w-16" />
          <Skeleton className="h-8 w-full sm:w-16" />
        </div>
      </div>
    ))}
  </div>
)
