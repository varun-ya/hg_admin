export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#DCDCDC] p-5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-100 rounded w-24" />
              <div className="h-6 bg-slate-100 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#DCDCDC] p-6 animate-pulse ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 bg-slate-100 rounded w-40" />
        <div className="h-8 bg-slate-100 rounded w-24" />
      </div>
      <div className="h-[180px] bg-slate-50 rounded-xl" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#DCDCDC] overflow-hidden animate-pulse ${className}`}>
      <div className="px-6 py-4 border-b border-slate-50">
        <div className="h-4 bg-slate-100 rounded w-48" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-slate-50 last:border-none">
          <div className="w-9 h-9 rounded-full bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-100 rounded w-32" />
            <div className="h-2.5 bg-slate-50 rounded w-48" />
          </div>
          <div className="h-7 bg-slate-100 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

export function QueueSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#DCDCDC] overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-slate-50">
        <div className="h-4 bg-slate-100 rounded w-40" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="px-5 py-4 flex items-start gap-3 border-b border-slate-50 last:border-none">
          <div className="w-2 h-2 rounded-full bg-slate-100 mt-1.5 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-100 rounded w-44" />
            <div className="h-2.5 bg-slate-50 rounded w-56" />
          </div>
        </div>
      ))}
    </div>
  );
}
