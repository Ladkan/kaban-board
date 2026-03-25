import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useState, useRef } from "react";
import { useColumnStore } from "../../stores/useColumnStore";
import { useTaskStore } from "../../stores/useTaskStore";
import Column from "./Column";
import { TaskCard } from "./TaskCard";
import type { Column as ColumnType, Task } from "../../types";
import { client } from "../../services/pocketbase";

interface KanbanBoardProps {
  boardId: string | undefined;
  onAddTask: (columnId: string) => void;
  onTaskOpen: (task: Task) => void;
}

export default function KanbanBoard({
  onAddTask,
  onTaskOpen,
}: KanbanBoardProps) {
  const columns = useColumnStore((s) => s.columns);
  const reorderColumns = useColumnStore(s => s.reorderColumns)
  const tasksByColumn = useTaskStore((s) => s.tasksByColumn);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null)

  const dragSnapshot = useRef<typeof tasksByColumn | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  function findColumnOfTask(taskId: string): string | undefined {
    const state = useTaskStore.getState().tasksByColumn;
    return Object.entries(state).find(([, tasks]) =>
      tasks.some((t) => t.id === taskId),
    )?.[0];
  }

  function handleDragStart({ active }: DragStartEvent) {
    if (active.data.current?.type === "Column") {
      setActiveColumn(active.data.current.column);
      return;
    }

    const state = useTaskStore.getState().tasksByColumn;
    const task = Object.values(state)
      .flat()
      .find((t) => t.id === active.id);

    setActiveTask(task ?? null);

    dragSnapshot.current = state;
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    if (active.data.current?.type === "Column") return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeColId = findColumnOfTask(activeId);

    const isOverColum = columns.some((c) => c.id === overId);
    const overColId = isOverColum ? overId : findColumnOfTask(overId);

    if (!activeColId || !overColId || activeColId === overColId) return;

    useTaskStore.setState((state) => {
      const fromTasks = [...(state.tasksByColumn[activeColId] ?? [])];
      const toTasks = [...(state.tasksByColumn[overColId] ?? [])];
      const taskIndex = fromTasks.findIndex((t) => t.id === activeId);

      if (taskIndex === -1) return state;

      const [movedTask] = fromTasks.splice(taskIndex, 1);
      const overTaskIdx = toTasks.findIndex((t) => t.id === overId);

      if (overTaskIdx >= 0) {
        toTasks.splice(overTaskIdx, 0, { ...movedTask, column: overColId });
      } else {
        toTasks.push({ ...movedTask, column: overColId });
      }

      return {
        tasksByColumn: {
          ...state.tasksByColumn,
          [activeColId]: fromTasks,
          [overColId]: toTasks,
        },
      };
    });
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    setActiveColumn(null);

    if (!over) {
      if (dragSnapshot.current) {
        useTaskStore.setState({ tasksByColumn: dragSnapshot.current });
      }
      dragSnapshot.current = null;
      return;
    }

    if (active.data.current?.type === "Column") {
      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId !== overId) {
        reorderColumns(activeId, overId);
      }
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const currentState = useTaskStore.getState().tasksByColumn;
    const activeColId = Object.entries(currentState).find(([, tasks]) =>
      tasks.some((t) => t.id === activeId),
    )?.[0];

    if (!activeColId) {
      dragSnapshot.current = null;
      return;
    }

    const items = currentState[activeColId] ?? [];
    const activeIndex = items.findIndex((t) => t.id === activeId);
    const overIndex = items.findIndex((t) => t.id === overId);

    // Reorder v rámci stejného sloupce
    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      const reordered = arrayMove(items, activeIndex, overIndex);
      useTaskStore.setState((state) => ({
        tasksByColumn: { ...state.tasksByColumn, [activeColId]: reordered },
      }));
      await persistColumnOrder(reordered, activeColId);
      dragSnapshot.current = null;
      return;
    }

    await persistColumnOrder(items, activeColId);
    dragSnapshot.current = null;
  }

  async function persistColumnOrder(tasks: Task[], columnId: string) {
    try {
      await Promise.all(
        tasks.map((task, i) =>
          client.collection("tasks").update(task.id, {
            column: columnId,
            order: (i + 1) * 1000,
          }),
        ),
      );
    } catch {
      if (dragSnapshot.current) {
        useTaskStore.setState({ tasksByColumn: dragSnapshot.current });
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
        <section className="h-full flex-1 px-10 pb-10 flex gap-6 items-start overflow-x-scroll md:overflow-auto">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddTask={onAddTask}
              onTaskOpen={onTaskOpen}
            />
          ))}
        </section>
      </SortableContext>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isOverlay />}
        {activeColumn && <Column column={activeColumn} onAddTask={() => {}} onTaskOpen={() => {}} />}
      </DragOverlay>
    </DndContext>
  );
}
