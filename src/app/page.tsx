'use client';
import React, { useState } from 'react';
import Search from '../components/search';
import Filters from '../components/filters';
import Overview from '../components/overview';
import TasksList from '../components/tasks';
import { taskList } from '../mocks/tasks';

export default function Home() {
  const [searchText, setSearchText] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('latest');

  const filteredTasks = taskList.filter(task => {
    if (categoryFilter !== 'all' && task.category !== categoryFilter) {
      return false;
    }
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }
    return (
      task.title.includes(searchText) || task.description.includes(searchText)
    );
  });

  filteredTasks.sort((a, b) => {
    if (sortOption === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
      <div className="container h-full">
        <div className="grid gap-4">
          <Filters
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
          <Search searchText={searchText} setSearchText={setSearchText} />
          <Overview taskList={filteredTasks} />
          <TasksList taskList={filteredTasks} />
        </div>
      </div>
    </div>
  );
}
