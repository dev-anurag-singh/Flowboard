"use client";

import { z } from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { boardByIdQueryOptions } from "@/features/boards/queries";
import { useCreateTask } from "@/features/boards/hooks/use-create-task";

const CreateTaskFormSchema = z.object({
  title: z.string().min(1, "Task title is required").max(255),
  description: z.string().max(2000).optional(),
  columnId: z.uuid("Select a column"),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1, "Subtask title is required").max(255),
      }),
    )
    .optional(),
});

type CreateTaskFormData = z.infer<typeof CreateTaskFormSchema>;

type Props = {
  boardId: string;
  columnId: string;
  onSuccess: () => void;
};

export function TaskForm({ boardId, columnId, onSuccess }: Props) {
  const { data: board } = useQuery(boardByIdQueryOptions(boardId));
  const { createTask } = useCreateTask(boardId);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(CreateTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      columnId,
      subtasks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "subtasks" });

  const onSubmit = (data: CreateTaskFormData) => {
    onSuccess();
    createTask(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          {...register("title")}
          id="task-title"
          placeholder="e.g. Take coffee break"
          error={errors.title?.message}
          disabled={false}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          {...register("description")}
          id="task-description"
          placeholder="e.g. It's always good to take a break"
          className="resize-none"
          disabled={false}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Subtasks</Label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_auto] items-center gap-2">
              <Input
                {...register(`subtasks.${index}.title`)}
                placeholder="e.g. Make coffee"
                error={errors.subtasks?.[index]?.title?.message}
                disabled={false}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={false}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ title: "" })}
            disabled={false}
          >
            + Add New Subtask
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-column">Column</Label>
        <Controller
          control={control}
          name="columnId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={false}
            >
              <SelectTrigger id="task-column">
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {board?.columns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.columnId && (
          <p className="text-xs text-destructive">{errors.columnId.message}</p>
        )}
      </div>

      <Button>Create Task</Button>
    </form>
  );
}
