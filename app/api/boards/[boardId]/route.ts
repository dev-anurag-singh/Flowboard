import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBoardById } from "@/services/boards";

export async function GET(
  _req: Request,
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

    return NextResponse.json({ data: board });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
