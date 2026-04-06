"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Task } from "@/features/boards/queries";
import { useUpdateSubtask } from "@/features/boards/hooks/use-update-subtask";
import { useDeleteSubtask } from "@/features/boards/hooks/use-delete-subtask";

type Props = {
  subtask: Task;
  boardId: string;
};

export function SubtaskItem({ subtask, boardId }: Props) {
  const textRef = useRef<HTMLSpanElement>(null);
  const { updateSubtask } = useUpdateSubtask(boardId);
  const { deleteSubtask } = useDeleteSubtask(boardId);

  const handleTitleBlur = () => {
    const newTitle = textRef.current?.textContent?.trim() ?? "";
    if (newTitle && newTitle !== subtask.title) {
      updateSubtask({ subtaskId: subtask.id, data: { title: newTitle } });
    } else if (textRef.current) {
      // revert if empty
      textRef.current.textContent = subtask.title;
    }
  };

  return (
    <div className="group flex items-center gap-4 rounded-sm bg-background p-3">
      <Checkbox
        checked={subtask.completed}
        onCheckedChange={(checked) =>
          updateSubtask({ subtaskId: subtask.id, data: { completed: !!checked } })
        }
      />
      <span
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTitleBlur}
        className={cn(
          "flex-1 cursor-text text-sm font-bold focus-visible:outline-none",
          subtask.completed && "text-muted-foreground line-through",
        )}
      >
        {subtask.title}
      </span>
      <button
        onClick={() => deleteSubtask(subtask.id)}
        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
      >
        <X size={14} />
      </button>
    </div>
  );
}
