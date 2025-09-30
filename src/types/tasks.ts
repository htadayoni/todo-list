export type StatusType = 'inProgress' | 'notStarted' | 'done';

export type TaskItemType = {
  taskId: string;
  title: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  status: StatusType;
  category: string;
};

// Database types for Supabase
export type DatabaseTask = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  status: StatusType;
  category_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type DatabaseCategory = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type TaskWithCategory = DatabaseTask & {
  categories?: DatabaseCategory | null;
};
