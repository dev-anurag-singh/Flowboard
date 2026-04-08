"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LayoutGrid, ListTodo, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateBoardModal } from "@/features/boards/components/create-board";
import { BoardIcon } from "@/icons/board-icon";
import { dashboardQueryOptions } from "@/features/boards/queries";

function boardColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
}

export function DashboardView({ firstName }: { firstName?: string }) {
  const { data: boardsData } = useSuspenseQuery(dashboardQueryOptions);

  const defaultBoard = boardsData.find(b => b.isDefault);
  const totalTasks = boardsData.reduce((sum, b) => sum + b.taskCount, 0);

  const STATS = [
    { label: "Total Boards", value: boardsData.length, icon: LayoutGrid },
    { label: "Total Tasks", value: totalTasks, icon: ListTodo },
  ];

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

      {/* Stats + Quick Access */}
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

        {defaultBoard ? (
          <Link
            href={`/board/${defaultBoard.id}`}
            className="group col-span-2 flex items-center justify-between rounded-lg bg-primary p-5 transition-colors hover:bg-primary/90 lg:col-span-1"
          >
            <div>
              <p className="text-xs font-bold text-primary-foreground/70">
                Quick Access
              </p>
              <p className="mt-1 text-[15px] font-bold text-primary-foreground">
                {defaultBoard.name}
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-primary-foreground/70 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ) : (
          <div className="col-span-2 rounded-lg bg-muted p-5 lg:col-span-1" />
        )}
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
          {boardsData.map(({ id, name, columnCount, taskCount }) => (
            <Link
              key={id}
              href={`/board/${id}`}
              className="group flex items-center gap-4 rounded-lg bg-muted p-5 transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <div
                className="h-10 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: boardColor(id) }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-foreground group-hover:text-muted-foreground">
                  {name}
                </p>
                <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                  {columnCount} columns · {taskCount} tasks
                </p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}

          <CreateBoardModal>
            <button className="flex min-h-20 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/20 p-5 text-sm font-bold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
              <BoardIcon className="opacity-60" />
              Add New Board
            </button>
          </CreateBoardModal>
        </div>
      </section>
    </div>
  );
}
