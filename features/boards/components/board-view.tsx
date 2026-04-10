"use client";

import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { notFound } from "next/navigation";
import { boardByIdQueryOptions, type BoardWithData, type TaskWithSubtasks } from "@/features/boards/queries";
import { useReorderColumn } from "@/features/boards/hooks/use-reorder-column";
import { useReorderTask } from "@/features/boards/hooks/use-reorder-task";
import { useBoardDnd } from "@/features/boards/hooks/use-board-dnd";
import { tasksForColumn } from "@/features/boards/utils/column-tasks";
import { Column, ColumnDragOverlay } from "@/features/boards/components/column";
import { TaskCard } from "@/features/boards/components/task-card";
import { TaskDetail } from "@/features/boards/components/task-detail";
import { Button } from "@/components/ui/button";
import { CreateColumnModal } from "@/features/boards/components/create-column";
import { LayoutTemplate, Plus } from "lucide-react";

export function BoardView({ boardId }: { boardId: string }) {
  const { data: board } = useSuspenseQuery(boardByIdQueryOptions(boardId));
  if (!board) notFound();
  return <BoardContent boardId={boardId} board={board} />;
}

function BoardContent({ boardId, board }: { boardId: string; board: BoardWithData }) {
  const { reorderColumn } = useReorderColumn(boardId);
  const { reorderTask } = useReorderTask(boardId);

  const {
    displayTasks,
    collisionDetection,
    sensors,
    activeColumn,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useBoardDnd({ board, reorderColumn, reorderTask });

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  const columnTasks = useMemo(() => {
    const map = new Map<string, TaskWithSubtasks[]>();
    for (const col of board.columns) {
      map.set(col.id, tasksForColumn(displayTasks, col.id));
    }
    return map;
  }, [board.columns, displayTasks]);

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
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={board.columns.map(c => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          {board.columns.map(column => (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks.get(column.id) ?? []}
              onSelectTask={taskId => {
                setSelectedTaskId(taskId);
                setTaskDetailOpen(true);
              }}
            />
          ))}
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
          {activeColumn && (
            <ColumnDragOverlay
              column={activeColumn}
              tasks={(board.tasks ?? []).filter(t => t.columnId === activeColumn.id)}
            />
          )}
          {activeTask && (
            <div className="rotate-1 scale-[1.03] cursor-grabbing drop-shadow-xl">
              <TaskCard task={activeTask} onSelect={() => {}} />
            </div>
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
