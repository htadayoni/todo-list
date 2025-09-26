'use client';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTaskFiltersContext } from '../../../contexts/TaskFiltersContext';
import TaskForm from './../../../components/tasks/TaskForm';

export default function EditTaskPage() {
    const router = useRouter();
    const params = useParams();
    const taskId = params.id as string;
    const { actions } = useTaskFiltersContext();

    const handleBack = () => {
        router.push('/');
    };

    // Get task data by ID
    const taskData = actions.getTaskById(taskId);

    // If task not found, redirect to home
    if (!taskData) {
        router.push('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">ویرایش وظیفه</h1>
                        <button
                            onClick={handleBack}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="بازگشت به صفحه اصلی"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <TaskForm
                        onSuccess={handleBack}
                        taskId={taskId}
                        isEditMode={true}
                        initialData={taskData}
                    />
                </div>
            </div>
        </div>
    );
}
