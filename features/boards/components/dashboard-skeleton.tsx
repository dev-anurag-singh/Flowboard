import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* Greeting */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="col-span-2 h-24 rounded-lg lg:col-span-1" />
      </div>

      {/* Boards */}
      <div>
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="hidden h-20 rounded-lg sm:block" />
          <Skeleton className="hidden h-20 rounded-lg sm:block" />
        </div>
      </div>
    </div>
  );
}
