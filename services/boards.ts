import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { boards, columns } from "@/lib/db/schema";

export async function getBoardsForUser(userId: string) {
  return db
    .select()
    .from(boards)
    .where(eq(boards.userId, userId))
    .orderBy(boards.order);
}

export async function createBoard(
  userId: string,
  name: string,
  boardColumns: { name: string }[],
) {
  const [lastBoard] = await db
    .select({ order: boards.order })
    .from(boards)
    .where(eq(boards.userId, userId))
    .orderBy(desc(boards.order))
    .limit(1);

  const newOrder = lastBoard ? lastBoard.order + 1 : 1;

  return db.transaction(async (tx) => {
    const [board] = await tx
      .insert(boards)
      .values({ name, userId, order: newOrder })
      .returning();

    if (boardColumns.length > 0) {
      await tx.insert(columns).values(
        boardColumns.map((col, idx) => ({
          name: col.name,
          order: idx,
          userId,
          boardId: board.id,
        })),
      );
    }

    return board;
  });
}
