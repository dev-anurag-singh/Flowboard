import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDashboardData } from "@/services/boards";

// GET /api/dashboard — returns boards with column/task counts for the dashboard
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getDashboardData(session.user.id);

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
