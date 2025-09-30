import React, { memo } from 'react';
import Link from 'next/link';
import TaskItem from './taskItem';
import { useTaskFiltersContext } from '../../contexts/TaskFiltersContext';
import Loading from '../ui/loading';

const TasksList = memo(function TasksList() {
  const { filteredTasks, loading, error } = useTaskFiltersContext();

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-8" role="alert">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  // Show empty state with create task button
  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            هیچ وظیفه‌ای یافت نشد
          </h3>
          <p className="text-gray-500 mb-6">
            برای شروع، اولین وظیفه خود را ایجاد کنید
          </p>
          <Link
            href="/new-task"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            ایجاد وظیفه جدید
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="لیست وظایف" role="list" className="space-y-3">
      {filteredTasks.map(task => (
        <TaskItem
          key={task.taskId}
          taskId={task.taskId}
          title={task.title}
          description={task.description}
          dueDate={task.dueDate}
          createdAt={task.createdAt}
          priority={task.priority}
          status={task.status}
          category={task.category}
        />
      ))}
    </section>
  );
});

export default TasksList;
