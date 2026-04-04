import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { auth } from "@/auth";
import { getQueryClient } from "@/lib/query-client";
import { boardsQueryOptions } from "@/features/boards/queries";
import { getBoardsForUser } from "@/services/boards";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Header } from "@/components/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const session = await auth();

  if (session?.user?.id) {
    const boards = await getBoardsForUser(session.user.id);
    queryClient.setQueryData(boardsQueryOptions.queryKey, boards);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-1 flex-col">
            <Header />
            {children}
          </div>
      </div>
    </HydrationBoundary>
  );
}
