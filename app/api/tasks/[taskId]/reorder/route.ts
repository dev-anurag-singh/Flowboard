import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { reorderTask } from "@/services/tasks";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    const { toIndex, columnId } = await req.json();

    if (typeof toIndex !== "number" || !columnId) {
      return NextResponse.json({ error: "toIndex and columnId are required" }, { status: 400 });
    }

    const result = await reorderTask(session.user.id, taskId, { toIndex, columnId });

    if (!result) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
