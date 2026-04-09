import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { columns } from "@/lib/db/schema";

export async function createColumn(
  userId: string,
  boardId: string,
  name: string,
  id?: string,
) {
  const [lastColumn] = await db
    .select({ order: columns.order })
    .from(columns)
    .where(and(eq(columns.boardId, boardId), eq(columns.userId, userId)))
    .orderBy(desc(columns.order))
    .limit(1);

  const newOrder = lastColumn ? lastColumn.order + 1 : 0;

  const [column] = await db
    .insert(columns)
    .values({ ...(id ? { id } : {}), name, userId, boardId, order: newOrder })
    .returning();

  return column;
}

export async function updateColumn(
  userId: string,
  columnId: string,
  data: Partial<Pick<typeof columns.$inferInsert, "name" | "order">>,
) {
  const [column] = await db
    .update(columns)
    .set(data)
    .where(and(eq(columns.id, columnId), eq(columns.userId, userId)))
    .returning();
  return column ?? null;
}

export async function reorderColumn(
  userId: string,
  columnId: string,
  toIndex: number,
) {
  return db.transaction(async tx => {
    const [column] = await tx
      .select()
      .from(columns)
      .where(and(eq(columns.id, columnId), eq(columns.userId, userId)));
    if (!column) return null;

    const boardColumns = await tx
      .select()
      .from(columns)
      .where(and(eq(columns.boardId, column.boardId), eq(columns.userId, userId), ne(columns.id, columnId)))
      .orderBy(asc(columns.order));

    boardColumns.splice(toIndex, 0, column);

    await Promise.all(
      boardColumns.map((col, i) =>
        tx.update(columns).set({ order: i }).where(eq(columns.id, col.id)),
      ),
    );

    return { columnId, toIndex };
  });
}

export async function deleteColumn(userId: string, columnId: string) {
  const [column] = await db
    .delete(columns)
    .where(and(eq(columns.id, columnId), eq(columns.userId, userId)))
    .returning();
  return column ?? null;
}
