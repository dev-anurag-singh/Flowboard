"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BoardIcon } from "@/icons/board-icon";
import { PlusIcon } from "lucide-react";
import { CreateBoardForm } from "./board-form";

type Props = {
  children?: React.ReactNode;
};

export function CreateBoardModal({ children }: Props) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button variant="link" className="gap-3 p-0" onClick={() => setOpen(true)}>
      <BoardIcon />
      <div className="inline-flex items-center gap-0.5">
        <PlusIcon size={16} className="mt-px" />
        <span className="text-[15px] font-bold">Add New Board</span>
      </div>
    </Button>
  );

  const trigger = children ? (
    <span onClick={() => setOpen(true)}>{children}</span>
  ) : (
    defaultTrigger
  );

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 md:p-0">
          <ScrollArea className="max-h-[90vh] px-6 md:px-8">
            <div className="space-y-6 py-6 md:py-8">
              <DialogHeader>
                <DialogTitle>Add New Board</DialogTitle>
              </DialogHeader>
              <CreateBoardForm onSuccess={() => setOpen(false)} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
