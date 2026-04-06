"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateColumn } from "@/features/boards/hooks/use-create-column";

const ColumnSchema = z.object({
  name: z.string().min(1, "Column name is required").max(100),
});

type TColumnSchema = z.infer<typeof ColumnSchema>;

type Props = {
  boardId: string;
  onSuccess: () => void;
};

export function ColumnForm({ boardId, onSuccess }: Props) {
  const { createColumn, isPending } = useCreateColumn(boardId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TColumnSchema>({
    resolver: zodResolver(ColumnSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (data: TColumnSchema) => {
    createColumn(data.name, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label htmlFor="column-name">Column Name</Label>
        <Input
          {...register("name")}
          id="column-name"
          placeholder="e.g. In Progress"
          error={errors.name?.message}
          disabled={isPending}
        />
      </div>
      <Button disabled={isPending}>
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          "Create Column"
        )}
      </Button>
    </form>
  );
}
