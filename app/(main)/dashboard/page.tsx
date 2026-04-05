import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { LayoutGrid, ListTodo, ArrowRight, Plus } from "lucide-react";
import { CreateBoardModal } from "@/features/boards/components/create-board-modal";
import { BoardIcon } from "@/icons/board-icon";

// ─── Placeholder data — replace with real service calls when ready ────────────

const STATS = [
  { label: "Total Boards", value: 4, icon: LayoutGrid },
  { label: "Total Tasks", value: 24, icon: ListTodo },
];

const MY_TASKS_BOARD = { id: "1", name: "My Tasks" };

const RECENT_BOARDS = [
  {
    id: "1",
    name: "Platform Launch",
    columns: 4,
    tasks: 12,
    color: "bg-violet-500",
  },
  {
    id: "2",
    name: "Marketing Plan",
    columns: 3,
    tasks: 8,
    color: "bg-blue-500",
  },
  { id: "3", name: "Roadmap", columns: 5, tasks: 16, color: "bg-emerald-500" },
  {
    id: "4",
    name: "Product Backlog",
    columns: 3,
    tasks: 9,
    color: "bg-orange-500",
  },
  {
    id: "5",
    name: "Design System",
    columns: 2,
    tasks: 5,
    color: "bg-pink-500",
  },
  { id: "6", name: "Engineering", columns: 4, tasks: 11, color: "bg-cyan-500" },
];

// ─────────────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Here&apos;s an overview of your workspace.
        </p>
      </div>

      {/* Stats + My Tasks */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg bg-muted p-5">
            <Icon size={20} className="mb-3 text-primary" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="mt-0.5 text-xs font-bold text-muted-foreground">
              {label}
            </p>
          </div>
        ))}

        {/* My Tasks — always visible CTA */}
        <Link
          href={`/board/${MY_TASKS_BOARD.id}`}
          className="group col-span-2 flex items-center justify-between rounded-lg bg-primary p-5 transition-colors hover:bg-primary/90 lg:col-span-1"
        >
          <div>
            <p className="text-xs font-bold text-primary-foreground/70">
              Quick Access
            </p>
            <p className="mt-1 text-[15px] font-bold text-primary-foreground">
              {MY_TASKS_BOARD.name}
            </p>
          </div>
          <ArrowRight
            size={18}
            className="text-primary-foreground/70 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Recent Boards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-foreground">
            Recent Boards
          </h2>
          <CreateBoardModal>
            <Button size="sm" className="gap-1.5">
              <Plus size={14} />
              New Board
            </Button>
          </CreateBoardModal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECENT_BOARDS.map(({ id, name, columns, tasks, color }) => (
            <Link
              key={id}
              href={`/board/${id}`}
              className="group flex items-center gap-4 rounded-lg bg-muted p-5 transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <div className={`h-10 w-1 shrink-0 rounded-full ${color}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-foreground">
                  {name}
                </p>
                <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                  {columns} columns · {tasks} tasks
                </p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}

          {/* Add new board card */}
          <CreateBoardModal>
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/20 p-5 text-sm font-bold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
              <BoardIcon className="opacity-60" />
              Add New Board
            </button>
          </CreateBoardModal>
        </div>
      </section>
    </div>
  );
}
