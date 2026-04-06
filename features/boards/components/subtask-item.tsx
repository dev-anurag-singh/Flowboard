"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Task } from "@/features/boards/queries";

export function SubtaskItem({ subtask }: { subtask: Task }) {
  const textRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="group flex items-center gap-4 rounded-sm bg-background p-3">
      <Checkbox checked={subtask.completed} />
      <span
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          "flex-1 cursor-text text-sm font-bold focus-visible:outline-none",
          subtask.completed && "text-muted-foreground line-through",
        )}
      >
        {subtask.title}
      </span>
      <button className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive">
        <X size={14} />
      </button>
    </div>
  );
}
