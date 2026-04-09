"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  Column as ColumnType,
  TaskWithSubtasks,
} from "@/features/boards/queries";
import { TaskCard } from "./task-card";
import { ColumnActions } from "./column-actions";
import { CreateTaskModal } from "./create-task";
import { ScrollArea } from "@/components/ui/scroll-area";

export function columnColor(id: string) {
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex max-h-full w-72 shrink-0 flex-col rounded-sm bg-background"
    >
      <div className="flex min-h-0 flex-col rounded-sm border border-transparent pl-2.5 [&:has([data-slot=column-header]:hover)]:border-border">
        <div
          data-slot="column-header"
          className="flex items-center justify-between"
        >
          <div
            {...attributes}
            {...listeners}
            suppressHydrationWarning
            className="flex w-56 cursor-grab items-center gap-2 overflow-hidden py-3 active:cursor-grabbing"
          >
            <span
              className="h-4 w-4 shrink-0 rounded-full"
              style={{ backgroundColor: columnColor(column.id) }}
            />
            <span className="truncate text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {column.name} ({tasks.length})
            </span>
          </div>
          <ColumnActions
            column={{
              id: column.id,
              boardId: column.boardId,
              name: column.name,
            }}
          />
        </div>

        {!isDragging && (
          <>
            <ScrollArea className="min-h-0 flex-1 space-y-4 pb-3 pr-2.5">
              <div className="space-y-4">
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={() => onSelectTask(task.id)}
                  />
                ))}
              </div>
            </ScrollArea>
            <div className="pr-2.5 pb-3">
              <CreateTaskModal boardId={column.boardId} columnId={column.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ColumnDragOverlay({
  column,
  tasks,
}: {
  column: ColumnType;
  tasks: TaskWithSubtasks[];
}) {
  return (
    <div className="flex max-h-full w-72 shrink-0 flex-col overflow-hidden rounded-sm border border-border bg-background px-2 opacity-80 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex w-56 items-center gap-2 overflow-hidden py-3">
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: columnColor(column.id) }}
          />
          <span className="truncate text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {column.name} ({tasks.length})
          </span>
        </div>
      </div>
      <div className="space-y-4 pb-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onSelect={() => {}} />
        ))}
      </div>
    </div>
  );
}
