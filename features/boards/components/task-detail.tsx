"use client";

import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import {
  boardByIdQueryOptions,
  type TaskWithSubtasks,
} from "@/features/boards/queries";
import { SubtaskItem } from "./subtask-item";
import { useUpdateTask } from "@/features/boards/hooks/use-update-task";
import { useCreateSubtask } from "@/features/boards/hooks/use-create-subtask";

type Props = {
  task: TaskWithSubtasks;
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

  const handleBlur = () => {
    const value = inputRef.current?.value.trim() ?? "";
    if (value) {
      onSave(value);
    } else {
      onCancel();
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-sm bg-background p-3">
      <input
        ref={inputRef}
        onBlur={handleBlur}
        onKeyDown={e => {
          if (e.key === "Enter") inputRef.current?.blur();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Subtask title"
        className="flex-1 text-sm font-bold bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

export function TaskDetail({ task, open, onOpenChange }: Props) {
  const { boardId } = useParams<{ boardId: string }>();
  const { data: board } = useQuery(boardByIdQueryOptions(boardId));
  const { updateTask } = useUpdateTask(boardId);
  const { createSubtask } = useCreateSubtask(boardId);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const completedCount = task.subtasks.filter(s => s.completed).length;

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleTitleBlur = () => {
    const newTitle = titleRef.current?.textContent?.trim() ?? "";
    if (newTitle && newTitle !== task.title) {
      updateTask({ taskId: task.id, data: { title: newTitle } });
    } else if (titleRef.current) {
      titleRef.current.textContent = task.title;
    }
  };

  const handleDescriptionBlur = () => {
    const newDescription = descriptionRef.current?.textContent?.trim() ?? "";
    if (newDescription !== (task.description ?? "")) {
      updateTask({ taskId: task.id, data: { description: newDescription } });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:pt-7">
        <DialogHeader>
          <DialogTitle
            ref={titleRef}
            className="cursor-text rounded px-1 py-1 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleBlur}
          >
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div
          ref={descriptionRef}
          className="cursor-text rounded px-2 py-2 text-sm font-medium text-muted-foreground bg-background hover:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-20"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleDescriptionBlur}
        >
          {task.description || (
            <span className="italic text-muted-foreground/50">
              Add a description...
            </span>
          )}
        </div>

        {board && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm">Current Status</h4>
            <Select
              defaultValue={task.columnId}
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
        )}

        <div className="space-y-3">
          <h4 className="text-sm">
            Subtasks ({completedCount} of {task.subtasks.length})
          </h4>
          <div className="space-y-2">
            {task.subtasks.map(subtask => (
              <SubtaskItem
                key={subtask.id}
                subtask={subtask}
                boardId={boardId}
              />
            ))}
            {isAddingSubtask && (
              <NewSubtaskInput
                onSave={title => {
                  createSubtask({
                    title,
                    taskId: task.id,
                    columnId: task.columnId,
                  });
                  setIsAddingSubtask(false);
                }}
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
      </DialogContent>
    </Dialog>
  );
}
