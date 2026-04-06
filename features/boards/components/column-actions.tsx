"use client";

import { useState } from "react";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditColumnModal } from "./edit-column-modal";
import { DeleteColumnModal } from "./delete-column-modal";

type Props = {
  column: { id: string; boardId: string; name: string };
};

export function ColumnActions({ column }: Props) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 w-8 shrink-0 p-0">
            <Ellipsis size={16} />
            <span className="sr-only">Column actions</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={8}
          align="end"
          className="w-40 p-3 dark:bg-background"
        >
          <Button
            variant="link"
            size="xs"
            className="w-full justify-start p-0 text-muted-foreground"
            onClick={() => {
              setPopoverOpen(false);
              setEditOpen(true);
            }}
          >
            <Pencil />
            Edit Column
          </Button>
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
            Delete Column
          </Button>
        </PopoverContent>
      </Popover>

      <EditColumnModal
        column={column}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteColumnModal
        columnId={column.id}
        boardId={column.boardId}
        columnName={column.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
