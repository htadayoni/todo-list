'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useTaskFilters } from '../hooks/useTaskFilters';

type TaskFiltersContextType = ReturnType<typeof useTaskFilters>;

const TaskFiltersContext = createContext<TaskFiltersContextType | undefined>(undefined);

type TaskFiltersProviderProps = {
    children: ReactNode;
};

export function TaskFiltersProvider({ children }: TaskFiltersProviderProps) {
    const taskFiltersData = useTaskFilters();

    return (
        <TaskFiltersContext.Provider value={taskFiltersData}>
            {children}
        </TaskFiltersContext.Provider>
    );
}

export function useTaskFiltersContext() {
    const context = useContext(TaskFiltersContext);
    if (context === undefined) {
        throw new Error('useTaskFiltersContext must be used within a TaskFiltersProvider');
    }
    return context;
}
