"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import type { TaskWithSubtasks } from "@/features/boards/queries";
import { SubtaskItem } from "./subtask-item";

type Props = {
  task: TaskWithSubtasks;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TaskDetail({ task, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle>{task.title}</DialogTitle>
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full p-2 hover:bg-background">
                  <MoreVertical />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 dark:bg-background">
                <Button variant="link" className="text-muted-foreground">
                  Edit Task
                </Button>
                <Button variant="link" className="text-destructive">
                  Delete Task
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-[12px] font-bold">
              Subtasks ({task.subtasks.length})
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
