"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Task } from "@/features/boards/queries";

export function SubtaskItem({ subtask }: { subtask: Task }) {
  return (
    <div className="flex items-center gap-4 rounded-sm bg-background p-3">
      <Checkbox checked={subtask.completed} />
      <span
        className={cn("text-[12px] font-bold", {
          "text-muted-foreground line-through": subtask.completed,
        })}
      >
        {subtask.title}
      </span>
    </div>
  );
}
