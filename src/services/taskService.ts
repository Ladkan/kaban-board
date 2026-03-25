import type { Task, TaskMap } from "../types";
import { client } from "./pocketbase";

export const getTasks = async (boardId: string) => {
  const tasks = await client.collection("tasks").getFullList<Task>({
    filter: `column.board = "${boardId}"`,
    sort: "column,order",
    expand: "assignee",
    requestKey: `tasks-${boardId}-${Date.now()}`,
  });

  const tasksByColumn = tasks.reduce<TaskMap>((acc, task) => {
    if (!acc[task.column]) acc[task.column] = [];
    acc[task.column].push(task);
    return acc;
  }, {});

  return tasksByColumn;
};

export const createTask = async (
  columnId: string,
  data: Partial<Task>,
  existing: Task[],
) => {
  const maxOrder = existing.length
    ? Math.max(...existing.map((t) => t.order))
    : 0;

  const task = await client.collection("tasks").create<Task>({
    ...data,
    column: columnId,
    order: maxOrder + 1000,
  });

  return task;
};
