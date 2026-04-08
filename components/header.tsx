"use client";

import { useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PanelLeft } from "lucide-react";
import { boardsQueryOptions } from "@/features/boards/queries";
import { useSidebarStore } from "@/store/sidebar";
import { useRenameBoard } from "@/features/boards/hooks/use-rename-board";
import { BoardActions } from "@/features/boards/components/board-actions";

export function Header() {
  const { boardId } = useParams<{ boardId?: string }>();
  const { openSheet } = useSidebarStore();
  const { data: boards = [] } = useQuery(boardsQueryOptions);
  const { renameBoard } = useRenameBoard();

  const pathname = usePathname();
  const currentBoard = boardId ? boards.find(b => b.id === boardId) : null;
  const title =
    currentBoard?.name ?? (pathname === "/dashboard" ? "Dashboard" : null);

  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (currentBoard) setEditValue(currentBoard.name);
  };

  const handleBlur = () => {
    const trimmed = editValue.trim();
    if (!currentBoard || !boardId) return;
    if (trimmed.length === 0 || trimmed === currentBoard.name) {
      setEditValue(currentBoard.name);
      return;
    }
    renameBoard({ boardId, name: trimmed });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") inputRef.current?.blur();
    if (e.key === "Escape") {
      if (currentBoard) setEditValue(currentBoard.name);
      inputRef.current?.blur();
    }
  };

  const isEditable = !!currentBoard;

  return (
    <header className="flex shrink-0 items-center justify-between border-b bg-muted pl-4 pr-2 py-4 md:pl-6 md:pr-4 lg:py-5">
      {/* Left */}
      <div className="flex items-center">
        {title && (
          <>
            <button
              onClick={openSheet}
              className="mr-1.5 cursor-pointer text-primary transition-colors hover:text-primary/80 md:hidden"
              aria-label="Open sidebar"
            >
              <PanelLeft strokeWidth={2.5} size={24} />
            </button>
            {isEditable ? (
              <input
                ref={inputRef}
                value={editValue || currentBoard.name}
                onChange={e => setEditValue(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="max-w-[180px] truncate rounded-md border border-transparent bg-transparent px-1.5 py-0.5 text-[15px] font-bold text-foreground capitalize outline-none hover:border-border focus:border-primary md:max-w-48 lg:max-w-xs lg:text-lg"
              />
            ) : (
              <h1 className="max-w-[180px] px-1.5 truncate text-[15px] font-bold text-foreground md:max-w-48 lg:max-w-xs lg:text-lg">
                {title}
              </h1>
            )}
          </>
        )}
      </div>

      {boardId && <BoardActions boardId={boardId} />}
    </header>
  );
}
