import { useState, useMemo, useCallback, useEffect } from 'react';
import moment from 'moment-jalaali';
import { TaskItemType } from '../types/tasks';
import { fetchUserTasks, deleteTask as deleteTaskFromSupabase } from '../lib/supabase/tasks';

export type TaskFilters = {
    searchText: string;
    categoryFilter: string;
    priorityFilter: string;
    statusFilter: string;
    sortOption: string;
}

export type TaskFilterActions = {
    setSearchText: (value: string) => void;
    setCategoryFilter: (value: string) => void;
    setPriorityFilter: (value: string) => void;
    setStatusFilter: (value: string) => void;
    setSortOption: (value: string) => void;
    resetFilters: () => void;
    deleteTask: (taskId: string) => void;
    getTaskById: (taskId: string) => TaskItemType | undefined;
    refreshTasks: () => Promise<void>;
}

export function useTaskFilters() {
    const [searchText, setSearchText] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('latest');
    const [tasks, setTasks] = useState<TaskItemType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const resetFilters = useCallback(() => {
        setSearchText('');
        setCategoryFilter('all');
        setPriorityFilter('all');
        setStatusFilter('all');
        setSortOption('latest');
    }, []);

    // Load tasks from Supabase on component mount
    useEffect(() => {
        const loadTasks = async () => {
            try {
                setLoading(true);
                setError(null);
                const userTasks = await fetchUserTasks();
                setTasks(userTasks);
            } catch (err) {
                console.error('Error loading tasks:', err);
                setError('خطا در بارگذاری وظایف');
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, []);

    const deleteTask = useCallback(async (taskId: string) => {
        try {
            const success = await deleteTaskFromSupabase(taskId);
            if (success) {
                setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
            } else {
                setError('خطا در حذف وظیفه');
            }
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('خطا در حذف وظیفه');
        }
    }, []);

    const getTaskById = useCallback((taskId: string) => {
        return tasks.find(task => task.taskId === taskId);
    }, [tasks]);

    const refreshTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const userTasks = await fetchUserTasks();
            setTasks(userTasks);
        } catch (err) {
            console.error('Error refreshing tasks:', err);
            setError('خطا در بارگذاری وظایف');
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredTasks = useMemo(() => {
        const filtered = tasks.filter(task => {
            if (categoryFilter !== 'all' && task.category !== categoryFilter) {
                return false;
            }
            if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
                return false;
            }
            if (statusFilter !== 'all' && task.status !== statusFilter) {
                return false;
            }
            return (
                task.title.includes(searchText) || task.description.includes(searchText)
            );
        });

        // Sort the filtered tasks
        return filtered.sort((a, b) => {
            if (sortOption === 'latest') {
                return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
            } else if (sortOption === 'oldest') {
                return moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf();
            }
            return 0;
        });
    }, [tasks, searchText, categoryFilter, priorityFilter, statusFilter, sortOption]);

    const filters: TaskFilters = {
        searchText,
        categoryFilter,
        priorityFilter,
        statusFilter,
        sortOption,
    };

    const actions: TaskFilterActions = {
        setSearchText,
        setCategoryFilter,
        setPriorityFilter,
        setStatusFilter,
        setSortOption,
        resetFilters,
        deleteTask,
        getTaskById,
        refreshTasks,
    };

    return {
        filters,
        actions,
        filteredTasks,
        loading,
        error,
    };
}
