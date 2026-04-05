"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CreateBoardSchema,
  type TCreateBoardSchema,
} from "@/features/boards/schemas/board";
import { useCreateBoard } from "@/features/boards/hooks/use-create-board";

type Props = {
  onSuccess: () => void;
};

export function CreateBoardForm({ onSuccess }: Props) {
  const { createBoard, isPending } = useCreateBoard();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateBoardSchema>({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: { name: "", columns: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit = (data: TCreateBoardSchema) => {
    createBoard(data, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label htmlFor="board-name">Board Name</Label>
        <Input
          {...register("name")}
          id="board-name"
          placeholder="e.g. Web Design"
          error={errors.name?.message}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label>Columns</Label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_auto] items-start gap-2"
            >
              <Input
                {...register(`columns.${index}.name`)}
                placeholder="e.g. Todo"
                error={errors.columns?.[index]?.name?.message}
                disabled={isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={() => remove(index)}
                className="mt-1"
              >
                <X className="size-5!" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => append({ name: "" })}
          >
            + Add New Column
          </Button>
        </div>
      </div>

      <Button disabled={isPending}>
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          "Create New Board"
        )}
      </Button>
    </form>
  );
}
