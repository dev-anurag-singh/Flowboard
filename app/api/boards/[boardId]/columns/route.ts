import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getBoardById } from "@/services/boards";
import { createColumn } from "@/services/columns";

const CreateColumnSchema = z.object({
  name: z.string().min(1, "Column name is required").max(100),
  id: z.uuid().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ boardId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { boardId } = await params;
    const board = await getBoardById(session.user.id, boardId);
    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = CreateColumnSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const column = await createColumn(session.user.id, boardId, result.data.name, result.data.id);
    return NextResponse.json({ data: column }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
