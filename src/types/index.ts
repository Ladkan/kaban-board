export interface Board {
  id: string;
  title: string;
  owner: string;
  members: string[];
  created: string;
  updated: string;
  expand?: {
    owner?: User;
    members?: User[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  order: number;
  priority?: "low" | "medium" | "high";
  column: string;
  assignee?: string;
  due_date?: string;
  created: string;
  updated: string;
  expand?: {
    assignee?: User;
  };
}

export interface Column {
  id: string;
  title: string;
  order: number;
  color?: string;
  board: string;
}

export type Props = {
    field: ReturnType<any>
}

export type TaskMap = Record<string, Task[]>;