import { createClient } from './client';
import { DatabaseCategory, TaskWithCategory, TaskItemType } from '../../types/tasks';

// Helper function to ensure user exists in the users table
async function ensureUserExists(supabase: any, userId: string): Promise<void> {
    const { error } = await supabase
        .from('users')
        .upsert({
            id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'id'
        });

    if (error) {
        console.error('Error creating/updating user:', error);
        throw new Error('Failed to create user record');
    }
}

// Transform database task to TaskItemType
export function transformDatabaseTaskToTaskItem(task: TaskWithCategory): TaskItemType {
    return {
        taskId: task.id,
        title: task.title,
        description: task.description || '',
        dueDate: task.due_date ? new Date(task.due_date) : new Date(),
        createdAt: new Date(task.created_at),
        priority: task.priority,
        status: task.status,
        category: task.categories?.name || 'بدون دسته‌بندی',
    };
}

// Fetch all tasks for the current user
export async function fetchUserTasks(): Promise<TaskItemType[]> {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // Ensure the user exists in the users table
        try {
            await ensureUserExists(supabase, user.id);
        } catch (error) {
            console.error('Error ensuring user exists:', error);
            // Don't throw error here, just log it and continue
        }

        const { data: tasks, error } = await supabase
            .from('tasks')
            .select(`
        *,
        categories (
          id,
          name,
          created_at,
          updated_at
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            throw new Error('Failed to fetch tasks');
        }

        return tasks?.map(transformDatabaseTaskToTaskItem) || [];
    } catch (error) {
        console.error('Error in fetchUserTasks:', error);
        return [];
    }
}

// Fetch a single task by ID
export async function fetchTaskById(taskId: string): Promise<TaskItemType | null> {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data: task, error } = await supabase
            .from('tasks')
            .select(`
        *,
        categories (
          id,
          name,
          created_at,
          updated_at
        )
      `)
            .eq('id', taskId)
            .eq('user_id', user.id)
            .single();

        if (error) {
            console.error('Error fetching task:', error);
            return null;
        }

        return transformDatabaseTaskToTaskItem(task);
    } catch (error) {
        console.error('Error in fetchTaskById:', error);
        return null;
    }
}

// Delete a task
export async function deleteTask(taskId: string): Promise<boolean> {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting task:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteTask:', error);
        return false;
    }
}

// Fetch all global categories
export async function fetchAllCategories(): Promise<DatabaseCategory[]> {
    const supabase = createClient();

    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }

        return categories || [];
    } catch (error) {
        console.error('Error in fetchAllCategories:', error);
        return [];
    }
}

// Create a new task
export async function createTask(taskData: {
    title: string;
    description?: string | undefined;
    due_date?: string | undefined;
    priority: 'low' | 'medium' | 'high';
    status: 'notStarted' | 'inProgress' | 'done';
    category_id?: string | undefined;
}): Promise<TaskItemType | null> {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // First, ensure the user exists in the users table
        await ensureUserExists(supabase, user.id);

        const { data: task, error } = await supabase
            .from('tasks')
            .insert({
                ...taskData,
                user_id: user.id,
            })
            .select(`
        *,
        categories (
          id,
          name,
          created_at,
          updated_at
        )
      `)
            .single();

        if (error) {
            console.error('Error creating task:', error);
            throw new Error('Failed to create task');
        }

        return transformDatabaseTaskToTaskItem(task);
    } catch (error) {
        console.error('Error in createTask:', error);
        return null;
    }
}

// Update an existing task
export async function updateTask(taskId: string, taskData: {
    title?: string;
    description?: string | undefined;
    due_date?: string | undefined;
    priority?: 'low' | 'medium' | 'high';
    status?: 'notStarted' | 'inProgress' | 'done';
    category_id?: string | undefined;
}): Promise<TaskItemType | null> {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data: task, error } = await supabase
            .from('tasks')
            .update(taskData)
            .eq('id', taskId)
            .eq('user_id', user.id)
            .select(`
        *,
        categories (
          id,
          name,
          created_at,
          updated_at
        )
      `)
            .single();

        if (error) {
            console.error('Error updating task:', error);
            throw new Error('Failed to update task');
        }

        return transformDatabaseTaskToTaskItem(task);
    } catch (error) {
        console.error('Error in updateTask:', error);
        return null;
    }
}

// Get category by ID (for validation)
export async function getCategoryById(categoryId: string): Promise<DatabaseCategory | null> {
    const supabase = createClient();

    try {
        const { data: category, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', categoryId)
            .single();

        if (error) {
            console.error('Error fetching category:', error);
            return null;
        }

        return category;
    } catch (error) {
        console.error('Error in getCategoryById:', error);
        return null;
    }
}
