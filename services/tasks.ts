import { and, asc, desc, eq, isNull, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";

export async function createTask(
  userId: string,
  data: {
    id?: string;
    title: string;
    description?: string;
    columnId?: string;
    boardId: string;
    parentId?: string;
    subtasks?: { id?: string; title: string }[];
  },
) {
  let newOrder = 0;

  if (data.parentId) {
    const [last] = await db
      .select({ order: tasks.order })
      .from(tasks)
      .where(and(eq(tasks.parentId, data.parentId), eq(tasks.userId, userId)))
      .orderBy(desc(tasks.order))
      .limit(1);
    newOrder = last ? last.order + 1 : 0;
  } else if (data.columnId) {
    const [last] = await db
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
    newOrder = last ? last.order + 1 : 0;
  }

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
          ...(s.id ? { id: s.id } : {}),
          title: s.title,
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
  data: Partial<
    Pick<
      typeof tasks.$inferInsert,
      "title" | "description" | "columnId" | "completed" | "order"
    >
  >,
) {
  const [task] = await db
    .update(tasks)
    .set(data)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning();
  return task ?? null;
}

export async function reorderTask(
  userId: string,
  taskId: string,
  data: { toIndex: number; columnId: string },
) {
  return db.transaction(async (tx) => {
    const [task] = await tx
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
    if (!task) return null;

    const fromColumnId = task.columnId;
    const isSameColumn = fromColumnId === data.columnId;

    if (isSameColumn) {
      const columnTasks = await tx
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.columnId, data.columnId),
            eq(tasks.userId, userId),
            isNull(tasks.parentId),
            ne(tasks.id, taskId),
          ),
        )
        .orderBy(asc(tasks.order));

      columnTasks.splice(data.toIndex, 0, task);

      await Promise.all(
        columnTasks.map((t, i) =>
          tx.update(tasks).set({ order: i + 1 }).where(eq(tasks.id, t.id)),
        ),
      );
    } else {
      const [oldColumnTasks, newColumnTasks] = await Promise.all([
        tx
          .select()
          .from(tasks)
          .where(
            and(
              eq(tasks.columnId, fromColumnId!),
              eq(tasks.userId, userId),
              isNull(tasks.parentId),
              ne(tasks.id, taskId),
            ),
          )
          .orderBy(asc(tasks.order)),
        tx
          .select()
          .from(tasks)
          .where(
            and(
              eq(tasks.columnId, data.columnId),
              eq(tasks.userId, userId),
              isNull(tasks.parentId),
            ),
          )
          .orderBy(asc(tasks.order)),
      ]);

      newColumnTasks.splice(data.toIndex, 0, { ...task, columnId: data.columnId });

      await Promise.all([
        ...oldColumnTasks.map((t, i) =>
          tx.update(tasks).set({ order: i + 1 }).where(eq(tasks.id, t.id)),
        ),
        ...newColumnTasks.map((t, i) =>
          tx
            .update(tasks)
            .set({ order: i + 1, columnId: data.columnId })
            .where(eq(tasks.id, t.id)),
        ),
      ]);
    }

    return { taskId, columnId: data.columnId, toIndex: data.toIndex };
  });
}

export async function deleteTask(userId: string, taskId: string) {
  const [task] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning();
  return task ?? null;
}
