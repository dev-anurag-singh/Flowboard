"use client";

import type { Column as ColumnType, TaskWithSubtasks } from "@/features/boards/queries";
import { TaskCard } from "./task-card";
import { ColumnActions } from "./column-actions";
import { CreateTaskModal } from "./create-task";

function columnColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
}

type ColumnProps = {
  column: ColumnType;
  tasks: TaskWithSubtasks[];
  onSelectTask: (taskId: string) => void;
};

export function Column({ column, tasks, onSelectTask }: ColumnProps) {
  return (
    <div className="relative flex max-h-full w-72 shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-sm border border-transparent bg-background px-2 [&:has(.column-handle:hover)]:border-border">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background">
        <div className="column-handle flex w-56 cursor-default items-center gap-2 overflow-hidden py-3">
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: columnColor(column.id) }}
          />
          <span className="truncate text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {column.name} ({tasks.length})
          </span>
        </div>
        <ColumnActions
          column={{ id: column.id, boardId: column.boardId, name: column.name }}
        />
      </div>

      <div className="space-y-4 pb-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={() => onSelectTask(task.id)}
          />
        ))}
      </div>

      <CreateTaskModal boardId={column.boardId} columnId={column.id} />
    </div>
  );
}
