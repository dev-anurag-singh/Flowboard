import "server-only";
import { and, asc, desc, eq, isNull, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import type { CreateTaskItem } from "@/schemas/task";

export async function createTasks(userId: string, items: CreateTaskItem[]) {
  return db.transaction(async (tx) => {
    const parents = items.filter((i) => !i.parentId);
    const subtasks = items.filter((i) => i.parentId);
    const newParentIds = new Set(parents.map((p) => p.id));

    const values: (typeof tasks.$inferInsert)[] = [];

    for (const parent of parents) {
      let order = 0;
      if (parent.columnId) {
        const [last] = await tx
          .select({ order: tasks.order })
          .from(tasks)
          .where(
            and(
              eq(tasks.columnId, parent.columnId),
              eq(tasks.userId, userId),
              isNull(tasks.parentId),
            ),
          )
          .orderBy(desc(tasks.order))
          .limit(1);
        order = last ? last.order + 1 : 0;
      }
      values.push({
        id: parent.id,
        title: parent.title,
        description: parent.description,
        columnId: parent.columnId,
        boardId: parent.boardId,
        userId,
        order,
      });
    }

    const subtasksByParent = new Map<string, typeof items>();
    for (const sub of subtasks) {
      const group = subtasksByParent.get(sub.parentId!) ?? [];
      group.push(sub);
      subtasksByParent.set(sub.parentId!, group);
    }

    for (const [parentId, subs] of subtasksByParent) {
      let startOrder = 0;
      if (!newParentIds.has(parentId)) {
        const [last] = await tx
          .select({ order: tasks.order })
          .from(tasks)
          .where(and(eq(tasks.parentId, parentId), eq(tasks.userId, userId)))
          .orderBy(desc(tasks.order))
          .limit(1);
        startOrder = last ? last.order + 1 : 0;
      }
      for (let i = 0; i < subs.length; i++) {
        values.push({
          id: subs[i].id,
          title: subs[i].title,
          boardId: subs[i].boardId,
          parentId,
          userId,
          order: startOrder + i,
        });
      }
    }

    if (values.length > 0) {
      await tx.insert(tasks).values(values);
    }

    return values;
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
