"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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

type Props = {
  task: TaskWithSubtasks;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TaskDetail({ task, open, onOpenChange }: Props) {
  const { boardId } = useParams<{ boardId: string }>();
  const { data: board } = useQuery(boardByIdQueryOptions(boardId));
  const completedCount = task.subtasks.filter(s => s.completed).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            className="cursor-text rounded px-1 py-2 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            contentEditable
            suppressContentEditableWarning
          >
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div
          className="cursor-text rounded px-2 py-2 text-sm font-medium text-muted-foreground bg-background hover:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-20"
          contentEditable
          suppressContentEditableWarning
        >
          {task.description ?? (
            <span className="italic text-muted-foreground/50">
              Add a description...
            </span>
          )}
        </div>

        {board && (
          <div className="space-y-2">
            <h4 className="text-sm">Current Status</h4>
            <Select defaultValue={task.columnId}>
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

        <div className="space-y-4">
          <div>
            <h4 className="text-sm">
              Subtasks ({completedCount} of {task.subtasks.length})
            </h4>
          </div>
          <div className="space-y-2">
            {task.subtasks.map(subtask => (
              <SubtaskItem key={subtask.id} subtask={subtask} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
