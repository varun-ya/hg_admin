export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#DCDCDC] p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F0F0F0] shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-[#F0F0F0] rounded w-24 shimmer" />
              <div className="h-6 bg-[#F0F0F0] rounded w-16 shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#DCDCDC] p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 bg-[#F0F0F0] rounded w-40 shimmer" />
        <div className="h-8 bg-[#F0F0F0] rounded w-24 shimmer" />
      </div>
      <div className="h-[180px] bg-[#F0F0F0] rounded-xl shimmer" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#DCDCDC] overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-[#F5F5F5]">
        <div className="h-4 bg-[#F0F0F0] rounded w-48 shimmer" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-[#F5F5F5] last:border-none">
          <div className="w-9 h-9 rounded-full bg-[#F0F0F0] shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-[#F0F0F0] rounded w-32 shimmer" />
            <div className="h-2.5 bg-[#F5F5F5] rounded w-48 shimmer" />
          </div>
          <div className="h-7 bg-[#F0F0F0] rounded w-20 shimmer" />
        </div>
      ))}
    </div>
  );
}

export function QueueSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#DCDCDC] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F5F5F5]">
        <div className="h-4 bg-[#F0F0F0] rounded w-40 shimmer" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="px-5 py-4 flex items-start gap-3 border-b border-[#F5F5F5] last:border-none">
          <div className="w-2 h-2 rounded-full bg-[#F0F0F0] mt-1.5 shrink-0 shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-[#F0F0F0] rounded w-44 shimmer" />
            <div className="h-2.5 bg-[#F5F5F5] rounded w-56 shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
