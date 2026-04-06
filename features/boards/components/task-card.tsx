"use client";

import { useState } from "react";
import type { TaskWithSubtasks } from "@/features/boards/queries";
import { TaskDetail } from "./task-detail";

export function TaskCard({ task }: { task: TaskWithSubtasks }) {
  const [open, setOpen] = useState(false);
  const completedCount = task.subtasks.filter((s) => s.completed).length;
  const subtasksCount = task.subtasks.length;

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group cursor-pointer space-y-2 rounded-lg bg-muted px-4 py-6 shadow-sm"
      >
        <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary">
          {task.title}
        </h4>
        {subtasksCount > 0 && (
          <p className="text-xs font-bold text-muted-foreground">
            {completedCount} of {subtasksCount} subtasks
          </p>
        )}
      </div>
      <TaskDetail task={task} open={open} onOpenChange={setOpen} />
    </>
  );
}
