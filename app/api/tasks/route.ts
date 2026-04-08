import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { CreateTaskSchema } from "@/schemas/task";
import { createTasks } from "@/services/tasks";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = z.array(CreateTaskSchema).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const tasks = await createTasks(session.user.id, parsed.data);

    return NextResponse.json({ data: tasks }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create tasks" },
      { status: 500 },
    );
  }
}
