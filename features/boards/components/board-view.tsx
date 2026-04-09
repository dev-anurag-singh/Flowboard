"use client";

import { useState } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  boardByIdQueryOptions,
  type BoardWithData,
  type Column as ColumnType,
} from "@/features/boards/queries";
import { Column, ColumnDragOverlay } from "@/features/boards/components/column";
import { TaskDetail } from "@/features/boards/components/task-detail";
import { Button } from "@/components/ui/button";
import { CreateColumnModal } from "@/features/boards/components/create-column";
import { LayoutTemplate, Plus } from "lucide-react";

export function BoardView({ boardId }: { boardId: string }) {
  const queryClient = useQueryClient();
  const { data: board } = useSuspenseQuery(boardByIdQueryOptions(boardId));
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const col = board.columns.find(c => c.id === event.active.id);
    if (col) setActiveColumn(col);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = board.columns.findIndex(c => c.id === active.id);
    const newIndex = board.columns.findIndex(c => c.id === over.id);

    queryClient.setQueryData<BoardWithData>(
      boardByIdQueryOptions(boardId).queryKey,
      old => {
        if (!old) return old;
        return { ...old, columns: arrayMove(old.columns, oldIndex, newIndex) };
      }
    );
  };

  if (!board?.columns?.length) {
    return (
      <main className="grid grow place-items-center p-6">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-secondary p-4">
            <LayoutTemplate size={28} className="text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[15px] font-bold">This board is empty</h2>
            <p className="text-sm text-muted-foreground">
              Add a column to start organizing your tasks.
            </p>
          </div>
          <CreateColumnModal boardId={boardId}>
            <Button className="gap-1.5">
              <Plus size={15} strokeWidth={3} />
              <span className="font-bold">Add New Column</span>
            </Button>
          </CreateColumnModal>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-0 grow gap-4 overflow-x-auto p-4">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={board.columns.map(c => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          {board.columns.map(column => (
            <Column
              key={column.id}
              column={column}
              tasks={(board.tasks ?? []).filter(t => t.columnId === column.id)}
              onSelectTask={taskId => {
                setSelectedTaskId(taskId);
                setTaskDetailOpen(true);
              }}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeColumn && (
            <ColumnDragOverlay
              column={activeColumn}
              tasks={(board.tasks ?? []).filter(
                t => t.columnId === activeColumn.id
              )}
            />
          )}
        </DragOverlay>
      </DndContext>

      <div className="grid ml-2 w-72 shrink-0 place-content-center rounded-md bg-(image:--background-image-column)">
        <CreateColumnModal boardId={boardId}>
          <Button variant="link" className="text-2xl text-muted-foreground">
            + New Column
          </Button>
        </CreateColumnModal>
      </div>

      {selectedTaskId && (
        <TaskDetail
          board={board}
          taskId={selectedTaskId}
          open={taskDetailOpen}
          onOpenChange={open => {
            setTaskDetailOpen(open);
            if (!open) setSelectedTaskId(null);
          }}
        />
      )}
    </main>
  );
}
