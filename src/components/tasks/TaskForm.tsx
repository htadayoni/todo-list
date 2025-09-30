'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TaskItemType, StatusType, DatabaseCategory } from '../../types/tasks';
import { createTask, updateTask, fetchAllCategories } from '../../lib/supabase/tasks';
import { useTaskFiltersContext } from '../../contexts/TaskFiltersContext';

interface TaskFormProps {
    onSuccess: () => void;
    taskId?: string;
    isEditMode?: boolean;
    initialData?: TaskItemType;
}

interface TaskFormData {
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: StatusType;
    category: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSuccess, taskId, isEditMode = false, initialData }) => {
    const { actions } = useTaskFiltersContext();
    const [categories, setCategories] = useState<DatabaseCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<TaskFormData>({
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            dueDate: initialData?.dueDate ? initialData.dueDate.toISOString().split('T')[0] : '',
            priority: initialData?.priority || 'medium',
            status: initialData?.status || 'notStarted',
            category: '' // Will be set after categories are loaded
        } as TaskFormData
    });


    // Fetch categories on component mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const allCategories = await fetchAllCategories();
                setCategories(allCategories);

                // If in edit mode and we have initial data, set the category
                if (isEditMode && initialData?.category) {
                    const matchingCategory = allCategories.find(cat => cat.name === initialData.category);
                    if (matchingCategory) {
                        reset({
                            title: initialData.title,
                            description: initialData.description,
                            dueDate: initialData.dueDate ? initialData.dueDate.toISOString().split('T')[0] : '',
                            priority: initialData.priority,
                            status: initialData.status,
                            category: matchingCategory.id
                        } as TaskFormData);
                    }
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, [isEditMode, initialData, reset]);

    const onSubmit = async (data: TaskFormData) => {
        try {
            // Get the selected category ID
            const selectedCategory = categories.find(cat => cat.id === data.category);
            const categoryId = selectedCategory?.id || null;

            if (isEditMode) {
                // Update existing task
                const updateData = {
                    title: data.title,
                    description: data.description || undefined,
                    due_date: data.dueDate || undefined,
                    priority: data.priority,
                    status: data.status,
                    category_id: categoryId || undefined,
                };

                const updatedTask = await updateTask(taskId!, updateData);

                if (updatedTask) {
                    alert('وظیفه با موفقیت به‌روزرسانی شد!');
                    await actions.refreshTasks();
                    onSuccess();
                } else {
                    throw new Error('Failed to update task');
                }
            } else {
                // Create new task
                const taskData = {
                    title: data.title,
                    description: data.description || undefined,
                    due_date: data.dueDate || undefined,
                    priority: data.priority,
                    status: data.status,
                    category_id: categoryId || undefined,
                };

                const newTask = await createTask(taskData);

                if (newTask) {
                    alert('وظیفه با موفقیت ایجاد شد!');
                    await actions.refreshTasks();
                    reset();
                    onSuccess();
                } else {
                    throw new Error('Failed to create task');
                }
            }

        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} task:`, error);
            alert(`خطا در ${isEditMode ? 'به‌روزرسانی' : 'ایجاد'} وظیفه. لطفاً دوباره تلاش کنید.`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
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
                    <select
                        id="category"
                        {...register('category', {
                            required: 'انتخاب دسته‌بندی الزامی است'
                        })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                            }`}
                        disabled={loadingCategories}
                    >
                        <option value="">
                            {loadingCategories ? 'در حال بارگذاری...' : 'انتخاب دسته‌بندی'}
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
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
                    {isSubmitting
                        ? (isEditMode ? 'در حال به‌روزرسانی...' : 'در حال ایجاد...')
                        : (isEditMode ? 'به‌روزرسانی وظیفه' : 'ایجاد وظیفه')
                    }
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
