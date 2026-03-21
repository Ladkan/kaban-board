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

export interface Column {
  id: string;
  title: string;
  order: number;
  board: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}