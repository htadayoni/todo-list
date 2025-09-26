import { useState, useMemo, useCallback } from 'react';
import { taskList as initialTaskList } from '../mocks/tasks';
import moment from 'moment-jalaali';
import { TaskItemType } from '../types/tasks';

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
}

export function useTaskFilters() {
    const [searchText, setSearchText] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('latest');
    const [tasks, setTasks] = useState<TaskItemType[]>(initialTaskList);

    const resetFilters = useCallback(() => {
        setSearchText('');
        setCategoryFilter('all');
        setPriorityFilter('all');
        setStatusFilter('all');
        setSortOption('latest');
    }, []);

    const deleteTask = useCallback((taskId: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
    }, []);

    const filteredTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
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
    };

    return {
        filters,
        actions,
        filteredTasks,
    };
}
