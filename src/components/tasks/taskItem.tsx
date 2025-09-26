import React, { memo, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Block from '../layout/block';
import Chip from '../ui/chip';
import { priorityChip, statusChip } from '../../constants/tasks';
import {
  FolderIcon,
  PencilSquareIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';
import { TaskItemType } from '../../types/tasks';
import TaskDetailsPopup from './TaskDetailsPopup';
import ConfirmPopup from '../ui/ConfirmPopup';
import { formatPersianDate } from '../../utils/date';
import { useTaskFiltersContext } from '../../contexts/TaskFiltersContext';

const DEFAULT_CHIP = { label: '', color: '', textColor: '' };

const TaskItem = memo(function TaskItem({
  taskId,
  title,
  description,
  dueDate,
  createdAt,
  priority,
  status,
  category,
}: TaskItemType) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { actions } = useTaskFiltersContext();
  const router = useRouter();

  const priorityTag = useMemo(() => priorityChip[priority] || DEFAULT_CHIP, [priority]);
  const statusTag = useMemo(() => statusChip[status] || DEFAULT_CHIP, [status]);

  const formattedDueDate = useMemo(() => formatPersianDate(dueDate), [dueDate]);
  const formattedCreatedDate = useMemo(() => formatPersianDate(createdAt), [createdAt]);

  const handleTitleClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    actions.deleteTask(taskId);
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleEditClick = () => {
    router.push(`/edit-task/${taskId}`);
  };

  const taskData: TaskItemType = {
    taskId,
    title,
    description,
    dueDate,
    createdAt,
    priority,
    status,
    category,
  };

  return (
    <Block>
      <article
        role="listitem"
        aria-labelledby={`task-title-${taskId}`}
        className="group"
      >
        <div className="flex justify-between">
          <div className="flex gap-2 mb-2">
            <h3
              id={`task-title-${taskId}`}
              className="font-bold cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleTitleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTitleClick();
                }
              }}
              aria-label={`نمایش جزئیات وظیفه: ${title}`}
            >
              {title}
            </h3>
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
          <div className="flex" role="group" aria-label="عملیات وظیفه">
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="ویرایش وظیفه"
              title="ویرایش وظیفه"
              onClick={handleEditClick}
            >
              <PencilSquareIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="حذف وظیفه"
              title="حذف وظیفه"
              onClick={handleDeleteClick}
            >
              <TrashIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        <p className="mb-2" id={`task-description-${taskId}`}>{description}</p>
        <div className="flex flex-wrap gap-4 text-sm max-h-0 opacity-0 overflow-hidden transition-all duration-300 ease-in-out group-hover:max-h-20 group-hover:opacity-100">
          <div className="flex items-center">
            <FolderIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <span className="text-gray-600 mr-2" aria-label={`دسته‌بندی: ${category}`}>
              {category}
            </span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <span className="text-gray-600 mr-2" aria-label={`تاریخ سررسید: ${formattedDueDate}`}>
              {formattedDueDate}
            </span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <span className="text-gray-600 mr-2" aria-label={`تاریخ ایجاد: ${formattedCreatedDate}`}>
              {formattedCreatedDate}
            </span>
          </div>
        </div>
      </article>

      <TaskDetailsPopup
        task={taskData}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />

      <ConfirmPopup
        isOpen={isDeleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف وظیفه"
        message={`آیا مطمئن هستید که می‌خواهید وظیفه "${title}" را حذف کنید؟ این عمل قابل بازگشت نیست.`}
        confirmText="حذف"
        cancelText="انصراف"
      />
    </Block>
  );
});

export default TaskItem;
