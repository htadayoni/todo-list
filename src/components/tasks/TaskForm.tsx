'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TaskItemType, StatusType } from '../../types/tasks';

interface TaskFormProps {
    onSuccess: () => void;
}

interface TaskFormData {
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: StatusType;
    category: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<TaskFormData>({
        defaultValues: {
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium',
            status: 'notStarted',
            category: ''
        }
    });

    const onSubmit = async (data: TaskFormData) => {
        try {
            // Create new task object
            const newTask: TaskItemType = {
                taskId: Date.now().toString(), // Simple ID generation
                title: data.title,
                description: data.description,
                dueDate: new Date(data.dueDate),
                createdAt: new Date(),
                priority: data.priority,
                status: data.status,
                category: data.category
            };

            // TODO: Here you would typically save to your backend/database
            // For now, we'll just log it and show success
            console.log('New task created:', newTask);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message and redirect
            alert('وظیفه با موفقیت ایجاد شد!');
            reset();
            onSuccess();

        } catch (error) {
            console.error('Error creating task:', error);
            alert('خطا در ایجاد وظیفه. لطفاً دوباره تلاش کنید.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان وظیفه *
                </label>
                <input
                    type="text"
                    id="title"
                    {...register('title', {
                        required: 'عنوان وظیفه الزامی است',
                        minLength: {
                            value: 3,
                            message: 'عنوان باید حداقل ۳ کاراکتر باشد'
                        }
                    })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="عنوان وظیفه را وارد کنید"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات
                </label>
                <textarea
                    id="description"
                    {...register('description', {
                        maxLength: {
                            value: 500,
                            message: 'توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد'
                        }
                    })}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="توضیحات وظیفه را وارد کنید"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                        تاریخ سررسید
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        {...register('dueDate', {
                            validate: (value) => {
                                if (!value) return true; // Optional field
                                const selectedDate = new Date(value);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return selectedDate >= today || 'تاریخ سررسید نمی‌تواند در گذشته باشد';
                            }
                        })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dueDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.dueDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                        اولویت
                    </label>
                    <select
                        id="priority"
                        {...register('priority')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="low">کم</option>
                        <option value="medium">متوسط</option>
                        <option value="high">زیاد</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        وضعیت
                    </label>
                    <select
                        id="status"
                        {...register('status')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="notStarted">در انتظار</option>
                        <option value="inProgress">در حال انجام</option>
                        <option value="done">تکمیل شده</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        دسته‌بندی
                    </label>
                    <input
                        type="text"
                        id="category"
                        {...register('category', {
                            maxLength: {
                                value: 50,
                                message: 'دسته‌بندی نمی‌تواند بیش از ۵۰ کاراکتر باشد'
                            }
                        })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="دسته‌بندی وظیفه"
                    />
                    {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-4 space-x-reverse">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                    انصراف
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'در حال ایجاد...' : 'ایجاد وظیفه'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
