import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import type { Task } from '../types';
import { client } from '../services/pocketbase';

type TaskMap = Record<string, Task[]>;

interface TaskStore {
  tasksByColumn:  TaskMap;
  isLoading:      boolean;
  fetchTasks:     (boardId: string) => Promise<void>;
  createTask:     (columnId: string, data: Partial<Task>) => Promise<void>;
  updateTask:     (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask:     (id: string, columnId: string) => Promise<void>;
  moveTask:       (activeId: string, fromCol: string, toCol: string, newOrder: Task[]) => Promise<void>;
  reorderInColumn:(activeId: string, overId: string, columnId: string) => void;
  moveToColumn:   (taskId: string, fromCol: string, toCol: string) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasksByColumn: {},
  isLoading:     false,

  fetchTasks: async (boardId) => {
    set({ isLoading: true });
    try {
      const tasks = await client.collection('tasks').getFullList<Task>({
        filter: `column.board = "${boardId}"`,
        sort:   'column,order',
        expand: 'assignee',
        requestKey: `tasks-${boardId}-${Date.now()}`,
      });

      const tasksByColumn = tasks.reduce<TaskMap>((acc, task) => {
        if (!acc[task.column]) acc[task.column] = [];
        acc[task.column].push(task);
        return acc;
      }, {});

      set({ tasksByColumn });
    }  catch (err){
      console.error('fetchTasks error:', err)
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (columnId, data) => {
    const existing = get().tasksByColumn[columnId] ?? [];
    const maxOrder = existing.length
      ? Math.max(...existing.map(t => t.order))
      : 0;

    const task = await client.collection('tasks').create<Task>({
      ...data,
      column: columnId,
      order:  maxOrder + 1000,
    });

    set(s => ({
      tasksByColumn: {
        ...s.tasksByColumn,
        [columnId]: [...(s.tasksByColumn[columnId] ?? []), task],
      },
    }));
  },

  updateTask: async (id, data) => {
    await client.collection('tasks').update(id, data);
    set(s => ({
      tasksByColumn: mapAllColumns(s.tasksByColumn, tasks =>
        tasks.map(t => t.id === id ? { ...t, ...data } : t)
      ),
    }));
  },

  deleteTask: async (id, columnId) => {
    await client.collection('tasks').delete(id);
    set(s => ({
      tasksByColumn: {
        ...s.tasksByColumn,
        [columnId]: s.tasksByColumn[columnId].filter(t => t.id !== id),
      },
    }));
  },

  reorderInColumn: (activeId, overId, columnId) => {
    const tasks       = get().tasksByColumn[columnId] ?? [];
    const activeIndex = tasks.findIndex(t => t.id === activeId);
    const overIndex   = tasks.findIndex(t => t.id === overId);
    if (activeIndex === overIndex) return;

    const reordered = arrayMove(tasks, activeIndex, overIndex);

    set(s => ({
      tasksByColumn: { ...s.tasksByColumn, [columnId]: reordered },
    }));

    Promise.all(
      reordered.map((t, i) =>
        client.collection('tasks').update(t.id, { order: (i + 1) * 1000 })
      )
    ).catch(() => {

    });
  },

  moveToColumn: (taskId, fromCol, toCol) => {
    const snapshot = get().tasksByColumn;

    set(s => {
      const fromTasks = s.tasksByColumn[fromCol] ?? [];
      const toTasks   = s.tasksByColumn[toCol]   ?? [];
      const task      = fromTasks.find(t => t.id === taskId);
      if (!task) return s;

      return {
        tasksByColumn: {
          ...s.tasksByColumn,
          [fromCol]: fromTasks.filter(t => t.id !== taskId),
          [toCol]:   [...toTasks, { ...task, column: toCol }],
        },
      };
    });

    client.collection('tasks').update(taskId, { column: toCol }).catch(() => {
      set({ tasksByColumn: snapshot });
    });
  },

  moveTask: async (activeId, fromCol, toCol, newOrder) => {
    const snapshot = get().tasksByColumn;

    set(s => ({
      tasksByColumn: {
        ...s.tasksByColumn,
        [fromCol]: fromCol === toCol ? newOrder : s.tasksByColumn[fromCol].filter(t => t.id !== activeId),
        [toCol]:   newOrder,
      },
    }));

    try {
      await Promise.all(
        newOrder.map((task, i) =>
          client.collection('tasks').update(task.id, {
            column: toCol,
            order:  (i + 1) * 1000,
          })
        )
      );
    } catch {
      set({ tasksByColumn: snapshot });
    }
  },
}));

function mapAllColumns(tasksByColumn: TaskMap, fn: (tasks: Task[]) => Task[]): TaskMap {
  return Object.fromEntries(
    Object.entries(tasksByColumn).map(([colId, tasks]) => [colId, fn(tasks)])
  );
}