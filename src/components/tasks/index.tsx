import React from 'react';
import TaskItem from './taskItem';
import { TaskItemType } from '../../types/tasks';

type TasksListProps = {
  taskList: TaskItemType[];
};

export default function TasksList({ taskList }: TasksListProps) {
  return (
    <>
      {taskList.map(task => (
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
    </>
  );
}
