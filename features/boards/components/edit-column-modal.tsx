"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnForm } from "./column-form";

type Props = {
  column: { id: string; boardId: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditColumnModal({ column, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 md:p-0">
        <div className="space-y-6 px-6 py-6 md:px-8 md:py-8">
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
          </DialogHeader>
          <ColumnForm column={column} onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
