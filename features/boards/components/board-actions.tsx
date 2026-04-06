"use client";

import { useState } from "react";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DeleteBoardModal } from "@/features/boards/components/delete-board-modal";
import { useQuery } from "@tanstack/react-query";
import { boardsQueryOptions } from "@/features/boards/queries";

type Props = {
  boardId: string;
};

export function BoardActions({ boardId }: Props) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: boards = [] } = useQuery(boardsQueryOptions);
  const board = boards.find(b => b.id === boardId);

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button size="icon-lg" variant="ghost">
            <EllipsisVertical className="size-6!" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={12}
          align="end"
          className="w-40 p-3 dark:bg-background"
        >
          <Button
            variant="link"
            size="xs"
            className="w-full justify-start p-0 text-destructive"
            onClick={() => {
              setPopoverOpen(false);
              setDeleteOpen(true);
            }}
          >
            <Trash2 />
            Delete Board
          </Button>
        </PopoverContent>
      </Popover>

      {board && (
        <DeleteBoardModal
          boardId={boardId}
          boardName={board.name}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
    </>
  );
}
