'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TaskForm from './../../components/tasks/TaskForm';

export default function NewTaskPage() {
    const router = useRouter();

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">افزودن وظیفه جدید</h1>
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

                    <TaskForm onSuccess={handleBack} />
                </div>
            </div>
        </div>
    );
}
