import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { createColumn } from "@/services/columns";

const CreateColumnSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1, "Column name is required").max(100),
  boardId: z.uuid("Invalid board"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateColumnSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { id, name, boardId } = parsed.data;
    const column = await createColumn(session.user.id, boardId, name, id);

    return NextResponse.json({ data: column }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create column" },
      { status: 500 },
    );
  }
}
