import { Suspense } from "react";
import { auth } from "@/auth";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { getDashboardData } from "@/services/boards";
import { dashboardQueryOptions } from "@/features/boards/queries";
import { DashboardView } from "@/features/boards/components/dashboard-view";

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0];

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: dashboardQueryOptions.queryKey,
    queryFn: () => getDashboardData(session!.user!.id!),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <DashboardView firstName={firstName} />
      </Suspense>
    </HydrationBoundary>
  );
}
