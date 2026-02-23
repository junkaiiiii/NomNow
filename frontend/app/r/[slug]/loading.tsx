export default function Loading() {
    return (
      <div className="min-h-screen bg-gray-50">
  
        {/* Header Skeleton */}
        <div className="bg-black p-6">
          <div className="h-7 w-48 bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
        </div>
  
        {/* Menu Skeleton */}
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 ml-4" />
            </div>
          ))}
        </div>
  
      </div>
    )
  }