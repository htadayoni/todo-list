export type TaskItemType = {
  taskId: string;
  title: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'inProgress' | 'todo' | 'done';
  category: string;
};
