import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%]",
        "animate-shimmer",
        className
      )}
      style={{
        animation: "shimmer 2s ease-in-out infinite"
      }}
      {...props}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
    </div>
  )
}

export function BinCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="h-[300px] flex items-end justify-between gap-4 px-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-full" 
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
    </div>
  )
}
