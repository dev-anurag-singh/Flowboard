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
import { useDeleteBoard } from "@/features/boards/hooks/use-delete-board";

type Props = {
  boardId: string;
  boardName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteBoardModal({
  boardId,
  boardName,
  open,
  onOpenChange,
}: Props) {
  const { deleteBoard, isPending } = useDeleteBoard();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-6">
        <AlertDialogHeader className="space-y-5 text-left">
          <AlertDialogTitle className="text-xl text-destructive">
            Delete this board?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Are you sure you want to delete the{" "}
            <span className="font-bold text-foreground">{boardName}</span>{" "}
            board? This action will remove all columns and tasks and cannot be
            reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => deleteBoard(boardId)}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
