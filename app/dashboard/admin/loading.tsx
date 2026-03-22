export default function Loading() {
  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-[#F0F0F0] shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 rounded-2xl bg-[#F0F0F0] shimmer" />
        <div className="h-72 rounded-2xl bg-[#F0F0F0] shimmer" />
      </div>
      <div className="h-80 rounded-2xl bg-[#F0F0F0] shimmer" />
    </div>
  );
}
