"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteColumn } from "@/features/boards/hooks/use-delete-column";

type Props = {
  columnId: string;
  boardId: string;
  columnName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteColumnModal({
  columnId,
  boardId,
  columnName,
  open,
  onOpenChange,
}: Props) {
  const { deleteColumn } = useDeleteColumn();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-6">
        <AlertDialogHeader className="space-y-5 text-left">
          <AlertDialogTitle className="text-xl text-destructive">
            Delete this column?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Are you sure you want to delete the{" "}
            <span className="font-bold text-foreground">{columnName}</span>{" "}
            column? This action will remove all tasks in it and cannot be
            reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
          <Button
            variant="destructive"
            onClick={() => {
              deleteColumn({ columnId, boardId });
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
