import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CreateBoardSchema } from "@/features/boards/schemas/board";
import { getBoardsForUser, createBoard } from "@/services/boards";

// GET /api/boards — returns all boards for the authenticated user, ordered by position
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userBoards = await getBoardsForUser(session.user.id);

    return NextResponse.json({ data: userBoards });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/boards — creates a new board with optional columns
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();

    const parsed = CreateBoardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, columns: boardColumns } = parsed.data;

    const newBoard = await createBoard(userId, name, boardColumns);

    return NextResponse.json({ data: newBoard }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 });
  }
}
