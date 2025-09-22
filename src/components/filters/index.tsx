import FilterItem from './filterItem';
import {
  categories,
  priorities,
  statuses,
  sortOptions,
} from '../../constants/filters';
import Block from '../layout/block';
import React, { memo } from 'react';
import { useTaskFiltersContext } from '../../contexts/TaskFiltersContext';

const Filters = memo(function Filters() {
  const { filters, actions } = useTaskFiltersContext();
  return (
    <Block>
      <div className="grid grid-cols-4 gap-4" role="group" aria-label="فیلترهای وظایف">
        <FilterItem
          title="دسته بندی"
          listItems={categories}
          currentValue={filters.categoryFilter}
          onChange={actions.setCategoryFilter}
        />
        <FilterItem
          title="اولویت‌ها"
          listItems={priorities}
          currentValue={filters.priorityFilter}
          onChange={actions.setPriorityFilter}
        />
        <FilterItem
          title="وضعیت"
          listItems={statuses}
          currentValue={filters.statusFilter}
          onChange={actions.setStatusFilter}
        />
        <FilterItem
          title="مرتب سازی"
          listItems={sortOptions}
          currentValue={filters.sortOption}
          onChange={actions.setSortOption}
        />
      </div>
    </Block>
  );
});

export default Filters;
