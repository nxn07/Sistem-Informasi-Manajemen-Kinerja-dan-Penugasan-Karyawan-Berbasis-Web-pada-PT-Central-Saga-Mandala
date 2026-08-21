"use client";

export function TaskCardSkeleton() {
  return (
    <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs animate-pulse flex flex-col justify-between h-48">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-20 h-5 bg-slate-200 rounded-full" />
          <div className="w-14 h-4 bg-slate-100 rounded-md" />
        </div>
        <div className="w-3/4 h-5 bg-slate-200 rounded-md mb-2" />
        <div className="w-full h-3 bg-slate-100 rounded-md mb-1.5" />
        <div className="w-2/3 h-3 bg-slate-100 rounded-md" />
      </div>

      <div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="w-24 h-4 bg-slate-100 rounded-md" />
          <div className="w-20 h-4 bg-slate-200 rounded-md" />
        </div>
        <div className="pt-2 flex justify-between gap-2">
          <div className="flex-1 h-8 bg-slate-100 rounded-lg" />
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function TaskGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}
