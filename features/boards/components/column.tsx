"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import type { columns, tasks } from "@/lib/db/schema";

type ColumnWithTasks = typeof columns.$inferSelect & {
  tasks: (typeof tasks.$inferSelect)[];
};

function columnColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
}

export function Column({ column }: { column: ColumnWithTasks }) {
  return (
    <div className="relative flex max-h-full w-72 shrink-0 flex-col overflow-hidden rounded-sm border border-transparent bg-background px-3 [&:has(.column-handle:hover)]:border-border">
      <div className="flex items-center justify-between">
        <div className="column-handle flex w-56 cursor-default items-center gap-2 py-3 overflow-hidden">
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: columnColor(column.id) }}
          />
          <span className="truncate text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {column.name} ({column.tasks.length})
          </span>
        </div>
        <Button size="sm" variant="ghost" className="h-8 w-8 shrink-0 p-0">
          <Ellipsis size={16} />
        </Button>
      </div>
      <ScrollArea className="h-full">
        <div className="space-y-4 pb-3">
          {/* tasks will be rendered here */}
        </div>
      </ScrollArea>
    </div>
  );
}
