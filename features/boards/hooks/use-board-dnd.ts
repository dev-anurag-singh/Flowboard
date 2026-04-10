"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { BoardWithData, Column, TaskWithSubtasks } from "@/features/boards/queries";
import { tasksLayoutSignature } from "@/features/boards/utils/tasks-layout-signature";

type UseBoardDndArgs = {
  board: BoardWithData;
  reorderColumn: (activeId: string, overId: string) => void;
  reorderTask: (taskId: string, toIndex: number, columnId: string) => void;
};

export function useBoardDnd({ board, reorderColumn, reorderTask }: UseBoardDndArgs) {
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<TaskWithSubtasks | null>(null);
  const [draggingTasks, setDraggingTasksState] = useState<TaskWithSubtasks[] | null>(null);

  const draggingTasksRef = useRef<TaskWithSubtasks[] | null>(null);
  const lastOverColumnRef = useRef<string | null>(null);
  const lastCollisionOverIdRef = useRef<string | null>(null);
  const recentlyMovedToNewContainerRef = useRef(false);
  const dragTasksFlushRafRef = useRef<number | null>(null);
  const dragTasksFlushScheduledRef = useRef(false);

  const setDraggingTasks = useCallback((val: TaskWithSubtasks[] | null) => {
    draggingTasksRef.current = val;
    setDraggingTasksState(val);
  }, []);

  const scheduleDraggingTasksReactSync = useCallback((next: TaskWithSubtasks[]) => {
    draggingTasksRef.current = next;
    if (dragTasksFlushScheduledRef.current) return;
    dragTasksFlushScheduledRef.current = true;
    dragTasksFlushRafRef.current = requestAnimationFrame(() => {
      dragTasksFlushRafRef.current = null;
      dragTasksFlushScheduledRef.current = false;
      const latest = draggingTasksRef.current;
      if (latest != null) setDraggingTasksState(latest);
    });
  }, []);

  const cancelDraggingTasksFlush = useCallback(() => {
    if (dragTasksFlushRafRef.current != null) {
      cancelAnimationFrame(dragTasksFlushRafRef.current);
      dragTasksFlushRafRef.current = null;
    }
    dragTasksFlushScheduledRef.current = false;
  }, []);

  const displayTasks = useMemo(
    () => draggingTasks ?? (board.tasks ?? []),
    [draggingTasks, board.tasks],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      recentlyMovedToNewContainerRef.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [draggingTasks]);

  const collisionDetection: CollisionDetection = useCallback(
    args => {
      const activeId = String(args.active.id);
      const isColumnDrag = board.columns.some(c => c.id === activeId);

      if (isColumnDrag) {
        const columnIds = new Set(board.columns.map(c => c.id));
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(c =>
            columnIds.has(String(c.id)),
          ),
        });
      }

      const tasksForCollision = draggingTasksRef.current ?? (board.tasks ?? []);

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        overId = String(overId);
        const overColumn = board.columns.find(c => c.id === overId);
        if (overColumn) {
          const columnTasks = tasksForCollision
            .filter(t => t.columnId === overColumn.id)
            .sort((a, b) => a.order - b.order);
          if (columnTasks.length > 0) {
            const taskIds = new Set(columnTasks.map(t => t.id));
            const closest = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(c =>
                taskIds.has(String(c.id)),
              ),
            });
            const narrowed = closest[0]?.id;
            if (narrowed != null) overId = String(narrowed);
          }
        }
        lastCollisionOverIdRef.current = overId;
        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainerRef.current) {
        lastCollisionOverIdRef.current = activeId;
      }

      return lastCollisionOverIdRef.current
        ? [{ id: lastCollisionOverIdRef.current }]
        : [];
    },
    [board.columns, board.tasks],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      lastOverColumnRef.current = null;
      lastCollisionOverIdRef.current = null;
      const col = board.columns.find(c => c.id === event.active.id);
      if (col) {
        setActiveColumn(col);
        return;
      }
      const task = (board.tasks ?? []).find(t => t.id === event.active.id);
      if (task) {
        setActiveTask(task);
        setDraggingTasks([...(board.tasks ?? [])]);
      }
    },
    [board.columns, board.tasks, setDraggingTasks],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;
      if (board.columns.find(c => c.id === active.id)) return;

      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) return;

      const current = draggingTasksRef.current;
      if (!current) return;

      const overColumn = board.columns.find(c => c.id === overId);
      const overTask = current.find(t => t.id === overId);
      if (!overColumn && !overTask) return;

      const targetColumnId = overColumn ? overColumn.id : overTask!.columnId;
      if (!targetColumnId) return;

      const activeTaskItem = current.find(t => t.id === activeId);
      if (!activeTaskItem) return;

      if (activeTaskItem.columnId === targetColumnId) return;

      const key = `${activeId}:${targetColumnId}`;
      if (lastOverColumnRef.current === key) return;
      lastOverColumnRef.current = key;

      const withoutActive = current.filter(t => t.id !== activeId);
      const targetTasks = withoutActive
        .filter(t => t.columnId === targetColumnId)
        .sort((a, b) => a.order - b.order);

      let insertAt = targetTasks.length;
      if (overTask) {
        const idx = targetTasks.findIndex(t => t.id === overId);
        if (idx !== -1) insertAt = idx;
      }

      const moved = { ...activeTaskItem, columnId: targetColumnId };
      const newTargetTasks = [...targetTasks];
      newTargetTasks.splice(insertAt, 0, moved);

      const otherTasks = withoutActive.filter(t => t.columnId !== targetColumnId);
      const next = [...otherTasks, ...newTargetTasks.map((t, i) => ({ ...t, order: i }))];
      if (tasksLayoutSignature(next) === tasksLayoutSignature(current)) return;
      recentlyMovedToNewContainerRef.current = true;
      scheduleDraggingTasksReactSync(next);
    },
    [board.columns, scheduleDraggingTasksReactSync],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      cancelDraggingTasksFlush();
      setActiveColumn(null);
      setActiveTask(null);
      lastOverColumnRef.current = null;
      lastCollisionOverIdRef.current = null;

      const { active, over } = event;
      const current = draggingTasksRef.current;
      setDraggingTasks(null);

      const isColumnDrag = !!board.columns.find(c => c.id === active.id);
      if (isColumnDrag) {
        if (!over || active.id === over.id) return;
        reorderColumn(String(active.id), String(over.id));
        return;
      }

      if (!current || !over) return;

      const activeId = String(active.id);
      const overId = String(over.id);

      const taskInDragState = current.find(t => t.id === activeId);
      if (!taskInDragState?.columnId) return;

      const columnId = taskInDragState.columnId;
      const originalTask = (board.tasks ?? []).find(t => t.id === activeId);
      const isCrossColumn = originalTask?.columnId !== columnId;

      if (isCrossColumn) {
        const columnTasks = current
          .filter(t => t.columnId === columnId)
          .sort((a, b) => a.order - b.order);
        const toIndex = columnTasks.findIndex(t => t.id === activeId);
        reorderTask(activeId, toIndex === -1 ? 0 : toIndex, columnId);
      } else {
        const columnTasks = (board.tasks ?? [])
          .filter(t => t.columnId === columnId)
          .sort((a, b) => a.order - b.order);
        const overColumn = board.columns.find(c => c.id === overId);
        let toIndex = overColumn ? columnTasks.length : columnTasks.findIndex(t => t.id === overId);
        if (toIndex === -1) toIndex = columnTasks.length;
        if (active.id === over.id) return;
        reorderTask(activeId, toIndex, columnId);
      }
    },
    [board.columns, board.tasks, cancelDraggingTasksFlush, reorderColumn, reorderTask, setDraggingTasks],
  );

  const handleDragCancel = useCallback(() => {
    cancelDraggingTasksFlush();
    setActiveColumn(null);
    setActiveTask(null);
    setDraggingTasks(null);
    lastOverColumnRef.current = null;
    lastCollisionOverIdRef.current = null;
  }, [cancelDraggingTasksFlush, setDraggingTasks]);

  return {
    displayTasks,
    collisionDetection,
    sensors,
    activeColumn,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
