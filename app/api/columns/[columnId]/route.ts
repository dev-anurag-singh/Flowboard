import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateColumn, deleteColumn } from "@/services/columns";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ columnId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { columnId } = await params;
    const { name } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const column = await updateColumn(session.user.id, columnId, { name: name.trim() });

    if (!column) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    return NextResponse.json({ data: column });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ columnId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { columnId } = await params;
    const column = await deleteColumn(session.user.id, columnId);

    if (!column) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    return NextResponse.json({ data: column });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
