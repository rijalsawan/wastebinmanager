export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
