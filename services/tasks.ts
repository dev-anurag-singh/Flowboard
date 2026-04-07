import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";

export async function createTask(
  userId: string,
  data: {
    id?: string;
    title: string;
    description?: string;
    columnId: string;
    boardId: string;
    parentId?: string;
    subtasks?: { title: string }[];
  },
) {
  const [lastTask] = await db
    .select({ order: tasks.order })
    .from(tasks)
    .where(
      and(
        eq(tasks.columnId, data.columnId),
        eq(tasks.userId, userId),
        isNull(tasks.parentId),
      ),
    )
    .orderBy(desc(tasks.order))
    .limit(1);

  const newOrder = lastTask ? lastTask.order + 1 : 0;

  return db.transaction(async (tx) => {
    const [task] = await tx
      .insert(tasks)
      .values({
        ...(data.id ? { id: data.id } : {}),
        title: data.title,
        description: data.description,
        columnId: data.columnId,
        boardId: data.boardId,
        parentId: data.parentId,
        userId,
        order: newOrder,
      })
      .returning();

    if (data.subtasks && data.subtasks.length > 0) {
      await tx.insert(tasks).values(
        data.subtasks.map((s, idx) => ({
          title: s.title,
          columnId: data.columnId,
          boardId: data.boardId,
          userId,
          parentId: task.id,
          order: idx,
        })),
      );
    }

    return task;
  });
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: Partial<Pick<typeof tasks.$inferInsert, "title" | "description" | "columnId" | "completed" | "order">>,
) {
  const [task] = await db
    .update(tasks)
    .set(data)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning();
  return task ?? null;
}

export async function deleteTask(userId: string, taskId: string) {
  const [task] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning();
  return task ?? null;
}
