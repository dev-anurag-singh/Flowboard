"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateColumn } from "@/features/boards/hooks/use-create-column";
import { useRenameColumn } from "@/features/boards/hooks/use-rename-column";

const ColumnSchema = z.object({
  name: z.string().min(1, "Column name is required").max(100),
});

type TColumnSchema = z.infer<typeof ColumnSchema>;

type CreateProps = {
  boardId: string;
  onSuccess: () => void;
};

type EditProps = {
  column: { id: string; boardId: string; name: string };
  onSuccess: () => void;
};

type Props = CreateProps | EditProps;

function isEditProps(props: Props): props is EditProps {
  return "column" in props;
}

export function ColumnForm(props: Props) {
  const isEdit = isEditProps(props);

  const { createColumn, isPending: isCreating } = useCreateColumn(
    isEdit ? "" : props.boardId,
  );
  const { renameColumn, isPending: isRenaming } = useRenameColumn();


  const isPending = isEdit ? isRenaming : isCreating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TColumnSchema>({
    resolver: zodResolver(ColumnSchema),
    defaultValues: { name: isEdit ? props.column.name : "" },
  });

  const onSubmit = (data: TColumnSchema) => {
    if (isEdit) {
      renameColumn(
        { columnId: props.column.id, boardId: props.column.boardId, name: data.name },
        { onSuccess: props.onSuccess },
      );
    } else {
      createColumn(data.name, { onSuccess: props.onSuccess });
    }
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
        ) : isEdit ? (
          "Save Changes"
        ) : (
          "Create Column"
        )}
      </Button>
    </form>
  );
}
