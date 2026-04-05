import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { getBoardById } from "@/services/boards";
import { boardByIdQueryOptions } from "@/features/boards/queries";
import { BoardView } from "@/features/boards/components/board-view";
import { BoardSkeleton } from "@/features/boards/components/board-skeleton";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const { boardId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: boardByIdQueryOptions(boardId).queryKey,
    queryFn: () => getBoardById(userId, boardId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<BoardSkeleton />}>
        <BoardView boardId={boardId} />
      </Suspense>
    </HydrationBoundary>
  );
}
