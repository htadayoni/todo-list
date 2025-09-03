import TaskItem from './taskItem';

export default function TasksList() {
  return (
    <>
      <TaskItem
        taskId="1"
        title="عنوان تسک"
        description="توضیحات تسک"
        dueDate={new Date(Date.now() + 86400000)} // date +1 day
        createdAt={new Date(Date.now() - 86400000)}
        priority="high"
        status="inProgress"
        category="توسعه"
      />
      <TaskItem
        taskId="2"
        title="عنوان تسک 2"
        description="توضیحات تسک 2"
        dueDate={new Date(Date.now() + 86400000)} // date +1 day
        createdAt={new Date(Date.now() - 86400000)}
        priority="medium"
        status="todo"
        category="توسعه"
      />
      <TaskItem
        taskId="3"
        title="عنوان تسک 3"
        description="توضیحات تسک 3"
        dueDate={new Date(Date.now() + 86400000)} // date +1 day
        createdAt={new Date(Date.now() - 86400000)}
        priority="low"
        status="done"
        category="توسعه"
      />
    </>
  );
}
