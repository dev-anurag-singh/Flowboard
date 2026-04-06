import { Skeleton } from "@/components/ui/skeleton";

function SkeletonColumn({ className }: { className?: string }) {
  return (
    <div className={`w-72 shrink-0 space-y-5 ${className ?? ""}`}>
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-24 w-72" />
      <Skeleton className="h-24 w-72" />
      <Skeleton className="h-24 w-72" />
      <Skeleton className="h-24 w-72" />
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="flex grow gap-6 overflow-hidden p-4">
      <SkeletonColumn />
      <SkeletonColumn />
      <SkeletonColumn />
      <SkeletonColumn className="hidden xl:block" />
      <SkeletonColumn className="hidden 2xl:block" />
    </div>
  );
}
