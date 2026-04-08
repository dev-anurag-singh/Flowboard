"use client";

import { useRef, useState, useEffect } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BoardWithData } from "@/features/boards/queries";
import { SubtaskItem } from "./subtask-item";
import { useUpdateTask } from "@/features/boards/hooks/use-update-task";
import { useCreateTask } from "@/features/boards/hooks/use-create-task";
import { useDeleteTask } from "@/features/boards/hooks/use-delete-task";

type Props = {
  board: BoardWithData;
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function NewSubtaskInput({
  onSave,
  onCancel,
}: {
  onSave: (title: string) => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    const value = inputRef.current?.value.trim() ?? "";
    if (!value) return;
    onSave(value);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const handleBlur = () => {
    const value = inputRef.current?.value.trim() ?? "";
    if (value) onSave(value);
    onCancel();
  };

  return (
    <div className="flex items-center gap-4 rounded-sm bg-background p-3">
      <input
        ref={inputRef}
        onBlur={handleBlur}
        onKeyDown={e => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Subtask title"
        className="flex-1 text-base font-medium bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
      />
      <button
        onMouseDown={e => e.preventDefault()}
        onClick={handleSave}
        className="shrink-0 cursor-pointer text-muted-foreground hover:text-primary"
      >
        <Check size={16} />
      </button>
    </div>
  );
}

export function TaskDetail({ board, taskId, open, onOpenChange }: Props) {
  const { updateTask } = useUpdateTask(board.id);
  const { createTask } = useCreateTask(board.id);
  const { deleteTask } = useDeleteTask(board.id);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const task = board.tasks.find(t => t.id === taskId);

  const completedCount = task?.subtasks.filter(s => s.completed).length ?? 0;

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleTitleBlur = () => {
    if (!task) return;
    const newTitle = titleRef.current?.textContent?.trim() ?? "";
    if (newTitle && newTitle !== task.title) {
      updateTask({ taskId: task.id, data: { title: newTitle } });
    } else if (titleRef.current) {
      titleRef.current.textContent = task.title;
    }
  };

  const handleDescriptionBlur = () => {
    if (!task) return;
    const newDescription = descriptionRef.current?.textContent?.trim() ?? "";
    if (newDescription !== (task.description ?? "")) {
      updateTask({ taskId: task.id, data: { description: newDescription } });
    }
  };

  return (
    <Dialog open={open && !!task} onOpenChange={onOpenChange}>
      <DialogContent
        className="md:pt-7 focus:outline-none focus-visible:outline-none"
        onOpenAutoFocus={event => event.preventDefault()}
      >
        {task && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-2">
                <DialogTitle
                  ref={titleRef}
                  className="flex-1 cursor-text rounded px-1 py-1 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleTitleBlur}
                >
                  {task.title}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    onOpenChange(false);
                    deleteTask(task.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div
              ref={descriptionRef}
              data-placeholder="Add a description..."
              className="cursor-text rounded px-2 py-2 text-base font-medium text-foreground/70 bg-background hover:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-20"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleDescriptionBlur}
            >
              {task.description || null}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm">Current Status</h4>
              <Select
                defaultValue={task.columnId ?? undefined}
                onValueChange={columnId =>
                  updateTask({ taskId: task.id, data: { columnId } })
                }
              >
                <SelectTrigger id="select-column">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {board.columns.map(col => (
                    <SelectItem
                      key={col.id}
                      value={col.id}
                      className="capitalize"
                    >
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm">
                Subtasks ({completedCount} of {task.subtasks.length})
              </h4>
              <div className="space-y-2">
                {task.subtasks.map(subtask => (
                  <SubtaskItem
                    key={subtask.id}
                    subtask={subtask}
                    boardId={board.id}
                  />
                ))}
                {isAddingSubtask && (
                  <NewSubtaskInput
                    onSave={title => createTask({ title, parentId: task.id })}
                    onCancel={() => setIsAddingSubtask(false)}
                  />
                )}
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsAddingSubtask(true)}
                disabled={isAddingSubtask}
              >
                + Add New Subtask
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
