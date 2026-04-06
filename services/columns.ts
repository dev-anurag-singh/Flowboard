import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { columns } from "@/lib/db/schema";

export async function createColumn(
  userId: string,
  boardId: string,
  name: string,
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
    .values({ name, userId, boardId, order: newOrder })
    .returning();

  return column;
}
