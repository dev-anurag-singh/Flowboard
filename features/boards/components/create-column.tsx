"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnForm } from "./column-form";

type Props = {
  boardId: string;
  children: React.ReactNode;
};

export function CreateColumnModal({ boardId, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 md:p-0">
          <div className="space-y-6 px-6 py-6 md:px-8 md:py-8">
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
            </DialogHeader>
            <ColumnForm boardId={boardId} onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
