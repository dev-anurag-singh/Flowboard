import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { reorderColumn } from "@/services/columns";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ columnId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { columnId } = await params;
    const { toIndex } = await req.json();

    if (typeof toIndex !== "number") {
      return NextResponse.json({ error: "toIndex is required" }, { status: 400 });
    }

    const result = await reorderColumn(session.user.id, columnId, toIndex);

    if (!result) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
