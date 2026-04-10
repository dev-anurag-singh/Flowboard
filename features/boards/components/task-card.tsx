"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskWithSubtasks } from "@/features/boards/queries";

type Props = {
  task: TaskWithSubtasks;
  onSelect: () => void;
};

export function TaskCard({ task, onSelect }: Props) {
  const completedCount = task.subtasks.filter((s) => s.completed).length;
  const subtasksCount = task.subtasks.length;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-5 min-h-[76px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      suppressHydrationWarning
      className="group cursor-grab space-y-2 rounded-lg bg-muted px-4 py-5 shadow-sm active:cursor-grabbing select-none touch-none"
    >
      <h4 className="line-clamp-2 text-[15px] font-bold text-foreground group-hover:text-primary">
        {task.title}
      </h4>
      {subtasksCount > 0 ? (
        <p className="text-xs font-bold text-muted-foreground">
          {completedCount} of {subtasksCount} subtasks
        </p>
      ) : !task.description ? (
        <p className="text-xs font-medium text-muted-foreground/50">
          No description
        </p>
      ) : (
        <p className="line-clamp-2 text-xs font-medium text-muted-foreground">
          {task.description}
        </p>
      )}
    </div>
  );
}
