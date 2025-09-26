import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { TaskItemType } from '../../types/tasks';
import { priorityChip, statusChip } from '../../constants/tasks';
import {
    FolderIcon,
    CalendarIcon,
    ClockIcon,
} from '@heroicons/react/24/solid';
import Chip from '../ui/chip';

interface TaskDetailsPopupProps {
    task: TaskItemType | null;
    isOpen: boolean;
    onClose: () => void;
}

const DEFAULT_CHIP = { label: '', color: '', textColor: '' };

const TaskDetailsPopup: React.FC<TaskDetailsPopupProps> = ({ task, isOpen, onClose }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !task) return null;

    const priorityTag = priorityChip[task.priority] || DEFAULT_CHIP;
    const statusTag = statusChip[task.status] || DEFAULT_CHIP;

    const formattedDueDate = task.dueDate.toLocaleDateString('fa-IR');
    const formattedCreatedDate = task.createdAt.toLocaleDateString('fa-IR');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Popup Content */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">جزئیات وظیفه</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="بستن"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title and Status */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                        <div className="flex gap-2 mb-4">
                            <Chip
                                label={priorityTag.label}
                                color={priorityTag.color}
                                textColor={priorityTag.textColor}
                                aria-label={`اولویت: ${priorityTag.label}`}
                            />
                            <Chip
                                label={statusTag.label}
                                color={statusTag.color}
                                textColor={statusTag.textColor}
                                aria-label={`وضعیت: ${statusTag.label}`}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">توضیحات:</h4>
                        <p className="text-gray-600 leading-relaxed">{task.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="flex items-center gap-3">
                            <FolderIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">دسته‌بندی</p>
                                <p className="text-gray-600">{task.category}</p>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">تاریخ سررسید</p>
                                <p className="text-gray-600">{formattedDueDate}</p>
                            </div>
                        </div>

                        {/* Created Date */}
                        <div className="flex items-center gap-3">
                            <ClockIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">تاریخ ایجاد</p>
                                <p className="text-gray-600">{formattedCreatedDate}</p>
                            </div>
                        </div>

                        {/* Task ID */}
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">شناسه وظیفه</p>
                                <p className="text-gray-600 font-mono text-sm">{task.taskId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsPopup;
