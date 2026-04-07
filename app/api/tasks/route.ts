import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CreateTaskSchema } from "@/features/boards/schemas/task";
import { createTask } from "@/services/tasks";

// POST /api/tasks — creates a new task with optional subtasks
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { id, title, description, columnId, boardId, parentId, subtasks } = parsed.data;

    const task = await createTask(session.user.id, {
      id,
      title,
      description,
      columnId,
      boardId,
      parentId,
      subtasks,
    });

    return NextResponse.json({ data: task }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
