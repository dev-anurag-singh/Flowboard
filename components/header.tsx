"use client";

import { useParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PanelLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { boardsQueryOptions } from "@/features/boards/queries";
import { useSidebarStore } from "@/store/sidebar";

export function Header() {
  const { boardId } = useParams<{ boardId?: string }>();
  const { openSheet } = useSidebarStore();
  const { data: boards = [] } = useQuery(boardsQueryOptions);

  const pathname = usePathname();
  const currentBoard = boardId ? boards.find(b => b.id === boardId) : null;
  const title =
    currentBoard?.name ?? (pathname === "/dashboard" ? "Dashboard" : null);

  return (
    <header className="flex shrink-0 items-center justify-between border-b bg-muted px-4 py-4 md:px-6 lg:py-5">
      {/* Left */}
      <div className="flex items-center">
        {title && (
          <>
            {/* Mobile: sidebar trigger + title */}
            <button
              onClick={openSheet}
              className="mr-3 cursor-pointer text-muted-foreground transition-colors hover:text-foreground md:hidden"
              aria-label="Open sidebar"
            >
              <PanelLeft size={24} />
            </button>
            <h1 className="max-w-[180px] capitalize overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold text-foreground md:max-w-48 lg:max-w-xs lg:text-lg">
              {title}
            </h1>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button size="sm" className="gap-1.5 md:h-10 md:px-5">
          <Plus size={15} strokeWidth={3} />
          <span className="hidden text-sm font-bold md:inline">
            Add New Task
          </span>
        </Button>
        {/* <BoardActions board={currentBoard} /> */}
      </div>
    </header>
  );
}
