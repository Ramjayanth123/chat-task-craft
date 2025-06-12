
export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export interface Task {
  id: string;
  name: string;
  assignee: string;
  dueDate?: string;
  priority: Priority;
  completed: boolean;
  description?: string;
}

export interface ParsedTask {
  name: string;
  assignee: string;
  dueDate?: string;
  priority: Priority;
  description?: string;
}
