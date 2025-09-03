import React from 'react';
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

export default function TaskItem({
  taskId,
  title,
  description,
  dueDate,
  createdAt,
  priority,
  status,
  category,
}) {
  const priorityTag = priorityChip[priority] || {};
  const statusTag = statusChip[status] || {};

  return (
    <Block>
      <div className="flex justify-between">
        <div className="flex gap-2 mb-2">
          <h3 className="font-bold">{title}</h3>
          {
            <Chip
              label={priorityTag.label}
              color={priorityTag.color}
              textColor={priorityTag.textColor}
            />
          }
          {
            <Chip
              label={statusTag.label}
              color={statusTag.color}
              textColor={statusTag.textColor}
            />
          }
        </div>
        <div className="flex">
          <PencilSquareIcon className="h-5 w-5 text-gray-500 mx-2" />
          <TrashIcon className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      <p className="mb-2">{description}</p>
      <div className="flex">
        <div className="flex">
          <FolderIcon className="h-5 w-5 text-gray-500" />
          <span className="text-gray-600 mx-2">{category}</span>
        </div>
        <div className="flex">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span className="text-gray-600 mx-2">
            {dueDate.toLocaleDateString()}
          </span>
        </div>
        <div className="flex">
          <ClockIcon className="h-5 w-5 text-gray-500" />
          <span className="text-gray-600 mx-2">
            {createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </Block>
  );
}
