"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { ColumnWithTasks } from "@/features/boards/queries";
import { TaskCard } from "./task-card";
import { ColumnActions } from "./column-actions";

function columnColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
}

export function Column({ column }: { column: ColumnWithTasks }) {
  return (
    <div className="relative flex max-h-full w-72 shrink-0 flex-col overflow-hidden rounded-sm border border-transparent bg-background px-2 [&:has(.column-handle:hover)]:border-border">
      <div className="flex items-center justify-between">
        <div className="column-handle flex w-56 cursor-default items-center gap-2 overflow-hidden py-3">
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: columnColor(column.id) }}
          />
          <span className="truncate text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {column.name} ({column.tasks.length})
          </span>
        </div>
        <ColumnActions
          column={{ id: column.id, boardId: column.boardId, name: column.name }}
        />
      </div>
      <ScrollArea className="h-full">
        <div className="space-y-4 pb-3">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
