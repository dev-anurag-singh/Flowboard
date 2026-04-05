import { Skeleton } from "@/components/ui/skeleton";

export function BoardSkeleton() {
  return (
    <div className="flex grow gap-6 overflow-hidden p-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="w-72 shrink-0 space-y-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-24 w-72" />
          <Skeleton className="h-24 w-72" />
          <Skeleton className="h-24 w-72" />
          <Skeleton className="h-24 w-72" />
        </div>
      ))}
    </div>
  );
}
