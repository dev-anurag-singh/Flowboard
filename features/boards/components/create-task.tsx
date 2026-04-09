"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-form";

type Props = {
  boardId: string;
  columnId: string;
};

export function CreateTaskModal({ boardId, columnId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-10 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/20 bg-background text-xs font-bold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
          <Plus size={14} />
          Add New Task
        </button>
      </DialogTrigger>
      <DialogContent className="p-0 md:p-0">
        <div className="space-y-6 px-6 py-6 md:px-8 md:py-8">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            boardId={boardId}
            columnId={columnId}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
