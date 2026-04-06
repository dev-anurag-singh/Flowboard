import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { boards, columns, tasks } from "@/lib/db/schema";

export async function getBoardsForUser(userId: string) {
  return db
    .select()
    .from(boards)
    .where(eq(boards.userId, userId))
    .orderBy(boards.order);
}

export async function getBoardById(userId: string, boardId: string) {
  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.userId, userId)),
    with: {
      columns: {
        orderBy: asc(columns.order),
        with: {
          tasks: {
            where: isNull(tasks.parentId),
            orderBy: asc(tasks.order),
            with: {
              subtasks: {
                orderBy: asc(tasks.order),
              },
            },
          },
        },
      },
    },
  });

  return board ?? null;
}

export async function deleteBoard(userId: string, boardId: string) {
  const [board] = await db
    .delete(boards)
    .where(and(eq(boards.id, boardId), eq(boards.userId, userId)))
    .returning();

  return board ?? null;
}

export async function updateBoard(
  userId: string,
  boardId: string,
  data: Partial<Pick<typeof boards.$inferInsert, "name" | "order">>,
) {
  const [board] = await db
    .update(boards)
    .set(data)
    .where(and(eq(boards.id, boardId), eq(boards.userId, userId)))
    .returning();

  return board ?? null;
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
